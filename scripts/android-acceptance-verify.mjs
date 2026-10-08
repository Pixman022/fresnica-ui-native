import fs from 'node:fs';
import path from 'node:path';

const expectedFiles = ['device.json', 'screenshot.png', 'window.xml', 'manifest.json'];
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function fail(message) {
    throw new Error(message);
}

function readJson(filePath, label) {
    let value;
    try {
        value = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        fail(`Invalid ${label}: ${error.message}`);
    }
    return value;
}

function requireNonEmptyString(value, label) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        fail(`Expected non-empty ${label}`);
    }
}

const bundleArg = process.argv[2];
if (!bundleArg || bundleArg === '--help') {
    console.log('Usage: node scripts/android-acceptance-verify.mjs <acceptance-bundle-directory>');
    process.exit(bundleArg === '--help' ? 0 : 1);
}

const bundleDir = path.resolve(bundleArg);
const stat = fs.statSync(bundleDir, { throwIfNoEntry: false });
if (!stat?.isDirectory()) {
    fail(`Acceptance bundle directory not found: ${bundleDir}`);
}

for (const filename of expectedFiles) {
    const filePath = path.join(bundleDir, filename);
    const fileStat = fs.statSync(filePath, { throwIfNoEntry: false });
    if (!fileStat?.isFile() || fileStat.size === 0) {
        fail(`Missing or empty acceptance evidence file: ${filename}`);
    }
}

const device = readJson(path.join(bundleDir, 'device.json'), 'device.json');
for (const key of [
    'model',
    'apiLevel',
    'androidVersion',
    'locale',
    'windowSize',
    'density',
    'fontScale',
    'nightMode',
]) {
    requireNonEmptyString(device[key], `device.json field ${key}`);
}

const screenshot = fs.readFileSync(path.join(bundleDir, 'screenshot.png'));
if (screenshot.length < pngSignature.length || !screenshot.subarray(0, pngSignature.length).equals(pngSignature)) {
    fail('screenshot.png does not have a valid PNG signature');
}

const hierarchy = fs.readFileSync(path.join(bundleDir, 'window.xml'), 'utf8').trim();
if (!/<hierarchy\b/.test(hierarchy) || !/<node\b/.test(hierarchy)) {
    fail('window.xml does not contain a UIAutomator hierarchy with nodes');
}

const manifest = readJson(path.join(bundleDir, 'manifest.json'), 'manifest.json');
requireNonEmptyString(manifest.capturedAt, 'manifest.json capturedAt');
if (Number.isNaN(Date.parse(manifest.capturedAt))) {
    fail('manifest.json capturedAt is not a valid date');
}
if (!Array.isArray(manifest.files)) {
    fail('manifest.json files must be an array');
}
for (const filename of ['device.json', 'screenshot.png', 'window.xml']) {
    if (!manifest.files.includes(filename)) {
        fail(`manifest.json files is missing ${filename}`);
    }
}

console.log(
    JSON.stringify(
        {
            bundle: bundleDir,
            valid: true,
            device: {
                model: device.model,
                apiLevel: device.apiLevel,
                windowSize: device.windowSize,
                density: device.density,
                fontScale: device.fontScale,
                nightMode: device.nightMode,
            },
            source: manifest.source ?? null,
        },
        null,
        2,
    ),
);
