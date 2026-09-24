import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { AppTheme } from '../tokens';

export type TypographyVariant = 'body' | 'supporting' | 'action' | 'sectionTitle' | 'screenTitle' | 'display';
export type TypographyProps = { theme: AppTheme; variant?: TypographyVariant; children: ReactNode; muted?: boolean };

export function Typography({ theme, variant = 'body', children, muted = false }: TypographyProps) {
    return (
        <Text
            style={[
                styles.base,
                {
                    color: muted ? theme.colors.contentMuted : theme.colors.contentPrimary,
                    fontSize: theme.typography[variant],
                },
                (variant === 'action' || variant === 'sectionTitle' || variant === 'screenTitle') && styles.emphasis,
                variant === 'display' && styles.display,
            ]}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: { flexShrink: 1 },
    emphasis: { fontWeight: '600' },
    display: { fontWeight: '700' },
});
