import { forwardRef, useState } from 'react';
import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import type { AppTheme, FieldState } from '../tokens';

export type FieldProps = Omit<TextInputProps, 'accessible' | 'accessibilityRole'> & {
    label: string;
    theme: AppTheme;
    supportingText?: string;
    state?: FieldState;
    leading?: ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    containerTestID?: string;
};

export const Field = forwardRef<TextInput, FieldProps>(function Field(
    {
        label,
        theme,
        supportingText,
        state = 'default',
        leading,
        containerStyle,
        containerTestID,
        editable = true,
        accessibilityLabel,
        accessibilityHint,
        accessibilityState,
        onFocus,
        onBlur,
        style,
        ...inputProps
    },
    ref,
) {
    const [focused, setFocused] = useState(false);
    const disabled = state === 'disabled' || editable === false;
    const effectiveState: FieldState = disabled
        ? 'disabled'
        : state === 'error'
          ? 'error'
          : state === 'focused' || focused
            ? 'focused'
            : 'default';
    const borderColor =
        effectiveState === 'error'
            ? theme.colors.negative
            : effectiveState === 'focused'
              ? theme.colors.primary
              : theme.colors.border;
    const resolvedHint = accessibilityHint ?? (effectiveState === 'error' ? supportingText : undefined);

    return (
        <View testID={containerTestID} style={[styles.wrapper, containerStyle]}>
            <Text
                style={[styles.label, { color: theme.colors.contentSecondary, fontSize: theme.typography.supporting }]}
            >
                {label}
            </Text>
            <View
                style={[
                    styles.control,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor,
                        borderRadius: theme.radii.control,
                        borderWidth: theme.sizes.border,
                        opacity: disabled ? 0.5 : 1,
                    },
                ]}
            >
                {leading}
                <TextInput
                    ref={ref}
                    {...inputProps}
                    accessible
                    accessibilityRole={undefined}
                    accessibilityLabel={accessibilityLabel ?? label}
                    accessibilityHint={resolvedHint}
                    accessibilityState={{ ...accessibilityState, disabled }}
                    editable={!disabled}
                    onFocus={(event) => {
                        setFocused(true);
                        onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setFocused(false);
                        onBlur?.(event);
                    }}
                    style={[styles.input, { color: theme.colors.contentPrimary, fontSize: theme.typography.body }, style]}
                />
            </View>
            {supportingText ? (
                <Text
                    style={[
                        styles.supporting,
                        {
                            color: effectiveState === 'error' ? theme.colors.negative : theme.colors.contentMuted,
                            fontSize: theme.typography.supporting,
                        },
                    ]}
                >
                    {supportingText}
                </Text>
            ) : null}
        </View>
    );
});

const styles = StyleSheet.create({
    wrapper: { gap: 6 },
    label: { fontWeight: '600' },
    control: { minHeight: 48, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, minHeight: 44, paddingVertical: 0 },
    supporting: { lineHeight: 18 },
});
