import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { AppTheme } from './tokens';
import { themes } from './theme';
import { enUS } from './locales';
import type { UiLocale } from './locales';

type UiContextValue = {
    theme: AppTheme;
    locale: UiLocale;
};

export type FresnicaUiProviderProps = {
    theme?: AppTheme;
    locale?: UiLocale;
    children: ReactNode;
};

const UiContext = createContext<UiContextValue>({
    theme: themes.light,
    locale: enUS,
});

function normalizeLocale(locale?: UiLocale): UiLocale {
    if (!locale) {
        return enUS;
    }

    const runtimeLocale = locale as Partial<UiLocale>;
    const missingKeys = (['close', 'loading'] as const).filter((key) => runtimeLocale[key] == null);

    if (missingKeys.length > 0 && typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn(
            `[fresnica-ui-native] Missing locale keys: ${missingKeys.join(', ')}. Falling back to enUS for those keys.`,
        );
    }

    return {
        close: runtimeLocale.close ?? enUS.close,
        loading: runtimeLocale.loading ?? enUS.loading,
    };
}

export function FresnicaUiProvider({ theme = themes.light, locale = enUS, children }: FresnicaUiProviderProps) {
    const resolvedLocale = useMemo(() => normalizeLocale(locale), [locale]);
    const value = useMemo(() => ({ theme, locale: resolvedLocale }), [theme, resolvedLocale]);

    return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUiTheme(override?: AppTheme): AppTheme {
    const context = useContext(UiContext);
    return override ?? context.theme;
}

export function useUiLocale(): UiLocale {
    return useContext(UiContext).locale;
}
