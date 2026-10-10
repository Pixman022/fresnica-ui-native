import type { ReactElement, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useUiTheme } from '../ui-context';
import type { AppTheme } from '../tokens';

type HeaderBaseProps = {
    theme?: AppTheme;
    title: string;
    trailing?: ReactNode;
};

type HeaderWithBackAction = HeaderBaseProps & {
    leading: ReactElement;
    onBack: () => void;
    backAccessibilityLabel: string;
};

type HeaderWithoutBackAction = HeaderBaseProps & {
    leading?: ReactNode;
    onBack?: undefined;
    backAccessibilityLabel?: never;
};

export type HeaderProps = HeaderWithBackAction | HeaderWithoutBackAction;

export function Header({ theme: themeOverride, title, leading, trailing, onBack, backAccessibilityLabel }: HeaderProps) {
    const theme = useUiTheme(themeOverride);
    const start = onBack ? (
        <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel={backAccessibilityLabel}
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
                numberOfLines={2}
                ellipsizeMode="tail"
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
    title: { flex: 1, flexShrink: 1, textAlign: 'center', fontWeight: '700' },
});
