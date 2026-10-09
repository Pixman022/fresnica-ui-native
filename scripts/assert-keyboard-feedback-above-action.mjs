import { readFileSync } from 'node:fs';

const hierarchyPath = process.argv[2];
if (!hierarchyPath) {
    console.error('Usage: node assert-keyboard-feedback-above-action.mjs <window.xml>');
    process.exit(2);
}

const hierarchy = readFileSync(hierarchyPath, 'utf8');

function visibleBounds(label) {
    const marker = `content-desc="${label}"`;
    const index = hierarchy.indexOf(marker);
    if (index < 0 || hierarchy.indexOf(marker, index + marker.length) >= 0) {
        throw new Error(`Expected exactly one accessibility element for ${label}`);
    }

    const close = hierarchy.indexOf('>', index);
    const match = /bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/.exec(hierarchy.slice(index, close));
    if (!match) {
        throw new Error(`Missing bounds for ${label}`);
    }
    const [left, top, right, bottom] = match.slice(1).map(Number);
    if (left >= right || top >= bottom) {
        throw new Error(`Empty bounds for ${label}`);
    }
    return { top, bottom };
}

const feedback = visibleBounds('Keyboard action was pressed');
const button = visibleBounds('Primary action below keyboard field');
if (feedback.bottom > button.top) {
    throw new Error(`Feedback extends below the action (feedback bottom ${feedback.bottom}, action top ${button.top})`);
}
console.log(`Visible feedback ends at ${feedback.bottom}; action begins at ${button.top}.`);
