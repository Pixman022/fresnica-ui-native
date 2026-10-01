import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const script = path.resolve(import.meta.dirname, 'android-acceptance-profile.mjs');

function run(args) {
    return spawnSync(process.execPath, [script, ...args], {
        encoding: 'utf8',
        shell: false,
    });
}

const help = run(['--help']);
assert.equal(help.status, 0);
assert.match(help.stdout, /--width <320\|360\|390\|393\|430>/);

const invalidWidth = run(['--width', '321']);
assert.notEqual(invalidWidth.status, 0);
assert.match(invalidWidth.stderr, /Unsupported width: 321/);

const invalidFontScale = run(['--width', '320', '--font-scale', 'nope']);
assert.notEqual(invalidFontScale.status, 0);
assert.match(invalidFontScale.stderr, /Invalid font scale: NaN/);

const invalidTheme = run(['--theme', 'sepia']);
assert.notEqual(invalidTheme.status, 0);
assert.match(invalidTheme.stderr, /Unsupported theme: sepia/);

const resetWithProfile = run(['--reset', '--width', '320']);
assert.notEqual(resetWithProfile.status, 0);
assert.match(resetWithProfile.stderr, /--reset cannot be combined with profile options/);

console.log('Android acceptance profile CLI checks passed');
