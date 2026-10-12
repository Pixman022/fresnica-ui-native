import { forwardRef } from 'react';
import type { ComponentRef, ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useUiLocale, useUiTheme } from '../ui-context';
import type { AppTheme, ButtonVariant, ControlSize } from '../tokens';

type PressableRef = ComponentRef<typeof Pressable>;

export type ButtonProps = {
    label: string;
    theme?: AppTheme;
    onPress?: () => void;
    variant?: ButtonVariant;
    size?: ControlSize;
    disabled?: boolean;
    loading?: boolean;
    loadingLabel?: string;
    icon?: ReactNode;
    accessibilityHint?: string;
    testID?: string;
    nativeID?: string;
};

export const Button: ForwardRefExoticComponent<ButtonProps & RefAttributes<PressableRef>> = forwardRef<
    PressableRef,
    ButtonProps
>(function Button(
    {
        label,
        theme: themeOverride,
        onPress,
        variant = 'primary',
        size = 'md',
        disabled = false,
        loading = false,
        loadingLabel,
        icon,
        accessibilityHint,
        testID,
        nativeID,
    },
    ref,
) {
    const theme = useUiTheme(themeOverride);
    const locale = useUiLocale();
    const isDisabled = disabled || loading;
    const displayLabel = loading ? (loadingLabel ?? locale.loading) : label;
    const heights: Record<ControlSize, number> = {
        sm: theme.sizes.controlCompact,
        md: theme.sizes.controlBase,
        lg: theme.sizes.controlLg,
    };
    const filled = variant === 'primary' || variant === 'danger';
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
            style={({ pressed }) => {
                let backgroundColor = 'transparent';
                let borderColor = 'transparent';
                let opacity = isDisabled ? 0.5 : 1;

                if (variant === 'primary') {
                    backgroundColor = pressed ? theme.colors.primaryPressed : theme.colors.primary;
                    borderColor = backgroundColor;
                } else if (variant === 'danger') {
                    backgroundColor = theme.colors.negative;
                    borderColor = theme.colors.negative;
                    if (pressed && !isDisabled) {
                        opacity = 0.82;
                    }
                } else if (variant === 'secondary') {
                    borderColor = theme.colors.primary;
                    if (pressed) {
                        backgroundColor = theme.colors.surfaceRaised;
                    }
                } else if (pressed) {
                    backgroundColor = theme.colors.surfaceRaised;
                }

                return [
                    styles.base,
                    {
                        backgroundColor,
                        borderColor,
                        borderWidth: theme.sizes.border,
                        borderRadius: theme.radii.base,
                        minHeight: heights[size],
                        paddingHorizontal: theme.spacing.lg,
                        paddingVertical: theme.spacing.sm,
                        gap: theme.spacing.sm,
                        opacity,
                    },
                ];
            }}
        >
            {icon}
            <Text style={[styles.label, { color: foreground, fontSize: theme.typography.action }]}>{displayLabel}</Text>
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
