import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../tokens';

export type HeaderProps = {
    theme: AppTheme;
    title: string;
    leading?: ReactNode;
    trailing?: ReactNode;
    onBack?: () => void;
};

export function Header({ theme, title, leading, trailing, onBack }: HeaderProps) {
    const start = onBack ? (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={8}
            onPress={onBack}
            style={styles.action}
        >
            {leading}
        </Pressable>
    ) : (
        leading
    );
    return (
        <View style={[styles.container, { borderBottomColor: theme.colors.separator, minHeight: 56 }]}>
            <View style={styles.side}>{start}</View>
            <Text
                numberOfLines={1}
                style={[styles.title, { color: theme.colors.contentPrimary, fontSize: theme.typography.screenTitle }]}
            >
                {title}
            </Text>
            <View style={[styles.side, styles.trailing]}>{trailing}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 16,
        gap: 8,
    },
    side: { width: 44, minHeight: 44, justifyContent: 'center' },
    trailing: { alignItems: 'flex-end' },
    action: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    title: { flex: 1, textAlign: 'center', fontWeight: '700' },
});
