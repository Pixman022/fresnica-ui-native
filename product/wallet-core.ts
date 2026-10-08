import { Account, Asset, BASE_FEE, Keypair, Networks, Operation, TransactionBuilder } from '@stellar/stellar-sdk';

export const TESTNET_NETWORK = {
    id: 'testnet',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    passphrase: Networks.TESTNET,
} as const;

export type WalletAccountMetadata = {
    custody: 'local';
    network: 'testnet';
    publicKey: string;
};

export type WalletSecretMaterial = WalletAccountMetadata & {
    secret: string;
};

export function createTestnetWalletMaterial(): WalletSecretMaterial {
    const keypair = Keypair.random();
    return {
        custody: 'local',
        network: 'testnet',
        publicKey: keypair.publicKey(),
        secret: keypair.secret(),
    };
}

export function importTestnetWalletMaterial(secretInput: string): WalletSecretMaterial {
    const secret = secretInput.trim();
    const keypair = Keypair.fromSecret(secret);
    return {
        custody: 'local',
        network: 'testnet',
        publicKey: keypair.publicKey(),
        secret,
    };
}

export function signTestnetTransactionXdr(transactionXdr: string, secret: string): string {
    const keypair = Keypair.fromSecret(secret);
    const transaction = TransactionBuilder.fromXDR(transactionXdr, TESTNET_NETWORK.passphrase);

    if (!('source' in transaction) || transaction.source !== keypair.publicKey()) {
        throw new Error('Transaction source does not match the local wallet.');
    }

    transaction.sign(keypair);
    return transaction.toXDR();
}

export function buildUnsignedTestnetPaymentXdr(input: {
    sourcePublicKey: string;
    sourceSequence: string;
    destinationPublicKey: string;
    amount: string;
}): string {
    Keypair.fromPublicKey(input.sourcePublicKey);
    Keypair.fromPublicKey(input.destinationPublicKey);

    const sourceAccount = new Account(input.sourcePublicKey, input.sourceSequence);
    return new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: TESTNET_NETWORK.passphrase,
    })
        .addOperation(
            Operation.payment({
                destination: input.destinationPublicKey,
                asset: Asset.native(),
                amount: input.amount,
            }),
        )
        .setTimeout(180)
        .build()
        .toXDR();
}
