import {
    buildUnsignedTestnetPaymentXdr,
    createTestnetWalletMaterial,
    importTestnetWalletMaterial,
    signTestnetTransactionXdr,
} from './wallet-core';
import { Keypair, Networks, TransactionBuilder } from '@stellar/stellar-sdk';

describe('wallet core', () => {
    it('creates and imports the same Stellar Testnet identity', () => {
        const created = createTestnetWalletMaterial();
        const imported = importTestnetWalletMaterial(created.secret);

        expect(created.network).toBe('testnet');
        expect(imported.publicKey).toBe(created.publicKey);
        expect(imported.secret).toBe(created.secret);
    });

    it('signs a Testnet payment only for the local source account', () => {
        const source = createTestnetWalletMaterial();
        const destination = Keypair.random().publicKey();
        const unsignedXdr = buildUnsignedTestnetPaymentXdr({
            sourcePublicKey: source.publicKey,
            sourceSequence: '1',
            destinationPublicKey: destination,
            amount: '1',
        });

        const signedXdr = signTestnetTransactionXdr(unsignedXdr, source.secret);
        const signed = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);

        expect(signed.signatures).toHaveLength(1);
    });

    it('rejects signing a transaction owned by a different source account', () => {
        const source = createTestnetWalletMaterial();
        const other = createTestnetWalletMaterial();
        const destination = Keypair.random().publicKey();
        const unsignedXdr = buildUnsignedTestnetPaymentXdr({
            sourcePublicKey: source.publicKey,
            sourceSequence: '1',
            destinationPublicKey: destination,
            amount: '1',
        });

        expect(() => signTestnetTransactionXdr(unsignedXdr, other.secret)).toThrow(
            'Transaction source does not match the local wallet.',
        );
    });

    it('rejects invalid secret seeds', () => {
        expect(() => importTestnetWalletMaterial('not-a-stellar-secret')).toThrow();
    });
});
