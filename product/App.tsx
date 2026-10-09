import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, type NavigationProp, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import {
    AccessibilityInfo,
    PermissionsAndroid,
    Platform,
    StatusBar,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
    Button,
    Field,
    Header,
    InlineMessage,
    ListRow,
    Screen,
    SegmentedControl,
    StateView,
    StatusBadge,
    Typography,
    resolveTheme,
} from '@fresnica/ui-native';
import type { AppTheme, ThemeMode } from '@fresnica/ui-native';
import { copy, type Locale } from './copy';
import {
    createTestnetWallet,
    deleteTestnetWallet,
    importTestnetWallet,
    loadTestnetWallet,
    signTestnetTransactionXdr,
} from './secure-wallet';
import {
    prepareTestnetPayment,
    submitSignedTestnetTransactionXdr,
    type PreparedTestnetPayment,
} from './testnet-horizon';
import type { WalletAccountMetadata } from './wallet-core';

type RootStackParamList = {
    Tabs: undefined;
    Transfer: undefined;
};

type TabParamList = {
    Home: undefined;
    Activity: undefined;
    Scan: undefined;
    Explore: undefined;
    Settings: undefined;
};

type SettingsContextValue = {
    locale: Locale;
    mode: ThemeMode;
    reduceMotion: boolean;
    setLocale: (locale: Locale) => void;
    setMode: (mode: ThemeMode) => void;
    theme: AppTheme;
};

const SETTINGS_KEY_MODE = 'fresnica.theme-mode';
const SETTINGS_KEY_LOCALE = 'fresnica.locale';

const SettingsContext = createContext<SettingsContextValue | null>(null);
const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function useSettings() {
    const value = useContext(SettingsContext);
    if (!value) {
        throw new Error('SettingsContext is unavailable.');
    }
    return value;
}

function Surface({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
    const { theme } = useSettings();
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <Screen theme={theme} scroll={scroll}>
                {children}
            </Screen>
        </SafeAreaView>
    );
}

function HomeScreen() {
    const { theme, locale } = useSettings();
    const labels = copy[locale];
    const network = useNetInfo();
    const rootNavigation = useNavigation<NavigationProp<RootStackParamList>>();
    const online = network.isConnected !== false;

    return (
        <Surface>
            <View style={styles.section}>
                <Typography theme={theme} variant="screenTitle">
                    {labels.appTitle}
                </Typography>
                <ListRow
                    theme={theme}
                    title={labels.network}
                    description={online ? labels.online : labels.offline}
                    trailing={
                        <StatusBadge
                            theme={theme}
                            label={online ? labels.online : labels.offline}
                            tone={online ? 'positive' : 'warning'}
                        />
                    }
                />
            </View>

            <View
                accessibilityRole="summary"
                style={[
                    styles.walletCard,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        borderRadius: theme.radii.lg,
                    },
                ]}
            >
                <Typography theme={theme} variant="sectionTitle">
                    {labels.mainWallet}
                </Typography>
                <Typography theme={theme} muted>
                    {labels.address}
                </Typography>
                <View style={styles.actions}>
                    <View style={styles.action}>
                        <Button theme={theme} label={labels.send} onPress={() => rootNavigation.navigate('Transfer')} />
                    </View>
                    <View style={styles.action}>
                        <Button theme={theme} label={labels.swap} variant="secondary" disabled />
                    </View>
                    <View style={styles.action}>
                        <Button theme={theme} label={labels.receive} variant="secondary" disabled />
                    </View>
                </View>
                <InlineMessage theme={theme} message={labels.comingSoon} tone="info" />
            </View>

            <View style={styles.section}>
                <Typography theme={theme} variant="sectionTitle">
                    {labels.assets}
                </Typography>
                <ListRow theme={theme} title="XLM" description={labels.xlmBalance} />
                <ListRow theme={theme} title="USDC" description={labels.usdcBalance} />
            </View>
        </Surface>
    );
}

function ActivityScreen() {
    const { theme, locale } = useSettings();
    const labels = copy[locale];
    return (
        <Surface scroll={false}>
            <StateView theme={theme} title={labels.noActivity} description={labels.noActivityDescription} />
        </Surface>
    );
}

