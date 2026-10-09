import fs from 'node:fs';
import path from 'node:path';

const repositoryRoot = path.resolve(import.meta.dirname, '..', '..');
const webRoot = path.join(repositoryRoot, 'fresnica-ui');
const tokenPath = path.join(webRoot, 'design-system', 'tokens.json');
const platformTokenPath = path.join(webRoot, 'design-system', 'platform-token-source.json');
const source = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
const platformSource = JSON.parse(fs.readFileSync(platformTokenPath, 'utf8'));
const semantic = source.semantic?.color ?? {};

const required = [
    'background-canvas',
    'surface-default',
    'content-primary',
    'content-secondary',
    'border-default',
    'action-primary',
    'action-primary-pressed',
    'feedback-success',
    'feedback-error',
    'feedback-warning',
];
const requiredNativeRoles = [
    'background',
    'surface',
    'contentPrimary',
    'contentSecondary',
    'border',
    'primary',
    'primaryPressed',
    'positive',
    'negative',
    'warning',
];

const missing = required.filter((name) => !semantic[name]);
const nativeColors = platformSource.native?.themeColors ?? {};
const nativeRoleMap = platformSource.native?.semanticRoleMap ?? {};
const colorKeys = [
    'background',
    'surface',
    'surfaceRaised',
    'primary',
    'primaryPressed',
    'onPrimary',
    'accentPurple',
    'accentPurpleContainer',
    'accentBlue',
    'accentBlueContainer',
    'accentOrange',
    'accentOrangeContainer',
    'accentYellow',
    'accentYellowContainer',
    'contentPrimary',
    'contentSecondary',
    'contentMuted',
    'border',
    'separator',
    'positive',
    'negative',
    'warning',
    'overlay',
    'statusBar',
    'navigationBar',
];
const missingColorValues = ['light', 'dark'].flatMap((mode) =>
    colorKeys.filter((name) => typeof nativeColors[mode]?.[name] !== 'string').map((name) => `${mode}.${name}`),
);
const missingNativeRoles = requiredNativeRoles.filter((name) => !nativeRoleMap[name]);
const missingRoleTargets = Object.entries(nativeRoleMap)
    .filter(([, semanticName]) => !semantic[semanticName])
    .map(([nativeName, semanticName]) => `${nativeName}=${semanticName}`);
const unmappedNativeColors = colorKeys.filter((key) => !nativeRoleMap[key]);
const unknownNativeRoles = Object.keys(nativeRoleMap).filter((key) => !colorKeys.includes(key));
const overrides = platformSource.native?.platformOverrides ?? [];
const overridesWithoutReasons = overrides.flatMap((override, index) =>
    typeof override.reason !== 'string' || !override.reason.trim() ? [index] : [],
);
const unknownOverrideRoles = overrides.flatMap((override) =>
    (override.roles ?? []).filter((key) => !colorKeys.includes(key)),
);
if (
    missing.length > 0 ||
    missingColorValues.length > 0 ||
    missingNativeRoles.length > 0 ||
    missingRoleTargets.length > 0 ||
    unmappedNativeColors.length > 0 ||
    unknownNativeRoles.length > 0 ||
    overridesWithoutReasons.length > 0 ||
    unknownOverrideRoles.length > 0
) {
    console.error(`Missing semantic tokens: ${missing.join(', ')}`);
    if (missingColorValues.length > 0) {
        console.error(`Missing Native theme colors: ${missingColorValues.join(', ')}`);
    }
    if (missingNativeRoles.length > 0) {
        console.error(`Missing Native semantic roles: ${missingNativeRoles.join(', ')}`);
    }
    if (missingRoleTargets.length > 0) {
        console.error(`Missing Native semantic role targets: ${missingRoleTargets.join(', ')}`);
    }
    if (unmappedNativeColors.length > 0 || unknownNativeRoles.length > 0) {
        console.error(`Invalid Native color-to-role mappings: ${[...unmappedNativeColors, ...unknownNativeRoles].join(', ')}`);
    }
    if (overridesWithoutReasons.length > 0 || unknownOverrideRoles.length > 0) {
        console.error(`Invalid platform overrides: ${overridesWithoutReasons.join(', ')}; unknown roles: ${unknownOverrideRoles.join(', ')}`);
    }
    process.exitCode = 1;
} else {
    console.log(`Validated ${required.length} native semantic token roles from ${tokenPath}`);
    console.log(`Validated Native light/dark color values from ${platformTokenPath}`);
    console.log(
        `Mapped AppTheme roles: ${Object.entries(nativeRoleMap)
            .map(([native, semantic]) => `${native}=${semantic}`)
            .join(', ')}`,
    );
}
