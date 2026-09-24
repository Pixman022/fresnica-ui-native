import type { AppTheme, ThemeMode, ThemeResolver } from './tokens';
import { generatedTokens } from './generated-token-contract.ts';

const shared = {
    ...generatedTokens,
};

const light: AppTheme = {
    mode: 'light',
    colors: {
        background: '#f9f9fb',
        surface: '#ffffff',
        surfaceRaised: '#ffffff',
        primary: '#00a875',
        primaryPressed: '#008f65',
        onPrimary: '#ffffff',
        contentPrimary: '#1a1c1d',
        contentSecondary: '#3f4942',
        contentMuted: '#8a948e',
        border: '#e3e3e5',
        separator: '#edeef0',
        positive: '#00a875',
        negative: '#c73945',
        warning: '#a87500',
        overlay: 'rgba(15, 18, 16, 0.45)',
        statusBar: '#f9f9fb',
        navigationBar: '#f9f9fb',
    },
    ...shared,
    systemBars: { statusBarStyle: 'dark-content', navigationBarStyle: 'dark-content' },
};

const dark: AppTheme = {
    ...light,
    mode: 'dark',
    colors: {
        ...light.colors,
        background: '#101312',
        surface: '#171b19',
        surfaceRaised: '#202623',
        primary: '#00ca8a',
        primaryPressed: '#00a875',
        contentPrimary: '#f4f7f5',
        contentSecondary: '#c5cec8',
        contentMuted: '#8e9a93',
        border: '#303934',
        separator: '#252c28',
        positive: '#00ca8a',
        overlay: 'rgba(0, 0, 0, 0.62)',
        statusBar: '#101312',
        navigationBar: '#101312',
    },
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