function ScanScreen() {
    const { theme, locale } = useSettings();
    const labels = copy[locale];
    const [permission, setPermission] = useState<'idle' | 'granted' | 'denied'>('idle');

    async function requestCamera() {
        if (Platform.OS !== 'android') {
            setPermission('denied');
            return;
        }
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        setPermission(result === PermissionsAndroid.RESULTS.GRANTED ? 'granted' : 'denied');
    }

    return (
        <Surface scroll={false}>
            <StateView
                theme={theme}
                title={labels.scanTitle}
                description={labels.scanDescription}
                action={<Button theme={theme} label={labels.cameraAction} onPress={() => void requestCamera()} />}
            />
            {permission !== 'idle' ? (
                <InlineMessage
                    theme={theme}
                    tone={permission === 'granted' ? 'success' : 'warning'}
                    message={permission === 'granted' ? labels.cameraGranted : labels.cameraDenied}
                />
            ) : null}
        </Surface>
    );
}

function ExploreScreen() {
    const { theme, locale } = useSettings();
    const labels = copy[locale];
    const network = useNetInfo();
    const online = network.isConnected !== false;

    return (
        <Surface scroll={false}>
            <StateView
                theme={theme}
                title={labels.exploreTitle}
                description={labels.exploreDescription}
                action={
                    <StatusBadge
                        theme={theme}
                        label={online ? labels.online : labels.offline}
                        tone={online ? 'positive' : 'warning'}
                    />
                }
            />
        </Surface>
    );
}

function abbreviatePublicKey(publicKey: string) {
    return `${publicKey.slice(0, 8)}…${publicKey.slice(-8)}`;
}

function WalletSecurityPanel() {
    const { theme, locale } = useSettings();
    const labels = copy[locale];
    const [wallet, setWallet] = useState<WalletAccountMetadata | null>(null);
    const [secret, setSecret] = useState('');
    const [busy, setBusy] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        void loadTestnetWallet()
            .then(setWallet)
            .catch(() => setFailed(true));
    }, []);

    async function runWalletAction(action: () => Promise<WalletAccountMetadata>) {
        setBusy(true);
        setFailed(false);
        try {
            const nextWallet = await action();
            setWallet(nextWallet);
            setSecret('');
        } catch {
            setFailed(true);
        } finally {
            setBusy(false);
        }
    }

    async function removeWallet() {
        setBusy(true);
        setFailed(false);
        try {
            await deleteTestnetWallet();
            setWallet(null);
            setSecret('');
        } catch {
            setFailed(true);
        } finally {
            setBusy(false);
        }
    }

    return (
        <View style={styles.section}>
            <Typography theme={theme} variant="sectionTitle">
                {labels.walletSecurity}
            </Typography>
            <ListRow
                theme={theme}
                title={labels.testnetWallet}
                description={wallet ? abbreviatePublicKey(wallet.publicKey) : labels.noWalletConfigured}
                trailing={<StatusBadge theme={theme} label={labels.testnet} tone="warning" />}
            />
            <InlineMessage theme={theme} message={labels.walletSecurityHint} tone="warning" />
            {wallet ? (
                <Button
                    theme={theme}
                    label={labels.removeTestnetWallet}
                    variant="danger"
                    disabled={busy}
                    onPress={() => void removeWallet()}
                />
            ) : (
                <>
                    <Button
                        theme={theme}
                        label={labels.createTestnetWallet}
                        disabled={busy}
                        onPress={() => void runWalletAction(createTestnetWallet)}
                    />
                    <Field
                        theme={theme}
                        label={labels.secretSeed}
                        value={secret}
                        onChangeText={setSecret}
                        placeholder={labels.secretPlaceholder}
                        secureTextEntry
                        autoCapitalize="characters"
                        autoCorrect={false}
                    />
                    <Button
                        theme={theme}
                        label={labels.importTestnetWallet}
                        variant="secondary"
                        disabled={busy || secret.trim().length === 0}
                        onPress={() => void runWalletAction(() => importTestnetWallet(secret))}
                    />
                </>
            )}
            {failed ? <InlineMessage theme={theme} message={labels.walletOperationFailed} tone="error" /> : null}
        </View>
    );
}

