import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AppTheme, StateViewTone } from '../tokens';

export type StateViewProps = {
    theme: AppTheme;
    tone?: StateViewTone;
    title: string;
    description?: string;
    action?: ReactNode;
    icon?: ReactNode;
};

export function StateView({ theme, tone = 'empty', title, description, action, icon }: StateViewProps) {
    const accent =
        tone === 'error' ? theme.colors.negative : tone === 'success' ? theme.colors.positive : theme.colors.primary;
    return (
        <View style={styles.container} accessibilityRole="summary">
            {icon}
            <Text
                style={[styles.title, { color: theme.colors.contentPrimary, fontSize: theme.typography.sectionTitle }]}
            >
                {title}
            </Text>
            {description ? (
                <Text
                    style={[
                        styles.description,
                        { color: theme.colors.contentSecondary, fontSize: theme.typography.body },
                    ]}
                >
                    {description}
                </Text>
            ) : null}
            {action ? <View style={[styles.action, { borderColor: accent }]}>{action}</View> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
    title: { textAlign: 'center', fontWeight: '700' },
    description: { textAlign: 'center', lineHeight: 22 },
    action: { marginTop: 8, maxWidth: '100%' },
});
