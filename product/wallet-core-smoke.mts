import assert from 'node:assert/strict';
import { Keypair, Networks, TransactionBuilder } from '@stellar/stellar-sdk';
import {
    buildUnsignedTestnetPaymentXdr,
    createTestnetWalletMaterial,
    importTestnetWalletMaterial,
    signTestnetTransactionXdr,
} from './wallet-core.ts';

const created = createTestnetWalletMaterial();
const imported = importTestnetWalletMaterial(created.secret);

assert.equal(imported.publicKey, created.publicKey);
assert.equal(imported.secret, created.secret);

const destination = Keypair.random().publicKey();
const unsignedXdr = buildUnsignedTestnetPaymentXdr({
    sourcePublicKey: created.publicKey,
    sourceSequence: '1',
    destinationPublicKey: destination,
    amount: '1',
});
const signedXdr = signTestnetTransactionXdr(unsignedXdr, created.secret);
const signed = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);

assert.equal(signed.signatures.length, 1);

const other = createTestnetWalletMaterial();
assert.throws(
    () => signTestnetTransactionXdr(unsignedXdr, other.secret),
    /Transaction source does not match the local wallet/,
);
assert.throws(() => importTestnetWalletMaterial('not-a-stellar-secret'));

console.log('wallet core smoke passed');
