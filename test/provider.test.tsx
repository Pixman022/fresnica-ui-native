import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Button } from '../src/components/Button';
import { Field } from '../src/components/Field';
import { Modal } from '../src/components/Modal';
import { Screen } from '../src/components/Screen';
import { Typography } from '../src/components/Typography';
import { FresnicaUiProvider, useUiLocale } from '../src/ui-context';
import { enUS, zhCN } from '../src/locales';
import type { UiLocale } from '../src/locales';
import { themes } from '../src/theme';
import type { AppTheme } from '../src/tokens';

function LocaleProbe() {
    const locale = useUiLocale();
    return <Text>{`${locale.close}|${locale.loading}`}</Text>;
}

describe('FresnicaUiProvider', () => {
    it('falls back to the light theme and enUS without a provider', async () => {
        const view = await render(
            <>
                <Typography>Default theme text</Typography>
                <LocaleProbe />
            </>,
        );

        expect(view.getByText('Default theme text').props.style).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    color: themes.light.colors.contentPrimary,
                    fontSize: themes.light.typography.body,
                }),
            ]),
        );
        expect(view.getByText('Close|Loading')).toBeTruthy();
    });

    it('updates complete provider themes reactively and lets an explicit component theme win', async () => {
        const firstTheme: AppTheme = {
            ...themes.light,
            colors: {
                ...themes.light.colors,
                background: '#101011',
                surface: '#202022',
                contentPrimary: '#303033',
                primary: '#404044',
                primaryPressed: '#505055',
                onPrimary: '#606066',
                negative: '#707077',
                border: '#808088',
            },
        };
        const secondTheme: AppTheme = {
            ...themes.dark,
            colors: {
                ...themes.dark.colors,
                background: '#111110',
                surface: '#222220',
                contentPrimary: '#333330',
                primary: '#444440',
                primaryPressed: '#555550',
                onPrimary: '#666660',
                negative: '#777770',
                border: '#888880',
            },
        };

        const renderTree = (theme: AppTheme) => (
            <FresnicaUiProvider theme={theme}>
                <Screen>
                    <Typography>Provider text</Typography>
                    <Typography theme={themes.light}>Explicit text</Typography>
                    <Button label="Provider button" />
                    <Field label="Provider field" value="" testID="provider-field" />
                    <Field label="Error field" value="" state="error" testID="error-field" />
                </Screen>
            </FresnicaUiProvider>
        );

        const view = await render(renderTree(firstTheme));

        const expectTheme = (theme: AppTheme) => {
            const providerText = view.getByText('Provider text');
            expect(providerText.props.style).toEqual(
                expect.arrayContaining([expect.objectContaining({ color: theme.colors.contentPrimary })]),
            );
            expect(providerText.parent?.parent?.parent?.props.style).toEqual(
                expect.arrayContaining([expect.objectContaining({ backgroundColor: theme.colors.background })]),
            );
            expect(view.getByText('Explicit text').props.style).toEqual(
                expect.arrayContaining([expect.objectContaining({ color: themes.light.colors.contentPrimary })]),
            );

            const button = view.getByRole('button', { name: 'Provider button' });
            expect(button.props.style({ pressed: false })).toEqual(
                expect.arrayContaining([expect.objectContaining({ backgroundColor: theme.colors.primary })]),
            );
            expect(button.props.style({ pressed: true })).toEqual(
                expect.arrayContaining([expect.objectContaining({ backgroundColor: theme.colors.primaryPressed })]),
            );
            expect(view.getByText('Provider button').props.style).toEqual(
                expect.arrayContaining([expect.objectContaining({ color: theme.colors.onPrimary })]),
            );

            const field = view.getByTestId('provider-field');
            expect(field.props.style).toEqual(
                expect.arrayContaining([expect.objectContaining({ color: theme.colors.contentPrimary })]),
            );
            expect(field.parent?.props.style).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                    }),
                ]),
            );

            const errorField = view.getByTestId('error-field');
            expect(errorField.parent?.props.style).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.negative,
                    }),
                ]),
            );
        };

        expectTheme(firstTheme);
        await view.rerender(renderTree(secondTheme));
        expectTheme(secondTheme);
    });

    it('updates locale reactively and keeps explicit Modal copy authoritative', async () => {
        const onRequestClose = jest.fn();
        const view = await render(
            <FresnicaUiProvider theme={themes.light} locale={zhCN}>
                <Modal visible title="Details" onRequestClose={onRequestClose}>
                    <Typography>Body</Typography>
                </Modal>
            </FresnicaUiProvider>,
        );

        expect(view.getByRole('button', { name: '关闭' })).toBeTruthy();

        await view.rerender(
            <FresnicaUiProvider theme={themes.light} locale={enUS}>
                <Modal visible title="Details" onRequestClose={onRequestClose} closeAccessibilityLabel="Dismiss">
                    <Typography>Body</Typography>
                </Modal>
            </FresnicaUiProvider>,
        );

        expect(view.getByRole('button', { name: 'Dismiss' })).toBeTruthy();
    });

    it('keeps independent React roots isolated', async () => {
        const customTheme = {
            ...themes.light,
            colors: { ...themes.light.colors, contentPrimary: '#654321' },
        };
        const first = await render(
            <FresnicaUiProvider theme={customTheme} locale={zhCN}>
                <Typography>First root</Typography>
                <LocaleProbe />
            </FresnicaUiProvider>,
        );
        const second = await render(
            <>
                <Typography>Second root</Typography>
                <LocaleProbe />
            </>,
        );

        expect(first.getByText('First root').props.style).toEqual(
            expect.arrayContaining([expect.objectContaining({ color: '#654321' })]),
        );
        expect(first.getByText('关闭|加载中')).toBeTruthy();
        expect(second.getByText('Second root').props.style).toEqual(
            expect.arrayContaining([expect.objectContaining({ color: themes.light.colors.contentPrimary })]),
        );
        expect(second.getByText('Close|Loading')).toBeTruthy();
    });

    it('keeps built-in locale keys aligned and falls back missing runtime keys to enUS', async () => {
        expect(Object.keys(zhCN)).toEqual(Object.keys(enUS));

        const incompleteLocale = { close: 'Dismiss' } as UiLocale;
        const view = await render(
            <FresnicaUiProvider locale={incompleteLocale}>
                <LocaleProbe />
            </FresnicaUiProvider>,
        );

        expect(view.getByText('Dismiss|Loading')).toBeTruthy();
    });
});
