import { ApillonConfig } from '../lib/apillon';
import { Identity } from '../modules/identity/identity';
import { getConfig, getWalletPrivateKey } from './helpers/helper';
import { Wallet } from 'ethers';

describe('Identity Module tests', () => {
  let config: ApillonConfig;
  let wallet: Wallet;

  beforeAll(async () => {
    config = getConfig();
    wallet = new Wallet(getWalletPrivateKey());
  });

  describe('EVM wallet signature tests', () => {
    test('Validate EVM wallet signature', async () => {
      const identity = new Identity(config);

      const customMessage = 'Identity SDK test';
      const { message } = identity.generateSigningMessage(customMessage);
      const [firstPart, secondPart] = message.split('\n');
      // Validate that custom signing message was generated correctly
      expect(firstPart).toEqual(customMessage);
      expect(+secondPart).toBeLessThanOrEqual(new Date().getTime());

      const signature = await wallet.signMessage(message);

      const res = identity.validateEvmWalletSignature({
        walletAddress: wallet.address,
        message,
        signature,
      });

      expect(res.isValid).toBeTruthy();
      expect(res.address.toLowerCase()).toEqual(wallet.address.toLowerCase());
    });

    test('Validate EVM wallet signature with timestamp', async () => {
      const identity = new Identity(config);

      const customMessage = 'Identity SDK test';
      const { timestamp, message } =
        identity.generateSigningMessage(customMessage);

      const signature = await wallet.signMessage(message);

      const res = identity.validateEvmWalletSignature({
        message,
        signature,
        timestamp,
        signatureValidityMinutes: 1,
      });

      expect(res.isValid).toBeTruthy();
      expect(res.address.toLowerCase()).toEqual(wallet.address.toLowerCase());
    });

    test('Validate EVM wallet signature with invalid timestamp', async () => {
      const identity = new Identity(config);

      const customMessage = 'Identity SDK test';
      const { message } = identity.generateSigningMessage(customMessage);

      const signature = await wallet.signMessage(message);
      const date = new Date();
      const thirtyMinEarlier = date.setTime(date.getTime() - 30 * 60_000);

      const res = identity.validateEvmWalletSignature({
        walletAddress: wallet.address,
        message,
        signature,
        timestamp: thirtyMinEarlier,
      });

      expect(res.isValid).toBeFalsy();
      expect(res.address.toLowerCase()).toEqual(wallet.address.toLowerCase());
    });
  });

  test('Get wallet identity profile', async () => {
    const identity = new Identity(config);

    const { subsocial } = await identity.getWalletIdentity(
      '3rJriA6MiYj7oFXv5hgxvSuacenm8fk76Kb5TEEHcWWQVvii',
    );
    expect(subsocial.content.name).toBe('dev only');
    expect(subsocial.content.interests).toContain('crypto');

    const { polkadot } = await identity.getWalletIdentity(
      '5HqHQDGcHqSQELAyr5PbJNAcQJew4vsoNCf5kkSpXcUGMtCK',
    );
    expect(polkadot.display.Raw).toBe('Web 3.0 Technologies Foundation');
    expect(polkadot.web.Raw).toBe('https://web3.foundation/');
  });

  test.skip('Validate Polkadot wallet signature', async () => {
    const identity = new Identity(config);
    const wallet = '';
    const res = identity.validatePolkadotWalletSignature(
      wallet,
      'Please sign this message.',
      // Fill the below value with you own signature
      // you can obtain a sample with wallet login at https://app.apillon.io/login
      '',
    );
    expect(res.isValid).toBeTruthy();
    expect(res.address.toLowerCase()).toEqual(wallet.toLowerCase());
  });
});
