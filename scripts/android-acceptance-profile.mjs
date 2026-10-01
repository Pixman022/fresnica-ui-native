import { spawnSync } from 'node:child_process';

const adb = process.platform === 'win32' ? 'adb.exe' : 'adb';
const supportedWidths = new Set([320, 360, 390, 393, 430]);

function run(args) {
    const result = spawnSync(adb, args, {
        encoding: 'utf8',
        shell: false,
    });

    if (result.error) {
        throw new Error(`Unable to run adb: ${result.error.message}`);
    }
    if (result.status !== 0) {
        throw new Error(result.stderr.trim() || `adb ${args.join(' ')} failed`);
    }

    return result.stdout.trim();
}

function usage() {
    console.log(`Usage:
  node scripts/android-acceptance-profile.mjs --width 320 --font-scale 1.0 --theme light
  node scripts/android-acceptance-profile.mjs --width 430 --font-scale 1.3 --theme dark
  node scripts/android-acceptance-profile.mjs --reset

Options:
  --width <320|360|390|393|430>
  --font-scale <positive number>
  --theme <light|dark>
  --reset
  --help

Profile changes are allowed only on an Android emulator.`);
}

function parseArgs(argv) {
    const options = {};

    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];

        if (argument === '--help') {
            options.help = true;
            continue;
        }
        if (argument === '--reset') {
            options.reset = true;
            continue;
        }
        if (argument === '--width' || argument === '--font-scale' || argument === '--theme') {
            const value = argv[index + 1];
            if (!value || value.startsWith('--')) {
                throw new Error(`Missing value for ${argument}`);
            }

            if (argument === '--width') {
                options.width = Number(value);
            } else if (argument === '--font-scale') {
                options.fontScale = Number(value);
            } else {
                options.theme = value;
            }
            index += 1;
            continue;
        }

        throw new Error(`Unknown argument: ${argument}`);
    }

    return options;
}

function assertReadyEmulator() {
    const state = run(['get-state']);
    if (state !== 'device') {
        throw new Error(`Expected one ready Android device, received adb state: ${state}`);
    }

    const isEmulator = run(['shell', 'getprop', 'ro.kernel.qemu']);
    if (isEmulator !== '1') {
        throw new Error('Acceptance profiles can modify system settings only on an Android emulator.');
    }
}

function parsePhysicalSize(output) {
    const match = output.match(/Physical size:\s*(\d+)x(\d+)/);
    if (!match) {
        throw new Error(`Unable to parse physical display size from: ${output}`);
    }

    return {
        width: Number(match[1]),
        height: Number(match[2]),
    };
}

function parseDensity(output) {
    const overrideMatch = output.match(/Override density:\s*(\d+)/);
    const physicalMatch = output.match(/Physical density:\s*(\d+)/);
    const density = Number(overrideMatch?.[1] ?? physicalMatch?.[1]);

    if (!Number.isFinite(density) || density <= 0) {
        throw new Error(`Unable to parse display density from: ${output}`);
    }

    return density;
}

function printCurrentProfile() {
    console.log(
        JSON.stringify(
            {
                windowSize: run(['shell', 'wm', 'size']),
                density: run(['shell', 'wm', 'density']),
                fontScale: run(['shell', 'settings', 'get', 'system', 'font_scale']),
                nightMode: run(['shell', 'cmd', 'uimode', 'night']),
            },
            null,
            2,
        ),
    );
}

const options = parseArgs(process.argv.slice(2));

if (options.help) {
    usage();
    process.exit(0);
}

if (options.reset) {
    if (options.width !== undefined || options.fontScale !== undefined || options.theme !== undefined) {
        throw new Error('--reset cannot be combined with profile options.');
    }

    assertReadyEmulator();
    run(['shell', 'wm', 'size', 'reset']);
    run(['shell', 'settings', 'put', 'system', 'font_scale', '1.0']);
    run(['shell', 'cmd', 'uimode', 'night', 'auto']);
    printCurrentProfile();
    process.exit(0);
}

if (options.width === undefined && options.fontScale === undefined && options.theme === undefined) {
    usage();
    process.exit(1);
}

if (options.width !== undefined && !supportedWidths.has(options.width)) {
    throw new Error(`Unsupported width: ${options.width}`);
}
if (options.fontScale !== undefined && (!Number.isFinite(options.fontScale) || options.fontScale <= 0)) {
    throw new Error(`Invalid font scale: ${options.fontScale}`);
}
if (options.theme !== undefined && options.theme !== 'light' && options.theme !== 'dark') {
    throw new Error(`Unsupported theme: ${options.theme}`);
}

assertReadyEmulator();

if (options.width !== undefined) {
    const physicalSize = parsePhysicalSize(run(['shell', 'wm', 'size']));
    const density = parseDensity(run(['shell', 'wm', 'density']));
    const widthPixels = Math.round((options.width * density) / 160);
    const heightPixels = Math.round((widthPixels * physicalSize.height) / physicalSize.width);
    run(['shell', 'wm', 'size', `${widthPixels}x${heightPixels}`]);
}

if (options.fontScale !== undefined) {
    run(['shell', 'settings', 'put', 'system', 'font_scale', String(options.fontScale)]);
}

if (options.theme !== undefined) {
    run(['shell', 'cmd', 'uimode', 'night', options.theme === 'dark' ? 'yes' : 'no']);
}

printCurrentProfile();
