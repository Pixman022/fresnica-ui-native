import type { AppTheme } from '../src/tokens';
import type { HeaderProps } from '../src/components/Header';

declare const theme: AppTheme;

const staticHeader = {
    theme,
    title: 'Settings',
} satisfies HeaderProps;

const backHeader = {
    theme,
    title: 'Settings',
    onBack: () => {},
    backAccessibilityLabel: 'Go back',
} satisfies HeaderProps;

// @ts-expect-error A back action must provide a localized accessible label.
const missingBackLabel: HeaderProps = {
    theme,
    title: 'Settings',
    onBack: () => {},
};

void staticHeader;
void backHeader;
void missingBackLabel;
