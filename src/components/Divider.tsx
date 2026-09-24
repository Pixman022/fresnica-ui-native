import { StyleSheet, View } from 'react-native';
import type { AppTheme } from '../tokens';

export type DividerProps = { theme: AppTheme; inset?: number };
export function Divider({ theme, inset = 0 }: DividerProps) {
    return (
        <View
            style={[styles.line, { backgroundColor: theme.colors.separator, marginLeft: inset }]}
            accessibilityRole="none"
        />
    );
}
const styles = StyleSheet.create({ line: { height: StyleSheet.hairlineWidth } });
