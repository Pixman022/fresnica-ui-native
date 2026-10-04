import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const adb = process.platform === 'win32' ? 'adb.exe' : 'adb';
const outputRoot = path.join(root, 'artifacts', 'android-acceptance');
const remoteHierarchyPath = '/sdcard/fresnica-acceptance-window.xml';

function runText(command, args, optional = false) {
    const result = spawnSync(command, args, {
        cwd: root,
        encoding: 'utf8',
        shell: false,
    });

    if (result.error || result.status !== 0) {
        if (optional) {
            return null;
        }
        throw new Error(result.error?.message || result.stderr.trim() || `${command} ${args.join(' ')} failed`);
    }

    return result.stdout.trim();
}

function runBinary(command, args) {
    const result = spawnSync(command, args, {
        cwd: root,
        encoding: null,
        maxBuffer: 20 * 1024 * 1024,
        shell: false,
    });

    if (result.error || result.status !== 0) {
        throw new Error(
            result.error?.message || result.stderr?.toString().trim() || `${command} ${args.join(' ')} failed`,
        );
    }

    return result.stdout;
}

const state = runText(adb, ['get-state']);
if (state !== 'device') {
    throw new Error(`Expected one ready Android device, received adb state: ${state}`);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputDir = path.join(outputRoot, stamp);
fs.mkdirSync(outputDir, { recursive: true });

const deviceInfoOutput = runText(process.execPath, [path.join('scripts', 'android-device-info.mjs')]);
const deviceInfo = JSON.parse(deviceInfoOutput);
fs.writeFileSync(path.join(outputDir, 'device.json'), JSON.stringify(deviceInfo, null, 2) + '\n');

const screenshot = runBinary(adb, ['exec-out', 'screencap', '-p']);
fs.writeFileSync(path.join(outputDir, 'screenshot.png'), screenshot);

try {
    runText(adb, ['shell', 'uiautomator', 'dump', remoteHierarchyPath]);
    runText(adb, ['pull', remoteHierarchyPath, path.join(outputDir, 'window.xml')]);
} finally {
    runText(adb, ['shell', 'rm', '-f', remoteHierarchyPath], true);
}

const manifest = {
    capturedAt: new Date().toISOString(),
    files: ['device.json', 'screenshot.png', 'window.xml'],
};
fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(outputDir);
