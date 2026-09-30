/**
 * Hostless Jest adapter for the standalone component package.
 *
 * React Native 0.87 no longer ships a package-level Jest preset. These host
 * primitives keep React Native Testing Library tests runnable before a product
 * App provides the real Android native test host. Device behavior remains an
 * App-level acceptance concern.
 */
export const View = 'View';
export const Text = 'Text';
export const Pressable = 'Pressable';
export const ScrollView = 'ScrollView';
export const TextInput = 'TextInput';
export const Modal = 'Modal';

export const StyleSheet = {
    create: <T extends Record<string, unknown>>(styles: T): T => styles,
    flatten: (style: unknown) => style,
    hairlineWidth: 1,
};
