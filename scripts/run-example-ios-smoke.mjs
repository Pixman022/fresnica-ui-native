import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const projectDir = path.join(root, 'example', 'FresnicaPreview');
const iosDir = path.join(projectDir, 'ios');
const workspace = path.join(iosDir, 'FresnicaPreview.xcworkspace');
const evidenceDir = path.join(root, process.env.IOS_PREVIEW_EVIDENCE_DIR ?? 'example/ios-runtime-evidence');
const derivedData = path.join(root, 'example', '.cache', 'ios-smoke-derived-data');
const screenshotPath = path.join(evidenceDir, 'launch.png');
const metadataPath = path.join(evidenceDir, 'metadata.json');
const deviceName = process.env.IOS_PREVIEW_DEVICE ?? 'iPhone 16';
const runtimeVersion = process.env.IOS_PREVIEW_RUNTIME ?? '18.5';
const contentSize = process.env.IOS_PREVIEW_CONTENT_SIZE ?? '';
const appearance = process.env.IOS_PREVIEW_APPEARANCE ?? '';
const previewLocale = process.env.IOS_PREVIEW_LOCALE ?? 'en';
const previewScenario = process.env.IOS_PREVIEW_SCENARIO ?? 'standard';

function run(command, args, cwd = root, capture = false) {
    const result = spawnSync(command, args, {
        cwd,
        encoding: capture ? 'utf8' : undefined,
        stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
        shell: false,
    });

    if (result.status !== 0) {
        if (capture) {
            process.stderr.write(result.stderr ?? '');
        }
        process.exit(result.status ?? 1);
    }

    return capture ? (result.stdout ?? '').trim() : '';
}

if (process.platform !== 'darwin') {
    throw new Error('The iOS runtime smoke check requires macOS.');
}

if (!fs.existsSync(projectDir)) {
    throw new Error('Preview host is missing. Run npm run example:bootstrap first.');
}

if (!fs.existsSync(workspace)) {
    run('bundle', ['install'], projectDir);
    run('bundle', ['exec', 'pod', 'install'], iosDir);
}

fs.rmSync(evidenceDir, { recursive: true, force: true });
fs.rmSync(derivedData, { recursive: true, force: true });
fs.mkdirSync(evidenceDir, { recursive: true });
fs.mkdirSync(path.dirname(derivedData), { recursive: true });

const devices = JSON.parse(run('xcrun', ['simctl', 'list', 'devices', 'available', '-j'], root, true));
const runtimeKey = Object.keys(devices.devices).find((key) => key.endsWith(`iOS-${runtimeVersion.replace('.', '-')}`));
if (!runtimeKey) {
    throw new Error(`iOS ${runtimeVersion} Simulator runtime is not installed.`);
}

const device = devices.devices[runtimeKey].find((candidate) => candidate.name === deviceName);
if (!device) {
    throw new Error(`${deviceName} is not available for iOS ${runtimeVersion}.`);
}

if (device.state !== 'Booted') {
    run('xcrun', ['simctl', 'boot', device.udid]);
}
run('xcrun', ['simctl', 'bootstatus', device.udid, '-b']);

if (contentSize) {
    run('xcrun', ['simctl', 'ui', device.udid, 'content_size', contentSize]);
}
if (appearance) {
    run('xcrun', ['simctl', 'ui', device.udid, 'appearance', appearance]);
}

run(
    'xcodebuild',
    [
        '-workspace',
        workspace,
        '-scheme',
        'FresnicaPreview',
        '-configuration',
        'Release',
        '-sdk',
        'iphonesimulator',
        '-destination',
        `id=${device.udid}`,
        '-derivedDataPath',
        derivedData,
        'CODE_SIGNING_ALLOWED=NO',
        'build',
    ],
    iosDir,
);

const appPath = path.join(derivedData, 'Build', 'Products', 'Release-iphonesimulator', 'FresnicaPreview.app');
if (!fs.existsSync(appPath)) {
    throw new Error(`Built Preview app was not found at ${appPath}`);
}

const bundleId = run(
    '/usr/libexec/PlistBuddy',
    ['-c', 'Print :CFBundleIdentifier', path.join(appPath, 'Info.plist')],
    root,
    true,
);

run('xcrun', ['simctl', 'install', device.udid, appPath]);
run('xcrun', [
    'simctl',
    'spawn',
    device.udid,
    'defaults',
    'write',
    bundleId,
    'FresnicaPreviewLocale',
    '-string',
    previewLocale,
]);
run('xcrun', [
    'simctl',
    'spawn',
    device.udid,
    'defaults',
    'write',
    bundleId,
    'FresnicaPreviewScenario',
    '-string',
    previewScenario,
]);
run('xcrun', ['simctl', 'launch', '--terminate-running-process', device.udid, bundleId]);
run('sleep', ['5']);
run('xcrun', ['simctl', 'io', device.udid, 'screenshot', screenshotPath]);

const metadata = {
    device: deviceName,
    runtime: `iOS ${runtimeVersion}`,
    udid: device.udid,
    bundleId,
    configuration: 'Release',
    packageVersion: '1.1.0-rc.1',
    sourceSha: process.env.GITHUB_SHA ?? 'local',
    xcode: run('xcodebuild', ['-version'], root, true),
    node: run('node', ['--version'], root, true),
    contentSize: contentSize || 'default',
    appearance: appearance || 'system',
    previewLocale,
    previewScenario,
    screenshot: path.relative(root, screenshotPath),
};

fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);
console.log(JSON.stringify(metadata, null, 2));
