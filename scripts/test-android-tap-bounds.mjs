import assert from 'node:assert/strict';
import { parseTapPoint } from './android-tap-bounds.mjs';

assert.deepEqual(parseTapPoint('<node bounds="[86,1200][946,1300]"/>', 'Field'), { x: 516, y: 1250 });
// Captured from the failing keyboard run: the offscreen input had inverted height.
assert.throws(() => parseTapPoint('<node bounds="[86,1787][946,1772]"/>', 'Field'), /empty or clipped/);
assert.throws(() => parseTapPoint('<node bounds="[86,1200][86,1300]"/>', 'Field'), /empty or clipped/);
assert.throws(() => parseTapPoint('<node/>', 'Field'), /no bounds/);
console.log('Android tap bounds regression checks passed.');
