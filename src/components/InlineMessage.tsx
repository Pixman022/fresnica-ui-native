import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../tokens';

export type InlineMessageTone = 'info' | 'success' | 'warning' | 'error';
export type InlineMessageProps = { theme: AppTheme; message: string; tone?: InlineMessageTone; icon?: ReactNode };

export function InlineMessage({ theme, message, tone = 'info', icon }: InlineMessageProps) {
    const color =
        tone === 'success'
            ? theme.colors.positive
            : tone === 'error'
              ? theme.colors.negative
              : tone === 'warning'
                ? theme.colors.warning
                : theme.colors.primary;
    return (
        <View accessibilityRole="alert" style={[styles.container, { borderColor: color }]}>
            {icon}
            <Text style={{ color: theme.colors.contentPrimary, fontSize: theme.typography.supporting, flex: 1 }}>
                {message}
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        minHeight: 44,
        padding: 12,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});
