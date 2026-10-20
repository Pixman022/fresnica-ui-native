import { fireEvent, render, screen } from '@testing-library/react-native';
import { Modal as NativeModal, Pressable, ScrollView, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Field } from '../src/components/Field';
import { Header } from '../src/components/Header';
import { IconButton } from '../src/components/IconButton';
import { InlineMessage } from '../src/components/InlineMessage';
import { ListRow } from '../src/components/ListRow';
import { Modal } from '../src/components/Modal';
import { Progress } from '../src/components/Progress';
import { Screen } from '../src/components/Screen';
import { SegmentedControl } from '../src/components/SegmentedControl';
import { Skeleton } from '../src/components/Skeleton';
import { StatusBadge } from '../src/components/StatusBadge';
import { Typography } from '../src/components/Typography';
import { resolveTheme, themes } from '../src/theme';
import { theme } from './helpers';
import { setMockFontScale, setMockPlatform } from './react-native-mock';

describe('native components', () => {
    afterEach(() => {
        setMockFontScale(1);
        setMockPlatform('ios');
    });
    it('resolves explicit and system theme modes', async () => {
        expect(resolveTheme('light')).toBe(themes.light);
        expect(resolveTheme('dark')).toBe(themes.dark);
        expect(resolveTheme('system')).toBe(themes.light);
        expect(resolveTheme('system', 'dark')).toBe(themes.dark);
    });

    it('renders Button and invokes onPress', async () => {
        const onPress = jest.fn();
        await render(<Button label="Continue" theme={theme} onPress={onPress} />);

        await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('exposes Button loading and disabled state', async () => {
        const onPress = jest.fn();
        await render(<Button label="Continue" theme={theme} loading onPress={onPress} />);
        const button = screen.getByRole('button', { name: 'Continue' });
        expect(button).toBeBusy();
        expect(button).toBeDisabled();
        expect(screen.getByText('Loading')).toBeTruthy();

        expect(button.props.onPress).toBeUndefined();
        expect(onPress).not.toHaveBeenCalled();
    });

    it('uses caller loading copy when provided', async () => {
        await render(<Button label="Submit" theme={theme} loading loadingLabel="Submitting" />);
        expect(screen.getByText('Submitting')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeBusy();
    });

    it('keeps disabled Button noninteractive', async () => {
        const onPress = jest.fn();
        await render(<Button label="Disabled" theme={theme} disabled onPress={onPress} />);
        const button = screen.getByRole('button', { name: 'Disabled' });
        expect(button.props.onPress).toBeUndefined();
        expect(onPress).not.toHaveBeenCalled();
    });

    it('applies distinct normal and pressed styles for all Button variants', async () => {
        const variants = ['primary', 'secondary', 'quiet', 'danger'] as const;
        for (const variant of variants) {
            const testID = `button-${variant}`;
            await render(<Button label={variant} theme={theme} variant={variant} testID={testID} />);
            const button = screen.getByTestId(testID);
            const normal = button.props.style({ pressed: false });
            const pressed = button.props.style({ pressed: true });

            if (variant === 'primary') {
                expect(normal).toEqual(
                    expect.arrayContaining([expect.objectContaining({ backgroundColor: theme.colors.primary })]),
                );
                expect(pressed).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            backgroundColor: theme.colors.primaryPressed,
                            borderColor: theme.colors.primaryPressed,
                        }),
                    ]),
                );
            } else if (variant === 'danger') {
                expect(normal).toEqual(
                    expect.arrayContaining([expect.objectContaining({ backgroundColor: theme.colors.negative })]),
                );
                expect(pressed).toEqual(expect.arrayContaining([expect.objectContaining({ opacity: 0.82 })]));
            } else {
                expect(normal).toEqual(
                    expect.arrayContaining([expect.objectContaining({ backgroundColor: 'transparent' })]),
                );
                expect(pressed).toEqual(
                    expect.arrayContaining([expect.objectContaining({ backgroundColor: theme.colors.surfaceRaised })]),
                );
            }
        }
    });

    it('expands the compact Button touch target without changing its visual token height', async () => {
        await render(<Button label="Compact" theme={theme} size="sm" />);
        expect(screen.getByRole('button', { name: 'Compact' }).props.hitSlop).toEqual({
            top: 4,
            bottom: 4,
            left: 0,
            right: 0,
        });
    });

    it('forwards Button test and native identifiers to its pressable node', async () => {
        await render(<Button label="Continue" theme={theme} testID="continue-button" nativeID="continue-native" />);
        const button = screen.getByTestId('continue-button');
        expect(button.props.nativeID).toBe('continue-native');
        expect(button.props.accessibilityState).toEqual({ disabled: false, busy: false });
    });

    it('renders Field with an accessible label and error text', async () => {
        await render(<Field label="Amount" theme={theme} state="error" supportingText="Enter a valid amount" />);
        const field = screen.getByLabelText('Amount');
        expect(field.props.accessibilityState).toEqual({ disabled: false });
        expect(field.props.accessibilityHint).toBe('Enter a valid amount');
        expect(screen.getByText('Enter a valid amount')).toBeTruthy();
    });

    it('exposes disabled Field semantics without allowing passthrough props to re-enable input', async () => {
        await render(<Field label="Disabled amount" theme={theme} state="disabled" editable value="123" />);

        const field = screen.getByLabelText('Disabled amount');
        expect(field).toBeDisabled();
        expect(field.props.accessibilityState).toEqual({ disabled: true });
        expect(field.props.editable).toBe(false);
    });

    it('forwards native Field props, styles, identifiers and input events to the TextInput node', async () => {
        const onFocus = jest.fn();
        const onBlur = jest.fn();
        const onSubmitEditing = jest.fn();

        await render(
            <Field
                label="Amount"
                theme={theme}
                value="12"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                spellCheck={false}
                inputMode="decimal"
                keyboardType="decimal-pad"
                returnKeyType="done"
                maxLength={18}
                multiline
                testID="amount-input"
                nativeID="amount-native"
                containerTestID="amount-field"
                accessibilityLabel="Transfer amount"
                accessibilityHint="Amount hint"
                accessibilityState={{ busy: true }}
                style={{ opacity: 0.9 }}
                containerStyle={{ marginTop: 4 }}
                onFocus={onFocus}
                onBlur={onBlur}
                onSubmitEditing={onSubmitEditing}
            />,
        );

        const field = screen.getByTestId('amount-input');
        expect(field.props.nativeID).toBe('amount-native');
        expect(field.props.autoComplete).toBe('email');
        expect(field.props.spellCheck).toBe(false);
        expect(field.props.inputMode).toBe('decimal');
        expect(field.props.keyboardType).toBe('decimal-pad');
        expect(field.props.returnKeyType).toBe('done');
        expect(field.props.maxLength).toBe(18);
        expect(field.props.multiline).toBe(true);
        expect(field.props.accessibilityLabel).toBe('Transfer amount');
        expect(field.props.accessibilityHint).toBe('Amount hint');
        expect(field.props.accessibilityState).toEqual({ busy: true, disabled: false });
        expect(field.props.style).toEqual(expect.arrayContaining([{ opacity: 0.9 }]));
        expect(screen.getByTestId('amount-field').props.style).toEqual(expect.arrayContaining([{ marginTop: 4 }]));

        const focusEvent = { nativeEvent: {} };
        const blurEvent = { nativeEvent: {} };
        const submitEvent = { nativeEvent: { text: '12' } };
        await fireEvent(field, 'focus', focusEvent);
        await fireEvent(field, 'blur', blurEvent);
        await fireEvent(field, 'submitEditing', submitEvent);

        expect(onFocus).toHaveBeenCalledWith(focusEvent);
        expect(onBlur).toHaveBeenCalledWith(blurEvent);
        expect(onSubmitEditing).toHaveBeenCalledWith(submitEvent);
    });

    it('forwards secure-input props without deriving secret copy and keeps disabled state authoritative', async () => {
        const { rerender } = await render(
            <Field
                label="Secure input"
                theme={theme}
                value="test-only-secret"
                secureTextEntry
                autoComplete="off"
                importantForAutofill="no"
                textContentType="none"
                autoCorrect={false}
                spellCheck={false}
                testID="secure-input"
            />,
        );

        let field = screen.getByTestId('secure-input');
        expect(field.props.secureTextEntry).toBe(true);
        expect(field.props.autoComplete).toBe('off');
        expect(field.props.importantForAutofill).toBe('no');
        expect(field.props.textContentType).toBe('none');
        expect(field.props.autoCorrect).toBe(false);
        expect(field.props.spellCheck).toBe(false);
        expect(field.props.value).toBe('test-only-secret');
        expect(field.props.accessibilityLabel).toBe('Secure input');
        expect(field.props.accessibilityHint).toBeUndefined();
        expect(screen.queryByText('test-only-secret')).toBeNull();

        await rerender(
            <Field
                label="Secure input"
                theme={theme}
                value="test-only-secret"
                secureTextEntry
                autoComplete="off"
                importantForAutofill="no"
                textContentType="none"
                autoCorrect={false}
                spellCheck={false}
                state="disabled"
                editable
                testID="secure-input"
            />,
        );

        field = screen.getByTestId('secure-input');
        expect(field).toBeDisabled();
        expect(field.props.editable).toBe(false);
        expect(field.props.accessibilityState).toEqual({ disabled: true });
        expect(field.props.accessibilityLabel).toBe('Secure input');
        expect(field.props.accessibilityHint).toBeUndefined();
        expect(screen.queryByText('test-only-secret')).toBeNull();
    });

    it('treats native editable=false as disabled even when an error state is requested', async () => {
        await render(
            <Field
                label="Read-only amount"
                theme={theme}
                state="error"
                editable={false}
                supportingText="Old validation error"
            />,
        );

        const field = screen.getByLabelText('Read-only amount');
        expect(field).toBeDisabled();
        expect(field.props.editable).toBe(false);
        expect(field.props.accessibilityState).toEqual({ disabled: true });
        expect(field.props.accessibilityHint).toBeUndefined();
    });

    it('exposes IconButton label, disabled state and native identifiers', async () => {
        await render(
            <IconButton
                label="Open settings"
                theme={theme}
                icon={<Typography theme={theme}>gear</Typography>}
                disabled
                testID="settings-button"
                nativeID="settings-native"
            />,
        );
        const button = screen.getByTestId('settings-button');
        expect(button).toBeDisabled();
        expect(button.props.nativeID).toBe('settings-native');
    });

    it('exposes Header back action and heading title', async () => {
        await render(
            <Header
                title="Settings"
                theme={theme}
                leading={<Typography theme={theme}>‹</Typography>}
                onBack={jest.fn()}
                backAccessibilityLabel="Go back"
            />,
        );
        expect(screen.getByRole('button', { name: 'Go back' })).toBeTruthy();
        expect(screen.getByRole('header', { name: 'Settings' })).toBeTruthy();
    });

    it('allows Header titles to use two lines before truncating', async () => {
        await render(<Header title="A deliberately long account settings title" theme={theme} />);
        expect(screen.getByText('A deliberately long account settings title').props.numberOfLines).toBe(2);
    });

    it('lets Header titles grow at iOS accessibility text sizes', async () => {
        setMockFontScale(2);
        await render(<Header title="A deliberately long account settings title" theme={theme} />);
        expect(screen.getByText('A deliberately long account settings title').props.numberOfLines).toBeUndefined();
    });

    it('reclaims empty Header side slots at iOS accessibility text sizes', async () => {
        setMockFontScale(2);
        await render(<Header title="A deliberately long account settings title" theme={theme} />);

        const views = screen.container.findAllByType(View);
        expect(views).toHaveLength(1);
    });

    it('keeps a real Header back-action slot at iOS accessibility text sizes', async () => {
        setMockFontScale(2);
        await render(
            <Header
                title="A deliberately long account settings title"
                theme={theme}
                leading={<Typography theme={theme}>‹</Typography>}
                onBack={jest.fn()}
                backAccessibilityLabel="Go back"
            />,
        );

        const views = screen.container.findAllByType(View);
        expect(views).toHaveLength(2);
        expect(screen.getByRole('button', { name: 'Go back' })).toBeTruthy();
    });

    it('keeps Header standard truncation and side slots on Android at large font scale', async () => {
        setMockPlatform('android');
        setMockFontScale(2);
        await render(<Header title="A deliberately long account settings title" theme={theme} />);

        expect(screen.getByText('A deliberately long account settings title').props.numberOfLines).toBe(2);
        expect(screen.container.findAllByType(View)).toHaveLength(3);
    });

    it('exposes ListRow button and disabled state', async () => {
        await render(<ListRow title="Security" theme={theme} onPress={jest.fn()} disabled />);
        expect(screen.getByRole('button', { name: 'Security' })).toBeDisabled();
    });

    it('includes ListRow description in an interactive accessibility label', async () => {
        await render(<ListRow title="Security" description="Manage access and backups" theme={theme} onPress={jest.fn()} />);
        expect(screen.getByRole('button', { name: 'Security, Manage access and backups' })).toBeTruthy();
    });

    it('keeps noninteractive ListRow content outside a grouped button', async () => {
        await render(<ListRow title="Network" description="Testnet connected" theme={theme} />);
        expect(screen.queryByRole('button')).toBeNull();
        expect(screen.getByText('Network')).toBeTruthy();
        expect(screen.getByText('Testnet connected')).toBeTruthy();
    });

    it('stacks ListRow trailing content at iOS accessibility text sizes', async () => {
        setMockFontScale(2);
        await render(
            <ListRow
                title="Network"
                description="Testnet connected"
                theme={theme}
                trailing={<StatusBadge theme={theme} label="Connected" tone="positive" />}
            />,
        );

        const row = screen.container.findByType(Pressable);
        expect(row.props.style({ pressed: false })).toEqual(
            expect.arrayContaining([expect.objectContaining({ flexWrap: 'wrap', alignItems: 'flex-start' })]),
        );
    });

    it('keeps ListRow trailing content horizontal on Android at large font scale', async () => {
        setMockPlatform('android');
        setMockFontScale(2);
        await render(
            <ListRow
                title="Network"
                description="Testnet connected"
                theme={theme}
                trailing={<StatusBadge theme={theme} label="Connected" tone="positive" />}
            />,
        );

        const row = screen.container.findByType(Pressable);
        const rowStyle = row.props.style({ pressed: false });
        expect(rowStyle[1]).toBeNull();

        const trailing = screen
            .UNSAFE_getAllByType(View)
            .find((node) => Array.isArray(node.props.style) && node.props.style[0]?.minWidth === 44);
        expect(trailing?.props.style[1]).toBeNull();
    });

    it('keeps whole-row ListRow action as the only button when trailing content is presentation-only', async () => {
        await render(
            <ListRow
                title="Network"
                description="Testnet connected"
                theme={theme}
                onPress={jest.fn()}
                trailing={<StatusBadge theme={theme} label="Connected" tone="positive" />}
            />,
        );

        expect(screen.getAllByRole('button')).toHaveLength(1);
        expect(screen.getByRole('button', { name: 'Network, Testnet connected' })).toBeTruthy();
        expect(screen.getByText('Connected')).toBeTruthy();
    });

    it('keeps an independent trailing action separate when the ListRow itself is not interactive', async () => {
        await render(
            <ListRow
                title="Account"
                description="Primary"
                theme={theme}
                trailing={
                    <IconButton
                        theme={theme}
                        label="Open account actions"
                        icon={<Typography theme={theme}>•••</Typography>}
                    />
                }
            />,
        );

        expect(screen.getAllByRole('button')).toHaveLength(1);
        expect(screen.getByRole('button', { name: 'Open account actions' })).toBeTruthy();
        expect(screen.queryByRole('button', { name: 'Account, Primary' })).toBeNull();
    });

    it('preserves error alert semantics by default and supports passive delivery', async () => {
        const { rerender } = await render(<InlineMessage message="Unable to connect" theme={theme} tone="error" />);
        expect(screen.getByRole('alert', { name: 'Unable to connect' })).toBeTruthy();

        await rerender(<InlineMessage message="Unable to connect" theme={theme} tone="error" announcementMode="passive" />);
        expect(screen.queryByRole('alert')).toBeNull();
        expect(screen.getByText('Unable to connect')).toBeTruthy();

        await rerender(<InlineMessage message="Important update" theme={theme} announcementMode="alert" />);
        expect(screen.getByRole('alert', { name: 'Important update' })).toBeTruthy();
    });

    it('renders StatusBadge text', async () => {
        await render(<StatusBadge label="Completed" theme={theme} tone="positive" />);
        expect(screen.getByText('Completed')).toBeTruthy();
    });

    it('exposes Skeleton busy state', async () => {
        await render(<Skeleton accessibilityLabel="Loading balance" theme={theme} />);
        expect(screen.getByRole('progressbar', { name: 'Loading balance' })).toBeBusy();
    });

    it('keeps scroll-screen actions tappable while the keyboard is open', async () => {
        await render(
            <Screen theme={theme} scroll>
                <Button label="Continue" theme={theme} />
            </Screen>,
        );
        expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
        expect(screen.container.findByType(ScrollView).props.keyboardShouldPersistTaps).toBe('handled');
    });

    it('renders Typography content', async () => {
        await render(
            <Typography theme={theme} variant="sectionTitle">
                Overview
            </Typography>,
        );
        expect(screen.getByText('Overview')).toBeTruthy();
    });

    it('calls Modal close callback from the accessible close control', async () => {
        const onRequestClose = jest.fn();
        await render(
            <Modal
                theme={theme}
                visible
                title="Confirm"
                onRequestClose={onRequestClose}
                closeAccessibilityLabel="Close"
            >
                <Button label="Confirm" theme={theme} />
            </Modal>,
        );

        expect(screen.getByRole('button', { name: 'Confirm' })).toBeTruthy();
        await fireEvent(screen.getByLabelText('Close'), 'press');
        expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('routes the Android Back request through the native Modal close callback', async () => {
        const onRequestClose = jest.fn();
        await render(
            <Modal
                theme={theme}
                visible
                title="Preview modal"
                closeAccessibilityLabel="Close modal"
                onRequestClose={onRequestClose}
            >
                <Button label="Continue" theme={theme} />
            </Modal>,
        );

        const nativeModal = screen.container.findByType(NativeModal);
        expect(nativeModal.props.accessibilityViewIsModal).toBe(true);
        expect(screen.container.findByType(ScrollView).props.keyboardShouldPersistTaps).toBe('handled');

        await fireEvent(nativeModal, 'requestClose');
        expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('exposes Modal show timing while accepting a built-in close control ref', async () => {
        const onShow = jest.fn();

        await render(
            <Modal
                theme={theme}
                visible
                title="Focus modal"
                onShow={onShow}
                closeButtonRef={() => undefined}
                onRequestClose={jest.fn()}
            >
                <Typography theme={theme}>Body</Typography>
            </Modal>,
        );

        const nativeModal = screen.container.findByType(NativeModal);
        await fireEvent(nativeModal, 'show');

        expect(onShow).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
    });

    it('reports selected SegmentedControl tab and changes selection', async () => {
        const onChange = jest.fn();
        await render(
            <SegmentedControl
                theme={theme}
                accessibilityLabel="View mode"
                segments={[
                    { key: 'all', label: 'All' },
                    { key: 'active', label: 'Active' },
                ]}
                selectedKey="all"
                onChange={onChange}
            />,
        );

        expect(screen.getByRole('tab', { name: 'View mode, All' })).toBeSelected();
        await fireEvent.press(screen.getByRole('tab', { name: 'View mode, Active' }));
        expect(onChange).toHaveBeenCalledWith('active');
    });

    it('exposes Progress as an integer percentage and clamps it to the supported range', async () => {
        const { rerender } = await render(<Progress theme={theme} value={0.64} accessibilityLabel="Upload progress" />);
        expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAccessibilityValue({
            min: 0,
            max: 100,
            now: 64,
        });

        await rerender(<Progress theme={theme} value={2} accessibilityLabel="Upload progress" />);
        expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAccessibilityValue({
            min: 0,
            max: 100,
            now: 100,
        });

        await rerender(<Progress theme={theme} value={Number.NaN} accessibilityLabel="Upload progress" />);
        expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAccessibilityValue({
            min: 0,
            max: 100,
            now: 0,
        });
    });
});
