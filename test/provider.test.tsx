import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Button } from '../src/components/Button';
import { Modal } from '../src/components/Modal';
import { Typography } from '../src/components/Typography';
import { FresnicaUiProvider, useUiLocale } from '../src/ui-context';
import { enUS, zhCN } from '../src/locales';
import type { UiLocale } from '../src/locales';
import { themes } from '../src/theme';

function LocaleProbe() {
    const locale = useUiLocale();
    return <Text>{`${locale.close}|${locale.loading}`}</Text>;
}

describe('FresnicaUiProvider', () => {
    it('falls back to the light theme and enUS without a provider', () => {
        const view = render(
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

    it('updates provider theme reactively and lets an explicit component theme win', () => {
        const firstTheme = {
            ...themes.light,
            colors: { ...themes.light.colors, contentPrimary: '#123456', primary: '#345678' },
        };
        const secondTheme = {
            ...themes.dark,
            colors: { ...themes.dark.colors, contentPrimary: '#abcdef', primary: '#56789a' },
        };

        const view = render(
            <FresnicaUiProvider theme={firstTheme}>
                <Typography>Provider text</Typography>
                <Typography theme={themes.light}>Explicit text</Typography>
                <Button label="Provider button" />
            </FresnicaUiProvider>,
        );

        expect(view.getByText('Provider text').props.style).toEqual(
            expect.arrayContaining([expect.objectContaining({ color: '#123456' })]),
        );
        expect(view.getByText('Explicit text').props.style).toEqual(
            expect.arrayContaining([expect.objectContaining({ color: themes.light.colors.contentPrimary })]),
        );
        expect(view.getByRole('button', { name: 'Provider button' }).props.style({ pressed: false })).toEqual(
            expect.arrayContaining([expect.objectContaining({ backgroundColor: '#345678' })]),
        );

        view.rerender(
            <FresnicaUiProvider theme={secondTheme}>
                <Typography>Provider text</Typography>
                <Typography theme={themes.light}>Explicit text</Typography>
                <Button label="Provider button" />
            </FresnicaUiProvider>,
        );

        expect(view.getByText('Provider text').props.style).toEqual(
            expect.arrayContaining([expect.objectContaining({ color: '#abcdef' })]),
        );
        expect(view.getByRole('button', { name: 'Provider button' }).props.style({ pressed: false })).toEqual(
            expect.arrayContaining([expect.objectContaining({ backgroundColor: '#56789a' })]),
        );
    });

    it('updates locale reactively and keeps explicit Modal copy authoritative', () => {
        const onRequestClose = jest.fn();
        const view = render(
            <FresnicaUiProvider theme={themes.light} locale={zhCN}>
                <Modal visible title="Details" onRequestClose={onRequestClose}>
                    <Typography>Body</Typography>
                </Modal>
            </FresnicaUiProvider>,
        );

        expect(view.getByRole('button', { name: '关闭' })).toBeTruthy();

        view.rerender(
            <FresnicaUiProvider theme={themes.light} locale={enUS}>
                <Modal visible title="Details" onRequestClose={onRequestClose} closeAccessibilityLabel="Dismiss">
                    <Typography>Body</Typography>
                </Modal>
            </FresnicaUiProvider>,
        );

        expect(view.getByRole('button', { name: 'Dismiss' })).toBeTruthy();
    });

    it('keeps independent React roots isolated', () => {
        const customTheme = {
            ...themes.light,
            colors: { ...themes.light.colors, contentPrimary: '#654321' },
        };
        const first = render(
            <FresnicaUiProvider theme={customTheme} locale={zhCN}>
                <Typography>First root</Typography>
                <LocaleProbe />
            </FresnicaUiProvider>,
        );
        const second = render(
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

    it('keeps built-in locale keys aligned and falls back missing runtime keys to enUS', () => {
        expect(Object.keys(zhCN)).toEqual(Object.keys(enUS));

        const incompleteLocale = { close: 'Dismiss' } as UiLocale;
        const view = render(
            <FresnicaUiProvider locale={incompleteLocale}>
                <LocaleProbe />
            </FresnicaUiProvider>,
        );

        expect(view.getByText('Dismiss|Loading')).toBeTruthy();
    });
});
