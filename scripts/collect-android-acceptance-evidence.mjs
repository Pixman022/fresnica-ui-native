import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const adb = process.platform === 'win32' ? 'adb.exe' : 'adb';
const root = path.resolve(import.meta.dirname, '..');
const evidenceRoot = path.join(root, 'example', 'acceptance-evidence');
const deviceInfoScript = path.join(import.meta.dirname, 'android-device-info.mjs');

function usage() {
    console.log(`Usage:
  npm run example:collect-evidence

With the Fresnica Preview visible on one ready Android device, this command saves:
  screenshot.png
  ui.xml
  device-info.json

Evidence is written under example/acceptance-evidence/ and ignored by Git.`);
}

function run(command, args, options = {}) {
    const result = spawnSync(command, args, {
        encoding: options.binary ? null : 'utf8',
        shell: false,
    });

    if (result.error) {
        throw new Error(`Unable to run ${command}: ${result.error.message}`);
    }
    if (result.status !== 0) {
        const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString('utf8') : result.stderr;
        throw new Error(stderr?.trim() || `${command} ${args.join(' ')} failed`);
    }

    return result.stdout;
}

const args = process.argv.slice(2);
if (args.includes('--help')) {
    usage();
    process.exit(0);
}
if (args.length > 0) {
    throw new Error(`Unknown argument: ${args[0]}`);
}

const state = run(adb, ['get-state']).trim();
if (state !== 'device') {
    throw new Error(`Expected one ready Android device, received adb state: ${state}`);
}

const timestamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const outputDir = path.join(evidenceRoot, timestamp);
fs.mkdirSync(outputDir, { recursive: true });

const deviceInfo = run(process.execPath, [deviceInfoScript]);
fs.writeFileSync(path.join(outputDir, 'device-info.json'), deviceInfo);

const screenshot = run(adb, ['exec-out', 'screencap', '-p'], { binary: true });
fs.writeFileSync(path.join(outputDir, 'screenshot.png'), screenshot);

const remoteHierarchy = '/sdcard/fresnica-acceptance-ui.xml';
try {
    run(adb, ['shell', 'uiautomator', 'dump', remoteHierarchy]);
    const hierarchy = run(adb, ['exec-out', 'cat', remoteHierarchy], { binary: true });
    fs.writeFileSync(path.join(outputDir, 'ui.xml'), hierarchy);
} finally {
    spawnSync(adb, ['shell', 'rm', '-f', remoteHierarchy], { stdio: 'ignore', shell: false });
}

console.log(`Acceptance evidence saved to ${outputDir}`);
