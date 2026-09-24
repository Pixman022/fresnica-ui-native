import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../tokens';

export type Segment = { key: string; label: string };
export type SegmentedControlProps = {
    theme: AppTheme;
    segments: Segment[];
    selectedKey: string;
    onChange: (key: string) => void;
    accessibilityLabel: string;
};

export function SegmentedControl({
    theme,
    segments,
    selectedKey,
    onChange,
    accessibilityLabel,
}: SegmentedControlProps) {
    return (
        <View
            accessibilityRole="tablist"
            accessibilityLabel={accessibilityLabel}
            style={[styles.container, { backgroundColor: theme.colors.surfaceRaised }]}
        >
            {segments.map((segment) => {
                const selected = segment.key === selectedKey;
                return (
                    <Pressable
                        key={segment.key}
                        accessibilityRole="tab"
                        accessibilityLabel={segment.label}
                        accessibilityState={{ selected }}
                        onPress={() => onChange(segment.key)}
                        style={[styles.segment, selected && { backgroundColor: theme.colors.surface }]}
                    >
                        <Text
                            style={{
                                color: selected ? theme.colors.contentPrimary : theme.colors.contentSecondary,
                                fontSize: theme.typography.supporting,
                                fontWeight: selected ? '600' : '400',
                            }}
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
    container: { minHeight: 44, padding: 3, borderRadius: 12, flexDirection: 'row', gap: 3 },
    segment: {
        minHeight: 38,
        minWidth: 44,
        flex: 1,
        paddingHorizontal: 12,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
