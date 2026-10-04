import type { ReactElement } from 'react';
import type { AppTheme } from '../src/tokens';
import type { HeaderProps } from '../src/components/Header';

declare const theme: AppTheme;
declare const backIcon: ReactElement;

const staticHeader = {
    theme,
    title: 'Settings',
} satisfies HeaderProps;

const backHeader = {
    theme,
    title: 'Settings',
    leading: backIcon,
    onBack: () => {},
    backAccessibilityLabel: 'Go back',
} satisfies HeaderProps;

// @ts-expect-error A back action must provide a visible leading element.
const missingBackLeading: HeaderProps = {
    theme,
    title: 'Settings',
    onBack: () => {},
    backAccessibilityLabel: 'Go back',
};

// @ts-expect-error A back action must provide a localized accessible label.
const missingBackLabel: HeaderProps = {
    theme,
    title: 'Settings',
    leading: backIcon,
    onBack: () => {},
};

void staticHeader;
void backHeader;
void missingBackLeading;
void missingBackLabel;
