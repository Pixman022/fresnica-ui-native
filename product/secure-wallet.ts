import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import {
    createTestnetWalletMaterial,
    importTestnetWalletMaterial,
    signTestnetTransactionXdr as signXdr,
    type WalletAccountMetadata,
    type WalletSecretMaterial,
} from './wallet-core';

const KEYCHAIN_SERVICE = 'com.fresnica.wallet.testnet.secret';
const METADATA_KEY = 'fresnica.wallet.testnet.metadata';

const secretOptions = {
    service: KEYCHAIN_SERVICE,
    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    storage: Keychain.STORAGE_TYPE.AES_GCM,
} as const;

type AuthenticationPrompt = {
    title: string;
    cancel: string;
};

const defaultAuthenticationPrompt: AuthenticationPrompt = {
    title: 'Authenticate to use Fresnica wallet',
    cancel: 'Cancel',
};

function toMetadata(material: WalletSecretMaterial): WalletAccountMetadata {
    return {
        custody: material.custody,
        network: material.network,
        publicKey: material.publicKey,
    };
}

async function persistWallet(material: WalletSecretMaterial): Promise<WalletAccountMetadata> {
    const stored = await Keychain.setGenericPassword(material.publicKey, material.secret, {
        ...secretOptions,
        authenticationPrompt: defaultAuthenticationPrompt,
    });
    if (!stored) {
        throw new Error('Secure wallet storage is unavailable.');
    }

    const metadata = toMetadata(material);
    try {
        await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
        await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
        throw error;
    }

    return metadata;
}

export async function createTestnetWallet(): Promise<WalletAccountMetadata> {
    return persistWallet(createTestnetWalletMaterial());
}

export async function importTestnetWallet(secret: string): Promise<WalletAccountMetadata> {
    return persistWallet(importTestnetWalletMaterial(secret));
}

export async function loadTestnetWallet(): Promise<WalletAccountMetadata | null> {
    const [rawMetadata, hasSecret] = await Promise.all([
        AsyncStorage.getItem(METADATA_KEY),
        Keychain.hasGenericPassword({ service: KEYCHAIN_SERVICE }),
    ]);

    if (!rawMetadata || !hasSecret) {
        return null;
    }

    const metadata = JSON.parse(rawMetadata) as Partial<WalletAccountMetadata>;
    if (metadata.custody !== 'local' || metadata.network !== 'testnet' || typeof metadata.publicKey !== 'string') {
        return null;
    }

    return metadata as WalletAccountMetadata;
}

export async function deleteTestnetWallet(): Promise<void> {
    await Keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
    await AsyncStorage.removeItem(METADATA_KEY);
}

export async function signTestnetTransactionXdr(
    transactionXdr: string,
    authenticationPrompt = defaultAuthenticationPrompt,
): Promise<string> {
    const credentials = await Keychain.getGenericPassword({
        ...secretOptions,
        authenticationPrompt,
    });
    if (!credentials) {
        throw new Error('Local signing key is unavailable.');
    }

    return signXdr(transactionXdr, credentials.password);
}
