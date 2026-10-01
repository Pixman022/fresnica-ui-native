import { spawnSync } from 'node:child_process';

const adb = process.platform === 'win32' ? 'adb.exe' : 'adb';

function run(args, optional = false) {
    const result = spawnSync(adb, args, {
        encoding: 'utf8',
        shell: false,
    });

    if (result.error) {
        if (optional) {
            return null;
        }
        throw new Error(`Unable to run adb: ${result.error.message}`);
    }
    if (result.status !== 0) {
        if (optional) {
            return null;
        }
        throw new Error(result.stderr.trim() || `adb ${args.join(' ')} failed`);
    }

    return result.stdout.trim();
}

const state = run(['get-state']);
if (state !== 'device') {
    throw new Error(`Expected one ready Android device, received adb state: ${state}`);
}

const persistedLocale = run(['shell', 'getprop', 'persist.sys.locale'], true);
const productLocale = run(['shell', 'getprop', 'ro.product.locale'], true);
const nightMode = run(['shell', 'cmd', 'uimode', 'night'], true);

const info = {
    model: run(['shell', 'getprop', 'ro.product.model']),
    apiLevel: run(['shell', 'getprop', 'ro.build.version.sdk']),
    androidVersion: run(['shell', 'getprop', 'ro.build.version.release']),
    locale: persistedLocale || productLocale || 'unknown',
    windowSize: run(['shell', 'wm', 'size']),
    density: run(['shell', 'wm', 'density']),
    fontScale: run(['shell', 'settings', 'get', 'system', 'font_scale']),
    nightMode: nightMode || 'unknown',
};

console.log(JSON.stringify(info, null, 2));
