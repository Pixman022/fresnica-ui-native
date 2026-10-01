import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const button = read('src/components/Button.tsx');
assert.match(button, /accessibilityRole="button"/);
assert.match(button, /accessibilityState=\{\{ disabled: isDisabled, busy: loading \}\}/);
assert.match(button, /theme\.sizes\.controlBase/);
assert.match(button, /theme\.radii\.base/);
assert.match(button, /minHeight: heights\[size\]/);
assert.doesNotMatch(button, /\bheight: heights\[size\]/);
assert.match(button, /flexShrink: 1/);

const field = read('src/components/Field.tsx');
assert.match(field, /accessibilityLabel=\{label\}/);
assert.match(field, /editable=\{!disabled\}/);
assert.match(field, /theme\.sizes\.border/);
assert.match(field, /theme\.radii\.control/);

const listRow = read('src/components/ListRow.tsx');
assert.match(listRow, /accessible=\{interactive\}/);
assert.match(listRow, /accessibilityLabel=\{interactive \? accessibilityLabel : undefined\}/);
assert.match(listRow, /description \? `\$\{title\}, \$\{description\}` : title/);
assert.match(listRow, /minWidth: 0/);

const stateView = read('src/components/StateView.tsx');
assert.match(stateView, /action \?/);
assert.match(stateView, /maxWidth: '100%'/);

const modal = read('src/components/Modal.tsx');
assert.match(modal, /accessibilityViewIsModal/);
assert.match(modal, /onRequestClose=\{onRequestClose\}/);
assert.match(modal, /closeAccessibilityLabel/);

const segmented = read('src/components/SegmentedControl.tsx');
assert.match(segmented, /accessible=\{false\}/);
assert.match(segmented, /accessibilityRole="tablist"/);
assert.match(segmented, /accessibilityState=\{\{ selected \}\}/);

const progress = read('src/components/Progress.tsx');
assert.match(progress, /accessibilityRole="progressbar"/);
assert.match(progress, /Math\.max\(0, Math\.min\(1, value\)\)/);

console.log('Native component contract checks passed');
