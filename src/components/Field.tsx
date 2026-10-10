import { forwardRef, useState } from 'react';
import type { ComponentRef, ForwardRefExoticComponent, ReactNode, RefAttributes } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import type { AppTheme, FieldState } from '../tokens';

type TextInputRef = ComponentRef<typeof TextInput>;

export type FieldProps = Omit<TextInputProps, 'accessible' | 'accessibilityRole' | 'style'> & {
    label: string;
    theme: AppTheme;
    supportingText?: string;
    state?: FieldState;
    leading?: ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    style?: TextInputProps['style'];
    containerTestID?: string;
};

export const Field: ForwardRefExoticComponent<FieldProps & RefAttributes<TextInputRef>> = forwardRef<TextInputRef, FieldProps>(function Field(
    {
        label,
        theme,
        supportingText,
        state = 'default',
        leading,
        containerStyle,
        containerTestID,
        editable,
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
    const [isFocused, setIsFocused] = useState(false);
    const disabled = state === 'disabled' || editable === false;
    const effectiveEditable = !disabled;
    const visualState: FieldState = disabled
        ? 'disabled'
        : state === 'error'
          ? 'error'
          : state === 'focused' || isFocused
            ? 'focused'
            : 'default';
    const borderColor =
        visualState === 'error'
            ? theme.colors.negative
            : visualState === 'focused'
              ? theme.colors.primary
              : theme.colors.border;

    const handleFocus: NonNullable<TextInputProps['onFocus']> = (event) => {
        setIsFocused(true);
        onFocus?.(event);
    };

    const handleBlur: NonNullable<TextInputProps['onBlur']> = (event) => {
        setIsFocused(false);
        onBlur?.(event);
    };

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
                    {...inputProps}
                    ref={ref}
                    accessible
                    accessibilityLabel={accessibilityLabel ?? label}
                    accessibilityHint={accessibilityHint ?? (visualState === 'error' ? supportingText : undefined)}
                    accessibilityState={{ ...accessibilityState, disabled }}
                    editable={effectiveEditable}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholderTextColor={theme.colors.contentMuted}
                    style={[
                        styles.input,
                        { color: theme.colors.contentPrimary, fontSize: theme.typography.body },
                        style,
                    ]}
                />
            </View>
            {supportingText ? (
                <Text
                    style={[
                        styles.supporting,
                        {
                            color: visualState === 'error' ? theme.colors.negative : theme.colors.contentMuted,
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
