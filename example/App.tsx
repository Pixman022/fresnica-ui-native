import { useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
    Button,
    Field,
    InlineMessage,
    ListRow,
    Modal,
    Progress,
    Screen,
    SegmentedControl,
    StateView,
    StatusBadge,
    Typography,
    resolveTheme,
} from '@fresnica/ui-native';
import type { ThemeMode } from '@fresnica/ui-native';

type Locale = 'en' | 'zh-CN';

const copy = {
    en: {
        title: 'Fresnica Native Preview',
        subtitle: 'Android host acceptance before wallet feature integration',
        themeGroup: 'Theme',
        languageGroup: 'Language',
        system: 'System',
        light: 'Light',
        dark: 'Dark',
        english: 'English',
        chinese: '简体中文',
        amount: 'Amount',
        amountPlaceholder: 'Enter amount',
        networkTitle: 'Network',
        networkDescription: 'Testnet connected',
        status: 'Connected',
        info: 'Native components are using the current Fresnica semantic theme.',
        progress: 'Sync progress',
        modalOpen: 'Open modal',
        modalTitle: 'Preview modal',
        modalClose: 'Close modal',
        modalBody: 'Android back and the close action should dismiss this modal.',
        emptyTitle: 'No wallet feature loaded',
        emptyDescription: 'The preview host validates shared primitives before product flows are added.',
    },
    'zh-CN': {
        title: 'Fresnica 原生预览',
        subtitle: '在接入钱包业务前验证 Android 宿主能力',
        themeGroup: '主题',
        languageGroup: '语言',
        system: '跟随系统',
        light: '浅色',
        dark: '深色',
        english: 'English',
        chinese: '简体中文',
        amount: '金额',
        amountPlaceholder: '输入金额',
        networkTitle: '网络',
        networkDescription: '测试网已连接',
        status: '已连接',
        info: '原生组件正在使用当前 Fresnica 语义主题。',
        progress: '同步进度',
        modalOpen: '打开弹窗',
        modalTitle: '预览弹窗',
        modalClose: '关闭弹窗',
        modalBody: 'Android 返回键和关闭按钮都应该能够关闭此弹窗。',
        emptyTitle: '尚未加载钱包功能',
        emptyDescription: '在加入产品流程之前，先通过预览宿主验证共享基础组件。',
    },
} as const;

export default function App() {
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');
    const [locale, setLocale] = useState<Locale>('en');
    const [amount, setAmount] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const labels = copy[locale];
    const resolvedSystemMode = systemScheme === 'dark' ? 'dark' : 'light';
    const theme = useMemo(() => resolveTheme(mode, resolvedSystemMode), [mode, resolvedSystemMode]);

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
                edges={['top', 'bottom']}
            >
                <StatusBar barStyle={theme.systemBars.statusBarStyle} />
                <Screen theme={theme} scroll>
                    <View style={styles.section}>
                        <Typography theme={theme} variant="screenTitle">
                            {labels.title}
                        </Typography>
                        <Typography theme={theme} muted>
                            {labels.subtitle}
                        </Typography>
                    </View>

                    <View style={styles.section}>
                        <SegmentedControl
                            theme={theme}
                            accessibilityLabel={labels.themeGroup}
                            selectedKey={mode}
                            onChange={(key) => setMode(key as ThemeMode)}
                            segments={[
                                { key: 'system', label: labels.system },
                                { key: 'light', label: labels.light },
                                { key: 'dark', label: labels.dark },
                            ]}
                        />
                        <SegmentedControl
                            theme={theme}
                            accessibilityLabel={labels.languageGroup}
                            selectedKey={locale}
                            onChange={(key) => setLocale(key as Locale)}
                            segments={[
                                { key: 'en', label: labels.english },
                                { key: 'zh-CN', label: labels.chinese },
                            ]}
                        />
                    </View>

                    <View style={styles.section}>
                        <Field
                            theme={theme}
                            label={labels.amount}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder={labels.amountPlaceholder}
                        />
                        <ListRow
                            theme={theme}
                            title={labels.networkTitle}
                            description={labels.networkDescription}
                            trailing={<StatusBadge theme={theme} label={labels.status} tone="positive" />}
                        />
                        <InlineMessage theme={theme} message={labels.info} />
                    </View>

                    <View style={styles.section}>
                        <Typography theme={theme} variant="sectionTitle">
                            {labels.progress}
                        </Typography>
                        <Progress theme={theme} value={0.64} accessibilityLabel={labels.progress} />
                    </View>

                    <StateView
                        theme={theme}
                        title={labels.emptyTitle}
                        description={labels.emptyDescription}
                        action={<Button theme={theme} label={labels.modalOpen} onPress={() => setModalVisible(true)} />}
                    />

                    <Modal
                        theme={theme}
                        visible={modalVisible}
                        title={labels.modalTitle}
                        closeAccessibilityLabel={labels.modalClose}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <Typography theme={theme}>{labels.modalBody}</Typography>
                        <Button theme={theme} label={labels.modalClose} onPress={() => setModalVisible(false)} />
                    </Modal>
                </Screen>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    section: { gap: 12 },
});
