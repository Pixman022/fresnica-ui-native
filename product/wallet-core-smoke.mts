import assert from 'node:assert/strict';
import { Account, Asset, BASE_FEE, Keypair, Networks, Operation, TransactionBuilder } from '@stellar/stellar-sdk';
import {
    buildUnsignedTestnetPaymentXdr,
    createTestnetWalletMaterial,
    importTestnetWalletMaterial,
    signTestnetTransactionXdr,
    validateXlmAmount,
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
const reviewedPayment = { destinationPublicKey: destination, amount: '1' };
const signedXdr = signTestnetTransactionXdr(unsignedXdr, created.secret, reviewedPayment);
const signed = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);

assert.equal(signed.signatures.length, 1);

const other = createTestnetWalletMaterial();
assert.throws(
    () => signTestnetTransactionXdr(unsignedXdr, other.secret, reviewedPayment),
    /Transaction source does not match the local wallet/,
);
assert.throws(
    () => signTestnetTransactionXdr(unsignedXdr, created.secret, { ...reviewedPayment, amount: '2' }),
    /Transaction does not match the reviewed Testnet payment/,
);
assert.throws(
    () => signTestnetTransactionXdr(unsignedXdr, created.secret, { ...reviewedPayment, destinationPublicKey: other.publicKey }),
    /Transaction does not match the reviewed Testnet payment/,
);

const unexpectedOperationXdr = new TransactionBuilder(new Account(created.publicKey, '1'), {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
})
    .addOperation(Operation.manageData({ name: 'unexpected', value: '1' }))
    .setTimeout(180)
    .build()
    .toXDR();
assert.throws(
    () => signTestnetTransactionXdr(unexpectedOperationXdr, created.secret, reviewedPayment),
    /Transaction does not match the reviewed Testnet payment/,
);

const excessiveFeeXdr = new TransactionBuilder(new Account(created.publicKey, '1'), {
    fee: '200',
    networkPassphrase: Networks.TESTNET,
})
    .addOperation(Operation.payment({ destination, asset: Asset.native(), amount: '1' }))
    .setTimeout(180)
    .build()
    .toXDR();
assert.throws(
    () => signTestnetTransactionXdr(excessiveFeeXdr, created.secret, reviewedPayment),
    /Transaction fee differs from the approved Testnet fee/,
);

assert.equal(validateXlmAmount('1.2345678'), '1.2345678');
assert.throws(() => validateXlmAmount('0'));
assert.throws(() => validateXlmAmount('-1'));
assert.throws(() => validateXlmAmount('1.23456789'));
assert.throws(() => importTestnetWalletMaterial('not-a-stellar-secret'));

console.log('wallet core smoke passed');
