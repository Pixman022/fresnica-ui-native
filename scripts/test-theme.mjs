import assert from 'node:assert/strict';
import { resolveTheme } from '../src/theme.ts';
import { nativeThemeColors } from '../src/generated-token-contract.ts';

assert.equal(resolveTheme('light').mode, 'light');
assert.equal(resolveTheme('dark').mode, 'dark');
assert.equal(resolveTheme('system', 'dark').mode, 'dark');
assert.equal(resolveTheme('system', 'light').mode, 'light');
assert.equal(resolveTheme('dark').systemBars.statusBarStyle, 'light-content');
assert.equal(resolveTheme('light').systemBars.statusBarStyle, 'dark-content');
assert.deepEqual(resolveTheme('light').colors, nativeThemeColors.light);
assert.deepEqual(resolveTheme('dark').colors, nativeThemeColors.dark);
assert.equal(resolveTheme('dark').colors.contentBody, '#e8efeb');
assert.equal(resolveTheme('light').colors.contentBody, '#1a1c1d');
console.log('Theme resolution checks passed');
