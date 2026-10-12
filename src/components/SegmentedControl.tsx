import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useUiTheme } from '../ui-context';
import type { AppTheme } from '../tokens';

export type Segment = { key: string; label: string };
export type SegmentedControlProps = {
    theme?: AppTheme;
    segments: Segment[];
    selectedKey: string;
    onChange: (key: string) => void;
    accessibilityLabel: string;
};

export function SegmentedControl({
    theme: themeOverride,
    segments,
    selectedKey,
    onChange,
    accessibilityLabel,
}: SegmentedControlProps) {
    const theme = useUiTheme(themeOverride);
    return (
        <View
            accessible={false}
            accessibilityRole="tablist"
            accessibilityLabel={accessibilityLabel}
            style={[styles.container, { backgroundColor: theme.colors.surfaceRaised }]}
        >
            {segments.map((segment) => {
                const selected = segment.key === selectedKey;
                return (
                    <Pressable
                        key={segment.key}
                        accessible
                        accessibilityRole="tab"
                        accessibilityLabel={`${accessibilityLabel}, ${segment.label}`}
                        accessibilityState={{ selected }}
                        onPress={() => onChange(segment.key)}
                        style={[styles.segment, selected && { backgroundColor: theme.colors.surface }]}
                    >
                        <Text
                            style={[
                                styles.label,
                                {
                                    color: selected ? theme.colors.contentPrimary : theme.colors.contentSecondary,
                                    fontSize: theme.typography.supporting,
                                    fontWeight: selected ? '600' : '400',
                                },
                            ]}
                        >
                            {segment.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
const styles = StyleSheet.create({
    container: { minHeight: 50, padding: 3, borderRadius: 12, flexDirection: 'row', gap: 3 },
    segment: {
        minHeight: 44,
        minWidth: 44,
        flex: 1,
        paddingHorizontal: 12,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: { textAlign: 'center', flexShrink: 1 },
});
