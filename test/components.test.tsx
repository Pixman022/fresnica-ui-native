import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button } from '../src/components/Button';
import { Field } from '../src/components/Field';
import { Modal } from '../src/components/Modal';
import { Progress } from '../src/components/Progress';
import { SegmentedControl } from '../src/components/SegmentedControl';
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
        expect(screen.getByRole('button', { name: 'Continue' })).toHaveAccessibilityState({
            busy: true,
            disabled: true,
        });
    });

    it('renders Field with an accessible label and error text', () => {
        render(<Field label="Amount" theme={theme} state="error" supportingText="Enter a valid amount" />);
        expect(screen.getByLabelText('Amount')).toBeTruthy();
        expect(screen.getByText('Enter a valid amount')).toBeTruthy();
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

        expect(screen.getByRole('tab', { name: 'All' })).toHaveAccessibilityState({ selected: true });
        fireEvent.press(screen.getByRole('tab', { name: 'Active' }));
        expect(onChange).toHaveBeenCalledWith('active');
    });

    it('clamps Progress accessibility value to the supported range', () => {
        render(<Progress theme={theme} value={2} accessibilityLabel="Upload progress" />);
        expect(screen.getByRole('progressbar', { name: 'Upload progress' })).toHaveAccessibilityValue({ now: 1 });
    });
});
