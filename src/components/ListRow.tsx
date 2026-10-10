import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useUiTheme } from '../ui-context';
import type { AppTheme } from '../tokens';

export type ListRowProps = {
    theme?: AppTheme;
    title: string;
    description?: string;
    leading?: ReactNode;
    trailing?: ReactNode;
    onPress?: () => void;
    disabled?: boolean;
};

export function ListRow({ theme: themeOverride, title, description, leading, trailing, onPress, disabled = false }: ListRowProps) {
    const theme = useUiTheme(themeOverride);
    const interactive = Boolean(onPress);
    const accessibilityLabel = description ? `${title}, ${description}` : title;

    return (
        <Pressable
            accessible={interactive}
            accessibilityRole={interactive ? 'button' : undefined}
            accessibilityLabel={interactive ? accessibilityLabel : undefined}
            accessibilityState={interactive ? { disabled } : undefined}
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.row,
                {
                    borderBottomColor: theme.colors.separator,
                    opacity: disabled ? 0.5 : 1,
                    backgroundColor: pressed ? theme.colors.surfaceRaised : theme.colors.surface,
                },
            ]}
        >
            {leading ? <View style={styles.leading}>{leading}</View> : null}
            <View style={styles.copy}>
                <Text style={[styles.title, { color: theme.colors.contentPrimary, fontSize: theme.typography.body }]}>
                    {title}
                </Text>
                {description ? (
                    <Text style={{ color: theme.colors.contentSecondary, fontSize: theme.typography.supporting }}>
                        {description}
                    </Text>
                ) : null}
            </View>
            {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        minHeight: 64,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        gap: 12,
    },
    leading: { width: 40, alignItems: 'center' },
    copy: { flex: 1, gap: 3, minWidth: 0 },
    title: { fontWeight: '600', flexShrink: 1 },
    trailing: { minWidth: 44, alignItems: 'flex-end', flexShrink: 0 },
});
