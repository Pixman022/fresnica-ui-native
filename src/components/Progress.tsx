import { StyleSheet, View } from 'react-native';
import type { AppTheme } from '../tokens';

export type ProgressProps = { theme: AppTheme; value: number; accessibilityLabel: string };
export function Progress({ theme, value, accessibilityLabel }: ProgressProps) {
    const clamped = Math.max(0, Math.min(1, value));
    return (
        <View
            accessibilityRole="progressbar"
            accessibilityLabel={accessibilityLabel}
            accessibilityValue={{ min: 0, max: 1, now: clamped }}
            style={[styles.track, { backgroundColor: theme.colors.border }]}
        >
            <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: theme.colors.primary }]} />
        </View>
    );
}
const styles = StyleSheet.create({
    track: { height: 8, borderRadius: 4, overflow: 'hidden' },
    fill: { height: '100%', borderRadius: 4 },
});
