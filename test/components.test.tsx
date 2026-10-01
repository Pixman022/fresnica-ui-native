import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from '../src/components/Button';
import { Field } from '../src/components/Field';
import { Header } from '../src/components/Header';
import { IconButton } from '../src/components/IconButton';
import { InlineMessage } from '../src/components/InlineMessage';
import { ListRow } from '../src/components/ListRow';
import { Modal } from '../src/components/Modal';
import { Progress } from '../src/components/Progress';
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

    it('renders Field with an accessible label and error text', () => {
        render(<Field label="Amount" theme={theme} state="error" supportingText="Enter a valid amount" />);
        const field = screen.getByLabelText('Amount');
        expect(field.props.accessibilityState).toEqual({ disabled: false });
        expect(field.props.accessibilityHint).toBe('Enter a valid amount');
        expect(screen.getByText('Enter a valid amount')).toBeTruthy();
    });

    it('exposes IconButton label and disabled state', () => {
        render(
            <IconButton
                label="Open settings"
                theme={theme}
                icon={<Typography theme={theme}>gear</Typography>}
                disabled
            />,
        );
        expect(screen.getByRole('button', { name: 'Open settings' })).toBeDisabled();
    });

    it('exposes Header back action and title', () => {
        render(<Header title="Settings" theme={theme} onBack={jest.fn()} backAccessibilityLabel="Go back" />);
        expect(screen.getByRole('button', { name: 'Go back' })).toBeTruthy();
        expect(screen.getByText('Settings')).toBeTruthy();
    });

    it('exposes ListRow button and disabled state', () => {
        render(<ListRow title="Security" theme={theme} onPress={jest.fn()} disabled />);
        expect(screen.getByRole('button', { name: 'Security' })).toBeDisabled();
    });

    it('includes ListRow description in an interactive accessibility label', () => {
        render(
            <ListRow
                title="Security"
                description="Manage access and backups"
                theme={theme}
                onPress={jest.fn()}
            />,
        );
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

    it('renders Typography content', () => {
        render(
            <Typography theme={theme} variant="sectionTitle">
                Overview
            </Typography>,
        );
        expect(screen.getByText('Overview')).toBeTruthy();
    });

    it('calls Modal close callback from the Android close request', () => {
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

        fireEvent(screen.getByLabelText('Close'), 'press');
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

    it('clamps Progress accessibility value to the supported range', () => {
        render(<Progress theme={theme} value={2} accessibilityLabel="Upload progress" />);
        expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAccessibilityValue({ now: 1 });
    });
});
