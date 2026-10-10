import { StyleSheet, View } from 'react-native';
import { useUiTheme } from '../ui-context';
import type { AppTheme } from '../tokens';

export type DividerProps = { theme?: AppTheme; inset?: number };
export function Divider({ theme: themeOverride, inset = 0 }: DividerProps) {
    const theme = useUiTheme(themeOverride);
    return (
        <View
            style={[styles.line, { backgroundColor: theme.colors.separator, marginLeft: inset }]}
            accessibilityRole="none"
        />
    );
}
const styles = StyleSheet.create({ line: { height: StyleSheet.hairlineWidth } });
