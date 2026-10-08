#!/usr/bin/env bash
set -euo pipefail

: "${ANDROID_HOME:?ANDROID_HOME is required}"
: "${ANDROID_AVD_HOME:?ANDROID_AVD_HOME is required}"
: "${RUNNER_TEMP:?RUNNER_TEMP is required}"

AVD_NAME="fresnica-ci"
SYSTEM_IMAGE="system-images;android-35;google_apis;x86_64"
EMULATOR_LOG="$RUNNER_TEMP/fresnica-emulator.log"

printf "no\n" | timeout 60 "$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager" create avd \
    --force \
    --name "$AVD_NAME" \
    --package "$SYSTEM_IMAGE" \
    --device "pixel"

"$ANDROID_HOME/emulator/emulator" -list-avds | grep -Fxq "$AVD_NAME"

nohup "$ANDROID_HOME/emulator/emulator" \
    -avd "$AVD_NAME" \
    -no-window \
    -no-audio \
    -no-boot-anim \
    -no-snapshot \
    -wipe-data \
    -gpu swiftshader_indirect \
    > "$EMULATOR_LOG" 2>&1 &

EMULATOR_PID=$!

for attempt in $(seq 1 90); do
    if ! kill -0 "$EMULATOR_PID" 2>/dev/null; then
        echo "Android emulator exited before adb detected a device."
        tail -n 200 "$EMULATOR_LOG" || true
        exit 1
    fi

    if adb devices | awk 'NR > 1 && $2 == "device" { found=1 } END { exit found ? 0 : 1 }'; then
        break
    fi

    if [ "$attempt" -eq 90 ]; then
        echo "Timed out waiting for adb to detect the Android emulator."
        tail -n 200 "$EMULATOR_LOG" || true
        exit 1
    fi

    sleep 2
done

timeout 300 bash -c 'until [ "$(adb shell getprop sys.boot_completed | tr -d "\r")" = "1" ]; do sleep 2; done'

adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0
