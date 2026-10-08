import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const verifier = path.join(root, 'scripts', 'android-acceptance-verify.mjs');
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function createBundle() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fresnica-acceptance-'));
    fs.writeFileSync(
        path.join(dir, 'device.json'),
        JSON.stringify(
            {
                model: 'Pixel Test',
                apiLevel: '37',
                androidVersion: '16',
                locale: 'en-US',
                windowSize: 'Physical size: 1080x2400',
                density: 'Physical density: 420',
                fontScale: '1.3',
                nightMode: 'Night mode: yes',
            },
            null,
            2,
        ),
    );
    fs.writeFileSync(path.join(dir, 'screenshot.png'), Buffer.concat([pngSignature, Buffer.from('fixture')]));
    fs.writeFileSync(path.join(dir, 'window.xml'), '<?xml version="1.0"?><hierarchy><node text="Preview"/></hierarchy>');
    fs.writeFileSync(
        path.join(dir, 'manifest.json'),
        JSON.stringify(
            {
                capturedAt: '2026-10-08T00:00:00.000Z',
                source: { commit: 'abc123', dirty: false },
                files: ['device.json', 'screenshot.png', 'window.xml'],
            },
            null,
            2,
        ),
    );
    return dir;
}

function run(dir) {
    return spawnSync(process.execPath, [verifier, dir], {
        cwd: root,
        encoding: 'utf8',
        shell: false,
    });
}

const validDir = createBundle();
try {
    const valid = run(validDir);
    assert.equal(valid.status, 0, valid.stderr);
    const output = JSON.parse(valid.stdout);
    assert.equal(output.valid, true);
    assert.equal(output.device.model, 'Pixel Test');
} finally {
    fs.rmSync(validDir, { recursive: true, force: true });
}

const invalidPngDir = createBundle();
try {
    fs.writeFileSync(path.join(invalidPngDir, 'screenshot.png'), 'not a png');
    const invalidPng = run(invalidPngDir);
    assert.notEqual(invalidPng.status, 0);
    assert.match(invalidPng.stderr, /valid PNG signature/);
} finally {
    fs.rmSync(invalidPngDir, { recursive: true, force: true });
}

const invalidXmlDir = createBundle();
try {
    fs.writeFileSync(path.join(invalidXmlDir, 'window.xml'), '<hierarchy></hierarchy>');
    const invalidXml = run(invalidXmlDir);
    assert.notEqual(invalidXml.status, 0);
    assert.match(invalidXml.stderr, /UIAutomator hierarchy with nodes/);
} finally {
    fs.rmSync(invalidXmlDir, { recursive: true, force: true });
}

const invalidJsonDir = createBundle();
try {
    fs.writeFileSync(path.join(invalidJsonDir, 'device.json'), '{');
    const invalidJson = run(invalidJsonDir);
    assert.notEqual(invalidJson.status, 0);
    assert.match(invalidJson.stderr, /Invalid device\.json/);
} finally {
    fs.rmSync(invalidJsonDir, { recursive: true, force: true });
}

console.log('Android acceptance evidence verifier checks passed');
