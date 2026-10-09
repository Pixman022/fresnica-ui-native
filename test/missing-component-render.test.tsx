import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from '../src/components/Button';
import { Divider } from '../src/components/Divider';
import { StateView } from '../src/components/StateView';
import { themes } from '../src/theme';

describe('native component render coverage', () => {
    it('renders Divider as a decorative separator using theme colors and the provided inset', () => {
        for (const theme of [themes.light, themes.dark]) {
            const divider = render(<Divider theme={theme} inset={16} />).toJSON();
            expect(divider).toHaveProperty('props.accessibilityRole', 'none');
            expect(divider).toHaveProperty('props.style.1', {
                backgroundColor: theme.colors.separator,
                marginLeft: 16,
            });
        }
    });

    it('renders StateView with localized copy, summary semantics and a caller-provided action', () => {
        const onPress = jest.fn();
        const stateView = render(
            <StateView
                theme={themes.light}
                tone="error"
                title="无法加载"
                description="请重试"
                action={<Button theme={themes.light} label="重试" onPress={onPress} />}
            />,
        ).toJSON();

        expect(stateView).toHaveProperty('props.accessibilityRole', 'summary');
        expect(screen.getByText('无法加载')).toBeTruthy();
        expect(screen.getByText('请重试')).toBeTruthy();
        fireEvent.press(screen.getByRole('button', { name: '重试' }));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders StateView in Dark theme with optional icon and success copy', () => {
        render(
            <StateView
                theme={themes.dark}
                tone="success"
                title="Completed"
                icon={<Button theme={themes.dark} label="Details" />}
            />,
        );
        expect(screen.getByText('Completed')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Details' })).toBeTruthy();
    });
});
