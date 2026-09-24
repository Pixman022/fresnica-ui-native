import fs from 'node:fs';
import path from 'node:path';

const repositoryRoot = path.resolve(import.meta.dirname, '..', '..');
const webRoot = path.join(repositoryRoot, 'fresnica-ui');
const tokenPath = path.join(webRoot, 'design-system', 'tokens.json');
const source = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
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

const nativeRoleMap = {
    background: 'background-canvas',
    surface: 'surface-default',
    contentPrimary: 'content-primary',
    contentSecondary: 'content-secondary',
    border: 'border-default',
    primary: 'action-primary',
    primaryPressed: 'action-primary-pressed',
    positive: 'feedback-success',
    negative: 'feedback-error',
    warning: 'feedback-warning',
};

const missing = required.filter((name) => !semantic[name]);
if (missing.length > 0) {
    console.error(`Missing semantic tokens: ${missing.join(', ')}`);
    process.exitCode = 1;
} else {
    console.log(`Validated ${required.length} native semantic token roles from ${tokenPath}`);
    console.log(
        `Mapped AppTheme roles: ${Object.entries(nativeRoleMap)
            .map(([native, semantic]) => `${native}=${semantic}`)
            .join(', ')}`,
    );
}
