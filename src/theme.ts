import type { AppTheme, ThemeMode, ThemeResolver } from './tokens';
import { generatedTokens, nativeThemeColors } from './generated-token-contract.ts';

const shared = {
    ...generatedTokens,
};

const light: AppTheme = {
    mode: 'light',
    colors: { ...nativeThemeColors.light },
    ...shared,
    systemBars: { statusBarStyle: 'dark-content', navigationBarStyle: 'dark-content' },
};

const dark: AppTheme = {
    ...light,
    mode: 'dark',
    colors: { ...nativeThemeColors.dark },
    systemBars: { statusBarStyle: 'light-content', navigationBarStyle: 'light-content' },
};

export const resolveTheme: ThemeResolver = (
    mode: ThemeMode,
    systemMode: Exclude<ThemeMode, 'system'> = 'light',
): AppTheme => {
    const resolvedMode = mode === 'system' ? systemMode : mode;
    return resolvedMode === 'dark' ? dark : light;
};

export const themes = { light, dark } as const;
