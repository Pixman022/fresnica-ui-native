import { Horizon, TransactionBuilder } from '@stellar/stellar-sdk';
import { buildUnsignedTestnetPaymentXdr, TESTNET_NETWORK, validateXlmAmount } from './wallet-core';

const server = new Horizon.Server(TESTNET_NETWORK.horizonUrl);

export type PreparedTestnetPayment = {
    amount: string;
    destinationPublicKey: string;
    sourcePublicKey: string;
    unsignedXdr: string;
};

export async function prepareTestnetPayment(input: {
    sourcePublicKey: string;
    destinationPublicKey: string;
    amount: string;
}): Promise<PreparedTestnetPayment> {
    const amount = validateXlmAmount(input.amount);
    const source = await server.loadAccount(input.sourcePublicKey);
    const unsignedXdr = buildUnsignedTestnetPaymentXdr({
        sourcePublicKey: input.sourcePublicKey,
        sourceSequence: source.sequenceNumber(),
        destinationPublicKey: input.destinationPublicKey.trim(),
        amount,
    });

    return {
        amount,
        destinationPublicKey: input.destinationPublicKey.trim(),
        sourcePublicKey: input.sourcePublicKey,
        unsignedXdr,
    };
}

export async function submitSignedTestnetTransactionXdr(signedXdr: string): Promise<string> {
    const transaction = TransactionBuilder.fromXDR(signedXdr, TESTNET_NETWORK.passphrase);
    const result = await server.submitTransaction(transaction);
    return result.hash;
}
