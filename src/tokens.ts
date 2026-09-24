/** Native-safe token contracts shared by AppTheme and future components. */
export type ThemeMode = 'light' | 'dark' | 'system';

export type ColorToken = string;

export type AppTheme = {
    mode: Exclude<ThemeMode, 'system'>;
    colors: {
        background: ColorToken;
        surface: ColorToken;
        surfaceRaised: ColorToken;
        primary: ColorToken;
        primaryPressed: ColorToken;
        onPrimary: ColorToken;
        contentPrimary: ColorToken;
        contentSecondary: ColorToken;
        contentMuted: ColorToken;
        border: ColorToken;
        separator: ColorToken;
        positive: ColorToken;
        negative: ColorToken;
        warning: ColorToken;
        overlay: ColorToken;
        statusBar: ColorToken;
        navigationBar: ColorToken;
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
    };
    radii: {
        sm: number;
        control: number;
        base: number;
        lg: number;
        pill: number;
    };
    typography: {
        body: number;
        supporting: number;
        action: number;
        sectionTitle: number;
        screenTitle: number;
        display: number;
    };
    sizes: {
        controlSm: number;
        controlCompact: number;
        controlBase: number;
        controlEmphasis: number;
        controlLg: number;
        border: number;
    };
    systemBars: {
        statusBarStyle: 'light-content' | 'dark-content';
        navigationBarStyle: 'light-content' | 'dark-content';
    };
};

/** The app shell resolves `system` from the platform appearance API. */
export type ThemeResolver = (mode: ThemeMode, systemMode?: Exclude<ThemeMode, 'system'>) => AppTheme;

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';
export type ControlSize = 'sm' | 'md' | 'lg';
export type FieldState = 'default' | 'focused' | 'error' | 'disabled';
export type StateViewTone = 'empty' | 'error' | 'success';