function SettingsScreen() {
    const { theme, locale, mode, reduceMotion, setLocale, setMode } = useSettings();
    const labels = copy[locale];

    return (
        <Surface>
            <Typography theme={theme} variant="screenTitle">
                {labels.settingsTitle}
            </Typography>
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
            <InlineMessage
                theme={theme}
                tone="info"
                message={reduceMotion ? labels.reducedMotionOn : labels.reducedMotionOff}
            />
            <WalletSecurityPanel />
        </Surface>
    );
}

function TransferScreen() {
    const { theme, locale } = useSettings();
    const labels = copy[locale];
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [wallet, setWallet] = useState<WalletAccountMetadata | null>(null);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [prepared, setPrepared] = useState<PreparedTestnetPayment | null>(null);
    const [transactionHash, setTransactionHash] = useState('');
    const [busy, setBusy] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        void loadTestnetWallet()
            .then(setWallet)
            .catch(() => setFailed(true));
    }, []);

    const ready = wallet !== null && recipient.trim().length > 0 && amount.trim().length > 0 && !busy;

    async function prepareTransfer() {
        if (!wallet) {
            return;
        }

        setBusy(true);
        setFailed(false);
        try {
            const next = await prepareTestnetPayment({
                sourcePublicKey: wallet.publicKey,
                destinationPublicKey: recipient,
                amount,
            });
            setPrepared(next);
        } catch {
            setFailed(true);
        } finally {
            setBusy(false);
        }
    }

    async function submitTransfer() {
        if (!prepared) {
            return;
        }

        setBusy(true);
        setFailed(false);
        try {
            const signedXdr = await signTestnetTransactionXdr(
                prepared.unsignedXdr,
                { destinationPublicKey: prepared.destinationPublicKey, amount: prepared.amount },
                { title: labels.authenticateWallet, cancel: labels.cancel },
            );
            const hash = await submitSignedTestnetTransactionXdr(signedXdr);
            setTransactionHash(hash);
        } catch {
            setFailed(true);
        } finally {
            setBusy(false);
        }
    }

    function editTransfer() {
        setPrepared(null);
        setTransactionHash('');
        setFailed(false);
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top', 'bottom']}>
            <Header
                theme={theme}
                title={labels.transferTitle}
                leading={<Typography theme={theme}>←</Typography>}
                onBack={() => navigation.goBack()}
                backAccessibilityLabel={labels.back}
            />
            <Screen theme={theme} scroll>
                <StatusBadge theme={theme} label={labels.testnet} tone="warning" />
                {transactionHash ? (
                    <View style={styles.section}>
                        <InlineMessage theme={theme} tone="success" message={labels.transferSubmitted} />
                        <ListRow
                            theme={theme}
                            title={labels.transactionHash}
                            description={abbreviatePublicKey(transactionHash)}
                        />
                    </View>
                ) : prepared ? (
                    <View style={styles.section}>
                        <Typography theme={theme} variant="sectionTitle">
                            {labels.reviewTestnetTransfer}
                        </Typography>
                        <ListRow theme={theme} title={labels.destination} description={prepared.destinationPublicKey} />
                        <ListRow theme={theme} title={labels.amount} description={`${prepared.amount} XLM`} />
                        <InlineMessage theme={theme} tone="warning" message={labels.transferHint} />
                        <Button
                            theme={theme}
                            label={labels.authenticateAndSend}
                            loading={busy}
                            onPress={() => void submitTransfer()}
                        />
                        <Button
                            theme={theme}
                            label={labels.editTransfer}
                            variant="secondary"
                            disabled={busy}
                            onPress={editTransfer}
                        />
                    </View>
                ) : (
                    <View style={styles.section}>
                        {!wallet ? (
                            <InlineMessage theme={theme} tone="warning" message={labels.walletRequired} />
                        ) : null}
                        <Field
                            theme={theme}
                            label={labels.recipient}
                            value={recipient}
                            onChangeText={setRecipient}
                            placeholder={labels.recipientPlaceholder}
                            autoCapitalize="characters"
                            autoCorrect={false}
                        />
                        <Field
                            theme={theme}
                            label={labels.amount}
                            value={amount}
                            onChangeText={setAmount}
                            placeholder={labels.amountPlaceholder}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <InlineMessage theme={theme} tone="warning" message={labels.transferHint} />
                        <Button
                            theme={theme}
                            label={labels.review}
                            loading={busy}
                            disabled={!ready}
                            onPress={() => void prepareTransfer()}
                        />
                    </View>
                )}
                {failed ? <InlineMessage theme={theme} tone="error" message={labels.transferFailed} /> : null}
            </Screen>
        </SafeAreaView>
    );
}

