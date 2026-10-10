import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
type PressableRef = ComponentRef<typeof Pressable>;

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
    testID?: string;
    nativeID?: string;
};

export const Button = forwardRef<PressableRef, ButtonProps>(function Button(
    {
        label,
        theme,
        onPress,
        variant = 'primary',
        size = 'md',
        disabled = false,
        loading = false,
        icon,
        accessibilityHint,
        testID,
        nativeID,
    },
    ref,
) {
    const isDisabled = disabled || loading;
    const heights: Record<ControlSize, number> = {
        sm: theme.sizes.controlCompact,
        md: theme.sizes.controlBase,
        lg: theme.sizes.controlLg,
    };
    const filled = variant === 'primary' || variant === 'danger';
    const background = variant === 'danger' ? theme.colors.negative : theme.colors.primary;
    const foreground = filled ? theme.colors.onPrimary : theme.colors.primary;
    return (
        <Pressable
            ref={ref}
            accessible
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            accessibilityLabel={label}
            accessibilityHint={accessibilityHint}
            disabled={isDisabled}
            hitSlop={size === 'sm' ? { top: 4, bottom: 4, left: 0, right: 0 } : undefined}
            nativeID={nativeID}
            onPress={onPress}
            testID={testID}
            style={({ pressed }) => [
                styles.base,
                {
                    backgroundColor: filled ? background : 'transparent',
                    borderColor: background,
                    borderWidth: theme.sizes.border,
                    borderRadius: theme.radii.base,
                    minHeight: heights[size],
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.sm,
                    gap: theme.spacing.sm,
                    opacity: isDisabled ? 0.5 : pressed ? 0.82 : 1,
                },
            ]}
        >
            {icon}
            <Text style={[styles.label, { color: foreground, fontSize: theme.typography.action }]}>
                {loading ? '…' : label}
            </Text>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    base: {
        minWidth: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: { fontWeight: '600', textAlign: 'center', flexShrink: 1 },
});
