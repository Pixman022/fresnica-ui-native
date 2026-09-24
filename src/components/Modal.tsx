import type { ReactNode } from 'react';
import { Modal as NativeModal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppTheme } from '../tokens';

export type ModalProps = {
    theme: AppTheme;
    visible: boolean;
    title: string;
    children: ReactNode;
    onRequestClose: () => void;
};

export function Modal({ theme, visible, title, children, onRequestClose }: ModalProps) {
    return (
        <NativeModal
            visible={visible}
            transparent
            animationType="fade"
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
                            accessibilityRole="button"
                            accessibilityLabel="Close"
                            onPress={onRequestClose}
                            style={styles.close}
                            hitSlop={8}
                        >
                            <Text style={{ color: theme.colors.contentSecondary, fontSize: 20 }}>×</Text>
                        </Pressable>
                    </View>
                    {children}
                </View>
            </View>
        </NativeModal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    surface: { width: '100%', maxWidth: 480, padding: 24, gap: 16 },
    header: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 12 },
    title: { flex: 1, fontWeight: '700' },
    close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
