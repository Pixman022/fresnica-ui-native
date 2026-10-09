import { nativeThemeColors } from '../src/generated-token-contract.ts';

// These are combinations currently rendered by reusable primitives, not a generic
// Cartesian product of color roles. Review-only entries expose existing design gaps
// without silently changing the approved Web / Native visual baseline.
const combinations = [
    { label: 'primary text on surface', foreground: 'contentPrimary', background: 'surface', minimum: 4.5 },
    { label: 'secondary text on surface', foreground: 'contentSecondary', background: 'surface', minimum: 4.5 },
    { label: 'primary text on canvas', foreground: 'contentPrimary', background: 'background', minimum: 4.5 },
    { label: 'danger button label', foreground: 'onPrimary', background: 'negative', minimum: 4.5 },
    {
        label: 'primary button label',
        foreground: 'onPrimary',
        background: 'primary',
        minimum: 4.5,
        reviewOnly: true,
    },
    {
        label: 'pressed primary button label',
        foreground: 'onPrimary',
        background: 'primaryPressed',
        minimum: 4.5,
        reviewOnly: true,
    },
    {
        label: 'muted supporting copy',
        foreground: 'contentMuted',
        background: 'surface',
        minimum: 4.5,
        reviewOnly: true,
    },
    {
        label: 'positive status label',
        foreground: 'positive',
        background: 'surface',
        minimum: 4.5,
        reviewOnly: true,
    },
    {
        label: 'negative status label',
        foreground: 'negative',
        background: 'surface',
        minimum: 4.5,
        reviewOnly: true,
    },
    {
        label: 'warning status label',
        foreground: 'warning',
        background: 'surface',
        minimum: 4.5,
        reviewOnly: true,
    },
    {
        label: 'control border on surface (where essential)',
        foreground: 'border',
        background: 'surface',
        minimum: 3,
        reviewOnly: true,
    },
];

function luminance(hex) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) {
        throw new Error(`Expected an opaque six-digit hex theme color, received: ${hex}`);
    }
    const channels = [1, 3, 5].map((offset) => {
        const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
    const lightness = [luminance(first), luminance(second)].sort((a, b) => b - a);
    return (lightness[0] + 0.05) / (lightness[1] + 0.05);
}

let failures = 0;
let reviewItems = 0;
for (const [mode, colors] of Object.entries(nativeThemeColors)) {
    for (const pair of combinations) {
        const result = contrast(colors[pair.foreground], colors[pair.background]);
        const passes = result >= pair.minimum;
        const status = passes ? 'PASS' : pair.reviewOnly ? 'REVIEW' : 'FAIL';
        console.log(`[${status}] ${mode}: ${pair.label} = ${result.toFixed(2)}:1 (target ${pair.minimum}:1)`);
        if (!passes && pair.reviewOnly) reviewItems++;
        if (!passes && !pair.reviewOnly) failures++;
    }
}

console.log(
    `Native contrast audit: ${failures} required failures; ${reviewItems} known review-only gaps. See docs/native-contrast-audit.md.`,
);
if (failures > 0) {
    process.exitCode = 1;
}
