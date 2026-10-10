import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, StatusBar, StyleSheet, View, useColorScheme, useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
    Button,
    Divider,
    FresnicaUiProvider,
    Field,
    Header,
    IconButton,
    InlineMessage,
    ListRow,
    Modal,
    Progress,
    Screen,
    SegmentedControl,
    Skeleton,
    StateView,
    StatusBadge,
    Typography,
    resolveTheme,
} from '@fresnica/ui-native';
import type { ThemeMode } from '@fresnica/ui-native';
import { enUS, zhCN } from '@fresnica/ui-native/locales';

type Locale = 'en' | 'zh-CN';
type Scenario = 'standard' | 'stress';

const copy = {
    en: {
        title: 'Fresnica Native Preview',
        subtitle: 'Android host acceptance before wallet feature integration',
        environment: 'Environment',
        themeGroup: 'Theme',
        languageGroup: 'Language',
        scenarioGroup: 'Content scenario',
        system: 'System',
        systemCompact: 'System',
        light: 'Light',
        dark: 'Dark',
        english: 'English',
        chinese: '简体中文',
        standard: 'Standard',
        stress: 'Stress',
        amount: 'Amount',
        amountPlaceholder: 'Enter amount',
        stressAmountError:
            'Enter a valid amount. This deliberately long supporting message verifies wrapping at narrow widths and large font scale.',
        networkTitle: 'Network',
        networkDescription: 'Testnet connected',
        stressNetworkTitle: 'Network connection with intentionally long localized content',
        stressNetworkDescription:
            'This long description verifies that a reusable row can grow vertically without clipping or horizontal overflow.',
        addressTitle: 'Long address',
        address: '0x4d7F9f6A5cD1E24B89F0aD71E8b739f5A2b85cF2eC90d6Aa13E1427D9B1c6F49',
        status: 'Connected',
        info: 'Native components are using the current Fresnica semantic theme.',
        stressInfo:
            'Stress mode uses long content, error states and large accessible labels so narrow Android windows and font scaling can be inspected before product flows are added.',
        progress: 'Sync progress',
        componentStates: 'Control states',
        otherComponents: 'More shared primitives',
        sampleHeader: 'Sample screen header',
        stressHeader: 'A longer localized screen heading that must fit without horizontal overflow',
        iconAction: 'Toggle sample feedback',
        iconFeedback: 'Icon action was pressed',
        loadingPlaceholder: 'Loading placeholder',
        enabledAction: 'Continue',
        localThemeAction: 'Local theme override',
        stressAction: 'Continue with an intentionally long action label',
        disabledAction: 'Unavailable action',
        loadingAction: 'Loading action',
        keyboardTitle: 'Keyboard visibility check',
        keyboardPlaceholder: 'Focus this field near the bottom of the screen',
        keyboardHint: 'With the keyboard open, this field and the action below should remain reachable.',
        keyboardAction: 'Primary action below keyboard field',
        keyboardFeedback: 'Keyboard action was pressed',
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
        environment: '当前环境',
        themeGroup: '主题',
        languageGroup: '语言',
        scenarioGroup: '内容场景',
        system: '跟随系统',
        systemCompact: '系统',
        light: '浅色',
        dark: '深色',
        english: 'English',
        chinese: '简体中文',
        standard: '标准',
        stress: '压力测试',
        amount: '金额',
        amountPlaceholder: '输入金额',
        stressAmountError: '请输入有效金额。这是一段故意加长的辅助说明，用于检查窄屏和大字体下是否正确换行且不被裁切。',
        networkTitle: '网络',
        networkDescription: '测试网已连接',
        stressNetworkTitle: '包含故意加长本地化文案的网络连接状态',
        stressNetworkDescription: '这段较长的描述用于验证可复用列表行能否自然增高，并避免文字裁切或横向溢出。',
        addressTitle: '长地址',
        address: 'bc1q5r9m2g3s7t6u8w0x4zv2n6k9j8h3f5d7c4b2a1p0q9w8e7r6t5y4u3i2o1',
        status: '已连接',
        info: '原生组件正在使用当前 Fresnica 语义主题。',
        stressInfo: '压力测试会显示长文案、错误状态和较长的无障碍标签，用于在接入产品流程前检查窄屏和字体缩放。',
        progress: '同步进度',
        componentStates: '控件状态',
        otherComponents: '其他共享基础组件',
        sampleHeader: '示例页面标题',
        stressHeader: '用于验证狭窄屏幕和较大字体换行的较长示例页面标题',
        iconAction: '切换示例反馈',
        iconFeedback: '图标按钮已触发',
        loadingPlaceholder: '内容加载占位符',
        enabledAction: '继续',
        localThemeAction: '局部主题覆盖',
        stressAction: '使用一段故意加长的操作按钮文案继续',
        disabledAction: '不可用操作',
        loadingAction: '加载中的操作',
        keyboardTitle: '键盘可见性检查',
        keyboardPlaceholder: '聚焦这个位于页面底部附近的输入框',
        keyboardHint: '键盘打开后，这个输入框和下面的主要操作仍应可以滚动到并保持可见。',
        keyboardAction: '位于键盘测试输入框下方的主要操作',
        keyboardFeedback: '键盘下方操作已触发',
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
    const { width, height, fontScale } = useWindowDimensions();
    const [mode, setMode] = useState<ThemeMode>('system');
    const [locale, setLocale] = useState<Locale>('en');
    const [scenario, setScenario] = useState<Scenario>('standard');
    const [amount, setAmount] = useState('');
    const [keyboardValue, setKeyboardValue] = useState('');
    const [keyboardActionActive, setKeyboardActionActive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [iconActionActive, setIconActionActive] = useState(false);

    const labels = copy[locale];
    const uiLocale = locale === 'zh-CN' ? zhCN : enUS;
    const systemSegmentLabel = width <= 320 ? labels.systemCompact : labels.system;
    const stress = scenario === 'stress';
    const resolvedSystemMode = systemScheme === 'dark' ? 'dark' : 'light';
    const theme = useMemo(() => resolveTheme(mode, resolvedSystemMode), [mode, resolvedSystemMode]);
    const localTheme = useMemo(() => ({ ...theme, radii: { ...theme.radii, base: theme.radii.pill } }), [theme]);

    return (
        <SafeAreaProvider>
            <FresnicaUiProvider theme={theme} locale={uiLocale}>
                <SafeAreaView
                    style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
                    edges={['top', 'bottom']}
                >
                    <StatusBar barStyle={theme.systemBars.statusBarStyle} />
                    <KeyboardAvoidingView style={styles.keyboardContainer} behavior="padding">
                        <Screen theme={theme} scroll>
                            <View style={styles.section}>
                                <Typography variant="screenTitle">{labels.title}</Typography>
                                <Typography muted>{labels.subtitle}</Typography>
                            </View>

                            <View style={styles.section}>
                                <Typography theme={theme} variant="sectionTitle">
                                    {labels.environment}
                                </Typography>
                                <Typography theme={theme} muted>
                                    {Math.round(width)} × {Math.round(height)} dp · fontScale {fontScale.toFixed(2)} ·{' '}
                                    {theme.mode}
                                </Typography>
                            </View>

                            <View style={styles.section}>
                                <SegmentedControl
                                    theme={theme}
                                    accessibilityLabel={labels.themeGroup}
                                    selectedKey={mode}
                                    onChange={(key) => setMode(key as ThemeMode)}
                                    segments={[
                                        { key: 'system', label: systemSegmentLabel },
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
                                <SegmentedControl
                                    theme={theme}
                                    accessibilityLabel={labels.scenarioGroup}
                                    selectedKey={scenario}
                                    onChange={(key) => setScenario(key as Scenario)}
                                    segments={[
                                        { key: 'standard', label: labels.standard },
                                        { key: 'stress', label: labels.stress },
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
                                    state={stress ? 'error' : 'default'}
                                    supportingText={stress ? labels.stressAmountError : undefined}
                                />
                                <ListRow
                                    theme={theme}
                                    title={stress ? labels.stressNetworkTitle : labels.networkTitle}
                                    description={stress ? labels.stressNetworkDescription : labels.networkDescription}
                                    trailing={<StatusBadge theme={theme} label={labels.status} tone="positive" />}
                                />
                                {stress ? (
                                    <ListRow theme={theme} title={labels.addressTitle} description={labels.address} />
                                ) : null}
                                <InlineMessage
                                    theme={theme}
                                    message={stress ? labels.stressInfo : labels.info}
                                    tone={stress ? 'error' : 'info'}
                                />
                            </View>

                            <View style={styles.section}>
                                <Typography theme={theme} variant="sectionTitle">
                                    {labels.progress}
                                </Typography>
                                <Progress theme={theme} value={0.64} accessibilityLabel={labels.progress} />
                            </View>

                            <View style={styles.section}>
                                <Typography theme={theme} variant="sectionTitle">
                                    {labels.componentStates}
                                </Typography>
                                <Button label={stress ? labels.stressAction : labels.enabledAction} />
                                <Button theme={localTheme} variant="secondary" label={labels.localThemeAction} />
                                <Button theme={theme} label={labels.disabledAction} disabled />
                                <Button theme={theme} label={labels.loadingAction} loading />
                            </View>

                            <View style={styles.section}>
                                <Typography theme={theme} variant="sectionTitle">
                                    {labels.otherComponents}
                                </Typography>
                                <Header theme={theme} title={stress ? labels.stressHeader : labels.sampleHeader} />
                                <Divider theme={theme} />
                                <View style={styles.componentRow}>
                                    <IconButton
                                        theme={theme}
                                        label={labels.iconAction}
                                        icon={<Typography theme={theme}>+</Typography>}
                                        onPress={() => setIconActionActive((active) => !active)}
                                    />
                                    <Skeleton
                                        theme={theme}
                                        accessibilityLabel={labels.loadingPlaceholder}
                                        width="65%"
                                        height={18}
                                    />
                                </View>
                                {iconActionActive ? (
                                    <InlineMessage theme={theme} tone="success" message={labels.iconFeedback} />
                                ) : null}
                            </View>

                            <StateView
                                theme={theme}
                                title={labels.emptyTitle}
                                description={labels.emptyDescription}
                                action={
                                    <Button theme={theme} label={labels.modalOpen} onPress={() => setModalVisible(true)} />
                                }
                            />

                            <View style={styles.section}>
                                <Typography theme={theme} variant="sectionTitle">
                                    {labels.keyboardTitle}
                                </Typography>
                                <Field
                                    theme={theme}
                                    label={labels.keyboardTitle}
                                    value={keyboardValue}
                                    onChangeText={setKeyboardValue}
                                    placeholder={labels.keyboardPlaceholder}
                                    supportingText={keyboardActionActive ? undefined : labels.keyboardHint}
                                />
                                {keyboardActionActive ? (
                                    <InlineMessage theme={theme} tone="success" message={labels.keyboardFeedback} />
                                ) : null}
                                <Button
                                    theme={theme}
                                    label={labels.keyboardAction}
                                    onPress={() => setKeyboardActionActive(true)}
                                />
                            </View>

                            <Modal
                                visible={modalVisible}
                                title={labels.modalTitle}
                                closeAccessibilityLabel={labels.modalClose}
                                onRequestClose={() => setModalVisible(false)}
                            >
                                <Typography>{labels.modalBody}</Typography>
                                <Button label={labels.modalClose} onPress={() => setModalVisible(false)} />
                            </Modal>
                        </Screen>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </FresnicaUiProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    keyboardContainer: { flex: 1 },
    section: { gap: 12 },
    componentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
