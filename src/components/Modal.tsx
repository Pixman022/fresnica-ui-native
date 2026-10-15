import type { ComponentRef, ReactNode, Ref } from 'react';
import { Modal as NativeModal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useUiLocale, useUiTheme } from '../ui-context';
import type { AppTheme } from '../tokens';

type PressableRef = ComponentRef<typeof Pressable>;

export type ModalProps = {
    theme?: AppTheme;
    visible: boolean;
    title: string;
    children: ReactNode;
    onRequestClose: () => void;
    onShow?: () => void;
    closeAccessibilityLabel?: string;
    closeButtonRef?: Ref<PressableRef>;
};

export function Modal({
    theme: themeOverride,
    visible,
    title,
    children,
    onRequestClose,
    onShow,
    closeAccessibilityLabel,
    closeButtonRef,
}: ModalProps) {
    const theme = useUiTheme(themeOverride);
    const locale = useUiLocale();
    const resolvedCloseAccessibilityLabel = closeAccessibilityLabel ?? locale.close;

    return (
        <NativeModal
            visible={visible}
            transparent
            animationType="fade"
            onShow={onShow}
            onRequestClose={onRequestClose}
            accessibilityViewIsModal
        >
            <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
                <View style={[styles.surface, { backgroundColor: theme.colors.surface, borderRadius: theme.radii.lg }]}>
                    <View style={styles.header}>
                        <Text
                            style={[
                                styles.title,
                                { color: theme.colors.contentPrimary, fontSize: theme.typography.sectionTitle },
                            ]}
                        >
                            {title}
                        </Text>
                        <Pressable
                            ref={closeButtonRef}
                            accessible
                            accessibilityRole="button"
                            accessibilityLabel={resolvedCloseAccessibilityLabel}
                            onPress={onRequestClose}
                            style={styles.close}
                            hitSlop={8}
                        >
                            <Text style={{ color: theme.colors.contentSecondary, fontSize: 20 }}>×</Text>
                        </Pressable>
                    </View>
                    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                        {children}
                    </ScrollView>
                </View>
            </View>
        </NativeModal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    surface: { width: '100%', maxWidth: 480, maxHeight: '90%', padding: 24, gap: 16 },
    header: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 12 },
    title: { flex: 1, flexShrink: 1, fontWeight: '700' },
    close: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
    content: { gap: 16 },
});
