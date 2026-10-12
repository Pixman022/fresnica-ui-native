import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const executable = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const packed = spawnSync(executable, ['pack', '--json', '--dry-run'], {
    cwd: root,
    encoding: 'utf8',
    shell: false,
});

if (packed.status !== 0) {
    process.stderr.write(packed.stderr || packed.stdout);
    process.exit(packed.status ?? 1);
}

const metadata = JSON.parse(packed.stdout);
assert.equal(metadata.length, 1, 'npm pack must describe exactly one package');
const files = new Set(metadata[0].files.map((entry) => entry.path));

const required = [
    'package.json',
    'dist/index.js',
    'dist/index.d.ts',
    'dist/locales.js',
    'dist/locales.d.ts',
    'README.md',
    'LICENSE',
    'THIRD_PARTY_NOTICES.md',
];

for (const file of required) {
    assert.ok(files.has(file), `Packed package is missing required file: ${file}`);
}

const forbiddenPrefixes = ['example/', 'product/', 'src/', 'test/', 'scripts/'];
for (const file of files) {
    for (const prefix of forbiddenPrefixes) {
        assert.ok(!file.startsWith(prefix), `Packed package contains forbidden source path: ${file}`);
    }
}

assert.deepEqual(packageJson.exports?.['.'], {
    types: './dist/index.d.ts',
    default: './dist/index.js',
});
assert.deepEqual(packageJson.exports?.['./locales'], {
    types: './dist/locales.d.ts',
    default: './dist/locales.js',
});
assert.equal(packageJson.peerDependencies?.react, '19.2.3');
assert.equal(packageJson.peerDependencies?.['react-native'], '0.87.0');

console.log(
    `Packed package contract passed: ${metadata[0].filename} with ${files.size} files; root/locales exports and peers verified.`,
);
