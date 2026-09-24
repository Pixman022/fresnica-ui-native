import { StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../tokens';

export type StatusBadgeTone = 'positive' | 'negative' | 'warning' | 'neutral';
export type StatusBadgeProps = { theme: AppTheme; label: string; tone?: StatusBadgeTone };

export function StatusBadge({ theme, label, tone = 'neutral' }: StatusBadgeProps) {
    const color =
        tone === 'positive'
            ? theme.colors.positive
            : tone === 'negative'
              ? theme.colors.negative
              : tone === 'warning'
                ? theme.colors.warning
                : theme.colors.contentSecondary;
    return (
        <View accessibilityRole="text" style={[styles.badge, { borderColor: color }]}>
            <Text style={{ color, fontSize: theme.typography.supporting, fontWeight: '600' }}>{label}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    badge: {
        minHeight: 28,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
