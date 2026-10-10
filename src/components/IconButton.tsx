import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { View } from 'react-native';
import type { AppTheme } from '../tokens';

export type IconButtonProps = {
    theme: AppTheme;
    label: string;
    icon: ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    testID?: string;
    nativeID?: string;
};

export const IconButton = forwardRef<View, IconButtonProps>(function IconButton(
    { theme, label, icon, onPress, disabled = false, testID, nativeID },
    ref,
) {
    return (
        <Pressable
            ref={ref}
            accessible
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            disabled={disabled}
            hitSlop={4}
            nativeID={nativeID}
            onPress={onPress}
            testID={testID}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? theme.colors.surfaceRaised : 'transparent', opacity: disabled ? 0.5 : 1 },
            ]}
        >
            {icon}
        </Pressable>
    );
});

const styles = StyleSheet.create({
    button: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
});
