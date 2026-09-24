import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { AppTheme, FieldState } from '../tokens';

export type FieldProps = {
    label: string;
    theme: AppTheme;
    value?: string;
    onChangeText?: (value: string) => void;
    placeholder?: string;
    supportingText?: string;
    state?: FieldState;
    leading?: ReactNode;
    secureTextEntry?: boolean;
};

export function Field({
    label,
    theme,
    value,
    onChangeText,
    placeholder,
    supportingText,
    state = 'default',
    leading,
    secureTextEntry,
}: FieldProps) {
    const disabled = state === 'disabled';
    const borderColor =
        state === 'error' ? theme.colors.negative : state === 'focused' ? theme.colors.primary : theme.colors.border;
    return (
        <View style={styles.wrapper}>
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
                        opacity: disabled ? 0.5 : 1,
                    },
                ]}
            >
                {leading}
                <TextInput
                    accessibilityLabel={label}
                    editable={!disabled}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.contentMuted}
                    secureTextEntry={secureTextEntry}
                    style={[styles.input, { color: theme.colors.contentPrimary, fontSize: theme.typography.body }]}
                />
            </View>
            {supportingText ? (
                <Text
                    style={[
                        styles.supporting,
                        {
                            color: state === 'error' ? theme.colors.negative : theme.colors.contentMuted,
                            fontSize: theme.typography.supporting,
                        },
                    ]}
                >
                    {supportingText}
                </Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { gap: 6 },
    label: { fontWeight: '600' },
    control: { minHeight: 48, borderWidth: 1, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
    input: { flex: 1, minHeight: 44, paddingVertical: 0 },
    supporting: { lineHeight: 18 },
});
