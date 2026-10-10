import { StyleSheet, View } from 'react-native';
import { useUiTheme } from '../ui-context';
import type { AppTheme } from '../tokens';

export type SkeletonProps = {
    theme?: AppTheme;
    width?: number | `${number}%`;
    height?: number;
    radius?: number;
    accessibilityLabel: string;
};
export function Skeleton({ theme: themeOverride, width = '100%', height = 16, radius = 8, accessibilityLabel }: SkeletonProps) {
    const theme = useUiTheme(themeOverride);
    return (
        <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ busy: true }}
            style={[styles.base, { width, height, borderRadius: radius, backgroundColor: theme.colors.surfaceRaised }]}
        />
    );
}
const styles = StyleSheet.create({ base: { overflow: 'hidden' } });
