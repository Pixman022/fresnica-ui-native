import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { AppTheme, ButtonVariant, ControlSize } from '../tokens';

export type ButtonProps = {
    label: string;
    theme: AppTheme;
    onPress?: () => void;
    variant?: ButtonVariant;
    size?: ControlSize;
    disabled?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    accessibilityHint?: string;
};

const heights: Record<ControlSize, number> = { sm: 36, md: 48, lg: 56 };

export function Button({
    label,
    theme,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    accessibilityHint,
}: ButtonProps) {
    const isDisabled = disabled || loading;
    const filled = variant === 'primary' || variant === 'danger';
    const background = variant === 'danger' ? theme.colors.negative : theme.colors.primary;
    const foreground = filled ? theme.colors.onPrimary : theme.colors.primary;
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            accessibilityLabel={label}
            accessibilityHint={accessibilityHint}
            disabled={isDisabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.base,
                {
                    backgroundColor: filled ? background : 'transparent',
                    borderColor: background,
                    height: heights[size],
                    opacity: isDisabled ? 0.5 : pressed ? 0.82 : 1,
                },
                !filled && styles.outlined,
            ]}
        >
            {icon}
            <Text style={[styles.label, { color: foreground, fontSize: theme.typography.action }]}>
                {loading ? '…' : label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        minWidth: 44,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    outlined: { borderWidth: 1 },
    label: { fontWeight: '600' },
});