function ProductTabs() {
    const { locale } = useSettings();
    const labels = copy[locale];
    const visibleLabels: Record<keyof TabParamList, string> = {
        Home: labels.home,
        Activity: labels.activity,
        Scan: labels.scan,
        Explore: labels.explore,
        Settings: labels.settings,
    };

    return (
        <Tabs.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarLabel: visibleLabels[route.name],
                tabBarAccessibilityLabel: visibleLabels[route.name],
            })}
        >
            <Tabs.Screen name="Home" component={HomeScreen} />
            <Tabs.Screen name="Activity" component={ActivityScreen} />
            <Tabs.Screen name="Scan" component={ScanScreen} />
            <Tabs.Screen name="Explore" component={ExploreScreen} />
            <Tabs.Screen name="Settings" component={SettingsScreen} />
        </Tabs.Navigator>
    );
}

function AppShell() {
    const systemScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');
    const [locale, setLocale] = useState<Locale>('en');
    const [hydrated, setHydrated] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        void AsyncStorage.multiGet([SETTINGS_KEY_MODE, SETTINGS_KEY_LOCALE]).then((entries) => {
            const values = Object.fromEntries(entries);
            const storedMode = values[SETTINGS_KEY_MODE];
            const storedLocale = values[SETTINGS_KEY_LOCALE];

            if (storedMode === 'system' || storedMode === 'light' || storedMode === 'dark') {
                setMode(storedMode);
            }
            if (storedLocale === 'en' || storedLocale === 'zh-CN') {
                setLocale(storedLocale);
            }
            setHydrated(true);
        });
    }, []);

    useEffect(() => {
        void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
        const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
        return () => subscription.remove();
    }, []);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        void AsyncStorage.multiSet([
            [SETTINGS_KEY_MODE, mode],
            [SETTINGS_KEY_LOCALE, locale],
        ]);
    }, [hydrated, locale, mode]);

    const resolvedSystemMode = systemScheme === 'dark' ? 'dark' : 'light';
    const theme = useMemo(() => resolveTheme(mode, resolvedSystemMode), [mode, resolvedSystemMode]);
    const settings = useMemo(
        () => ({ locale, mode, reduceMotion, setLocale, setMode, theme }),
        [locale, mode, reduceMotion, theme],
    );

    return (
        <SettingsContext.Provider value={settings}>
            <StatusBar barStyle={theme.systemBars.statusBarStyle} />
            <NavigationContainer
                theme={{
                    dark: theme.mode === 'dark',
                    colors: {
                        primary: theme.colors.primary,
                        background: theme.colors.background,
                        card: theme.colors.surface,
                        text: theme.colors.contentPrimary,
                        border: theme.colors.border,
                        notification: theme.colors.negative,
                    },
                    fonts: {
                        regular: { fontFamily: 'sans-serif', fontWeight: '400' },
                        medium: { fontFamily: 'sans-serif', fontWeight: '500' },
                        bold: { fontFamily: 'sans-serif', fontWeight: '700' },
                        heavy: { fontFamily: 'sans-serif', fontWeight: '700' },
                    },
                }}
            >
                <RootStack.Navigator screenOptions={{ headerShown: false }}>
                    <RootStack.Screen name="Tabs" component={ProductTabs} />
                    <RootStack.Screen name="Transfer" component={TransferScreen} />
                </RootStack.Navigator>
            </NavigationContainer>
        </SettingsContext.Provider>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <AppShell />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    section: { gap: 12 },
    walletCard: {
        borderWidth: StyleSheet.hairlineWidth,
        padding: 16,
        gap: 16,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    action: {
        flex: 1,
        minWidth: 0,
    },
});
