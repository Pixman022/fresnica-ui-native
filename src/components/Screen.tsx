import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useUiTheme } from '../ui-context';
import type { AppTheme } from '../tokens';

export type ScreenProps = {
    theme?: AppTheme;
    children: ReactNode;
    scroll?: boolean;
    padded?: boolean;
};

export function Screen({ theme: themeOverride, children, scroll = false, padded = true }: ScreenProps) {
    const theme = useUiTheme(themeOverride);
    const content = <View style={[styles.content, padded && { padding: theme.spacing.lg }]}>{children}</View>;
    return scroll ? (
        <ScrollView
            style={{ backgroundColor: theme.colors.background }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
        >
            {content}
        </ScrollView>
    ) : (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>{content}</View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, gap: 16 },
    scrollContent: { flexGrow: 1 },
});
