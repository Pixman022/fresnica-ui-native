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

export type TestnetPaymentIntent = {
    destinationPublicKey: string;
    amount: string;
};

const MAX_STROOPS = 9_223_372_036_854_775_807n;
const STROOPS_PER_XLM = 10_000_000n;

export function validateXlmAmount(amountInput: string): string {
    const amount = amountInput.trim();
    const match = /^(\d+)(?:\.(\d{1,7}))?$/.exec(amount);
    if (!match) {
        throw new Error('Amount must be a positive XLM value with at most 7 decimal places.');
    }

    const whole = BigInt(match[1]);
    const fraction = BigInt((match[2] ?? '').padEnd(7, '0') || '0');
    const stroops = whole * STROOPS_PER_XLM + fraction;

    if (stroops <= 0n || stroops > MAX_STROOPS) {
        throw new Error('Amount is outside the Stellar XLM range.');
    }

    return amount;
}

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

function xlmToStroops(amountInput: string): bigint {
    const [whole, fraction = ''] = validateXlmAmount(amountInput).split('.');
    return BigInt(whole) * STROOPS_PER_XLM + BigInt(fraction.padEnd(7, '0') || '0');
}

export function signTestnetTransactionXdr(
    transactionXdr: string,
    secret: string,
    intent: TestnetPaymentIntent,
): string {
    const keypair = Keypair.fromSecret(secret);
    const transaction = TransactionBuilder.fromXDR(transactionXdr, TESTNET_NETWORK.passphrase);

    if (!('source' in transaction) || transaction.source !== keypair.publicKey()) {
        throw new Error('Transaction source does not match the local wallet.');
    }
    if (!('operations' in transaction) || transaction.operations.length !== 1) {
        throw new Error('Only a single native XLM payment can be signed.');
    }

    const payment = transaction.operations[0];
    if (
        payment.type !== 'payment' ||
        (payment.source !== undefined && payment.source !== keypair.publicKey()) ||
        !payment.asset.isNative() ||
        payment.destination !== intent.destinationPublicKey ||
        xlmToStroops(payment.amount) !== xlmToStroops(intent.amount)
    ) {
        throw new Error('Transaction does not match the reviewed Testnet payment.');
    }
    if (transaction.fee !== BASE_FEE) {
        throw new Error('Transaction fee differs from the approved Testnet fee.');
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
    const amount = validateXlmAmount(input.amount);

    const sourceAccount = new Account(input.sourcePublicKey, input.sourceSequence);
    return new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: TESTNET_NETWORK.passphrase,
    })
        .addOperation(
            Operation.payment({
                destination: input.destinationPublicKey,
                asset: Asset.native(),
                amount,
            }),
        )
        .setTimeout(180)
        .build()
        .toXDR();
}
