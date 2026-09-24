import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { AppTheme } from '../tokens';

export type IconButtonProps = {
    theme: AppTheme;
    label: string;
    icon: ReactNode;
    onPress?: () => void;
    disabled?: boolean;
};

export function IconButton({ theme, label, icon, onPress, disabled = false }: IconButtonProps) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            disabled={disabled}
            hitSlop={4}
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? theme.colors.surfaceRaised : 'transparent', opacity: disabled ? 0.5 : 1 },
            ]}
        >
            {icon}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
});
