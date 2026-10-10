import { fireEvent, render, screen } from '@testing-library/react-native';
import { Modal as NativeModal, ScrollView } from 'react-native';
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
import { theme } from './helpers';

describe('native components', () => {
    it('renders Button and invokes onPress', () => {
        const onPress = jest.fn();
        render(<Button label="Continue" theme={theme} onPress={onPress} />);

        fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('exposes Button loading and disabled state', () => {
        render(<Button label="Continue" theme={theme} loading />);
        const button = screen.getByRole('button', { name: 'Continue' });
        expect(button).toBeBusy();
        expect(button).toBeDisabled();
    });

    it('expands the compact Button touch target without changing its visual token height', () => {
        render(<Button label="Compact" theme={theme} size="sm" />);
        expect(screen.getByRole('button', { name: 'Compact' }).props.hitSlop).toEqual({
            top: 4,
            bottom: 4,
            left: 0,
            right: 0,
        });
    });

    it('renders Field with an accessible label and error text', () => {
        render(<Field label="Amount" theme={theme} state="error" supportingText="Enter a valid amount" />);
        const field = screen.getByLabelText('Amount');
        expect(field.props.accessibilityState).toEqual({ disabled: false });
        expect(field.props.accessibilityHint).toBe('Enter a valid amount');
        expect(screen.getByText('Enter a valid amount')).toBeTruthy();
    });

    it('exposes disabled Field semantics without allowing input edits', () => {
        render(<Field label="Disabled amount" theme={theme} state="disabled" value="123" editable />);

        const field = screen.getByLabelText('Disabled amount');
        expect(field).toBeDisabled();
        expect(field.props.accessibilityState).toEqual({ disabled: true });
        expect(field.props.editable).toBe(false);
    });

    it('forwards Field native input props and caller events to the TextInput node', () => {
        const onFocus = jest.fn();
        const onBlur = jest.fn();
        const onSubmitEditing = jest.fn();

        render(
            <Field
                label="Amount"
                theme={theme}
                testID="amount-input"
                containerTestID="amount-container"
                inputMode="decimal"
                keyboardType="decimal-pad"
                returnKeyType="done"
                maxLength={18}
                multiline
                autoComplete="off"
                spellCheck={false}
                onFocus={onFocus}
                onBlur={onBlur}
                onSubmitEditing={onSubmitEditing}
            />,
        );

        const field = screen.getByTestId('amount-input');
        expect(screen.getByTestId('amount-container')).toBeTruthy();
        expect(field.props.inputMode).toBe('decimal');
        expect(field.props.keyboardType).toBe('decimal-pad');
        expect(field.props.returnKeyType).toBe('done');
        expect(field.props.maxLength).toBe(18);
        expect(field.props.multiline).toBe(true);
        expect(field.props.autoComplete).toBe('off');
        expect(field.props.spellCheck).toBe(false);

        fireEvent(field, 'focus', { nativeEvent: {} });
        fireEvent(field, 'blur', { nativeEvent: {} });
        fireEvent(field, 'submitEditing', { nativeEvent: { text: '12' } });

        expect(onFocus).toHaveBeenCalledTimes(1);
        expect(onBlur).toHaveBeenCalledTimes(1);
        expect(onSubmitEditing).toHaveBeenCalledTimes(1);
    });

    it('allows explicit Field accessibility copy while preserving package disabled state', () => {
        render(
            <Field
                label="Amount"
                theme={theme}
                editable={false}
                accessibilityLabel="Transfer amount"
                accessibilityHint="Custom amount hint"
                accessibilityState={{ busy: true, disabled: false }}
            />,
        );

        const field = screen.getByLabelText('Transfer amount');
        expect(field.props.accessibilityHint).toBe('Custom amount hint');
        expect(field.props.accessibilityState).toEqual({ busy: true, disabled: true });
        expect(field.props.editable).toBe(false);
    });

    it('forwards Button test identifiers to its Pressable node', () => {
        render(<Button label="Continue" theme={theme} testID="continue-button" nativeID="continue-native" />);
        const button = screen.getByTestId('continue-button');
        expect(button.props.nativeID).toBe('continue-native');
    });

    it('exposes IconButton label and disabled state', () => {
        render(
            <IconButton
                label="Open settings"
                theme={theme}
                icon={<Typography theme={theme}>gear</Typography>}
                disabled
                testID="settings-button"
                nativeID="settings-native"
            />,
        );
        const button = screen.getByRole('button', { name: 'Open settings' });
        expect(button).toBeDisabled();
        expect(screen.getByTestId('settings-button').props.nativeID).toBe('settings-native');
    });

    it('exposes Header back action and title', () => {
        render(
            <Header
                title="Settings"
                theme={theme}
                leading={<Typography theme={theme}>‹</Typography>}
                onBack={jest.fn()}
                backAccessibilityLabel="Go back"
            />,
        );
        expect(screen.getByRole('button', { name: 'Go back' })).toBeTruthy();
        expect(screen.getByText('Settings')).toBeTruthy();
    });

    it('allows Header titles to use two lines before truncating', () => {
        render(<Header title="A deliberately long account settings title" theme={theme} />);
        expect(screen.getByText('A deliberately long account settings title').props.numberOfLines).toBe(2);
    });

    it('exposes ListRow button and disabled state', () => {
        render(<ListRow title="Security" theme={theme} onPress={jest.fn()} disabled />);
        expect(screen.getByRole('button', { name: 'Security' })).toBeDisabled();
    });

    it('includes ListRow description in an interactive accessibility label', () => {
        render(<ListRow title="Security" description="Manage access and backups" theme={theme} onPress={jest.fn()} />);
        expect(screen.getByRole('button', { name: 'Security, Manage access and backups' })).toBeTruthy();
    });

    it('keeps noninteractive ListRow content outside a grouped button', () => {
        render(<ListRow title="Network" description="Testnet connected" theme={theme} />);
        expect(screen.queryByRole('button')).toBeNull();
        expect(screen.getByText('Network')).toBeTruthy();
        expect(screen.getByText('Testnet connected')).toBeTruthy();
    });

    it('uses alert semantics only for error InlineMessage', () => {
        const { rerender } = render(<InlineMessage message="Unable to connect" theme={theme} tone="error" />);
        expect(screen.getByRole('alert', { name: 'Unable to connect' })).toBeTruthy();

        rerender(<InlineMessage message="Connected" theme={theme} tone="success" />);
        expect(screen.queryByRole('alert')).toBeNull();
        expect(screen.getByText('Connected')).toBeTruthy();
    });

    it('renders StatusBadge text', () => {
        render(<StatusBadge label="Completed" theme={theme} tone="positive" />);
        expect(screen.getByText('Completed')).toBeTruthy();
    });

    it('exposes Skeleton busy state', () => {
        render(<Skeleton accessibilityLabel="Loading balance" theme={theme} />);
        expect(screen.getByRole('progressbar', { name: 'Loading balance' })).toBeBusy();
    });

    it('keeps scroll-screen actions tappable while the keyboard is open', () => {
        render(
            <Screen theme={theme} scroll>
                <Button label="Continue" theme={theme} />
            </Screen>,
        );
        expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
        expect(screen.UNSAFE_getByType(ScrollView).props.keyboardShouldPersistTaps).toBe('handled');
    });

    it('renders Typography content', () => {
        render(
            <Typography theme={theme} variant="sectionTitle">
                Overview
            </Typography>,
        );
        expect(screen.getByText('Overview')).toBeTruthy();
    });

    it('calls Modal close callback from the accessible close control', () => {
        const onRequestClose = jest.fn();
        render(
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
        fireEvent(screen.getByLabelText('Close'), 'press');
        expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('routes the Android Back request through the native Modal close callback', () => {
        const onRequestClose = jest.fn();
        render(
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

        const nativeModal = screen.UNSAFE_getByType(NativeModal);
        expect(nativeModal.props.accessibilityViewIsModal).toBe(true);
        expect(screen.UNSAFE_getByType(ScrollView).props.keyboardShouldPersistTaps).toBe('handled');

        fireEvent(nativeModal, 'requestClose');
        expect(onRequestClose).toHaveBeenCalledTimes(1);
    });

    it('reports selected SegmentedControl tab and changes selection', () => {
        const onChange = jest.fn();
        render(
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
        fireEvent.press(screen.getByRole('tab', { name: 'View mode, Active' }));
        expect(onChange).toHaveBeenCalledWith('active');
    });

    it('exposes Progress as an integer percentage and clamps it to the supported range', () => {
        const { rerender } = render(<Progress theme={theme} value={0.64} accessibilityLabel="Upload progress" />);
        expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAccessibilityValue({
            min: 0,
            max: 100,
            now: 64,
        });

        rerender(<Progress theme={theme} value={2} accessibilityLabel="Upload progress" />);
        expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAccessibilityValue({
            min: 0,
            max: 100,
            now: 100,
        });

        rerender(<Progress theme={theme} value={Number.NaN} accessibilityLabel="Upload progress" />);
        expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAccessibilityValue({
            min: 0,
            max: 100,
            now: 0,
        });
    });
});
