import { StyleSheet, View } from 'react-native';
import type { AppTheme } from '../tokens';

export type SkeletonProps = {
    theme: AppTheme;
    width?: number | `${number}%`;
    height?: number;
    radius?: number;
    accessibilityLabel: string;
};
export function Skeleton({ theme, width = '100%', height = 16, radius = 8, accessibilityLabel }: SkeletonProps) {
    return (
        <View
            accessibilityRole="progressbar"
            accessibilityLabel={accessibilityLabel}
            style={[styles.base, { width, height, borderRadius: radius, backgroundColor: theme.colors.surfaceRaised }]}
        />
    );
}
const styles = StyleSheet.create({ base: { overflow: 'hidden' } });
