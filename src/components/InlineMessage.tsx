import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUiTheme } from '../ui-context';
import type { AppTheme } from '../tokens';

export type InlineMessageTone = 'info' | 'success' | 'warning' | 'error';
export type InlineMessageAnnouncementMode = 'alert' | 'passive';
export type InlineMessageProps = {
    theme?: AppTheme;
    message: string;
    tone?: InlineMessageTone;
    icon?: ReactNode;
    announcementMode?: InlineMessageAnnouncementMode;
};

export function InlineMessage({
    theme: themeOverride,
    message,
    tone = 'info',
    icon,
    announcementMode,
}: InlineMessageProps) {
    const theme = useUiTheme(themeOverride);
    const color =
        tone === 'success'
            ? theme.colors.positive
            : tone === 'error'
              ? theme.colors.negative
              : tone === 'warning'
                ? theme.colors.warning
                : theme.colors.primary;
    const alert = announcementMode === 'alert' || (announcementMode === undefined && tone === 'error');

    return (
        <View
            accessible
            accessibilityRole={alert ? 'alert' : 'text'}
            accessibilityLabel={message}
            style={[
                styles.container,
                {
                    borderColor: color,
                    padding: theme.spacing.md,
                    borderWidth: theme.sizes.border,
                    borderRadius: theme.radii.control,
                    gap: theme.spacing.sm,
                },
            ]}
        >
            {icon}
            <Text style={{ color: theme.colors.contentPrimary, fontSize: theme.typography.supporting, flex: 1 }}>
                {message}
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
