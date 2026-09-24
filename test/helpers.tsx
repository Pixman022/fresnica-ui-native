import type { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { themes } from '../src/theme';

export function renderWithTheme(children: ReactElement) {
    return render(children);
}

export const theme = themes.light;
