import {
  cryptoWaitReady,
  mnemonicGenerate,
  mnemonicToMiniSecret,
  ed25519PairFromSeed,
  encodeAddress,
} from '@polkadot/util-crypto';
import { ApillonConfig } from '../lib/apillon';
import { Identity } from '../modules/identity/identity';
import { getConfig } from './helpers/helper';
import { Wallet } from 'ethers';
import { Keyring } from '@polkadot/keyring';

describe('Identity Module tests', () => {
  let config: ApillonConfig;
  let identity: Identity;

  beforeAll(async () => {
    config = getConfig();
    identity = new Identity(config);
    await cryptoWaitReady();
  });

  describe('EVM wallet signature tests', () => {
    test('Validate EVM wallet signature', async () => {
      const customMessage = 'Identity EVM SDK test';
      const { message } = identity.generateSigningMessage(customMessage);
      const [firstPart, secondPart] = message.split('\n');
      // Validate that custom signing message was generated correctly
      expect(firstPart).toEqual(customMessage);
      expect(+secondPart).toBeLessThanOrEqual(new Date().getTime());

      const { walletAddress, signature } = await generateEvmWalletAndSignature(
        message,
      );

      const { isValid, address } = identity.validateEvmWalletSignature({
        walletAddress,
        message,
        signature,
      });

      expect(isValid).toBeTruthy();
      expect(address.toLowerCase()).toEqual(walletAddress.toLowerCase());
    });

    test('Validate EVM wallet signature with timestamp', async () => {
      const identity = new Identity(config);

      const customMessage = 'Identity EVM SDK test';
      const { timestamp, message } =
        identity.generateSigningMessage(customMessage);
      expect(timestamp).toBeLessThanOrEqual(new Date().getTime());

      const { walletAddress, signature } = await generateEvmWalletAndSignature(
        message,
      );

      const { isValid, address } = identity.validateEvmWalletSignature({
        message,
        signature,
        timestamp,
        signatureValidityMinutes: 1,
      });

      expect(isValid).toBeTruthy();
      expect(address.toLowerCase()).toEqual(walletAddress.toLowerCase());
    });

    test('Validate EVM wallet signature with invalid timestamp', async () => {
      const identity = new Identity(config);

      const customMessage = 'Identity EVM SDK test';
      const { message } = identity.generateSigningMessage(customMessage);

      const { walletAddress, signature } = await generateEvmWalletAndSignature(
        message,
      );

      const date = new Date();
      const thirtyMinEarlier = date.setTime(date.getTime() - 30 * 60_000);

      const validate = () =>
        identity.validateEvmWalletSignature({
          walletAddress,
          message,
          signature,
          timestamp: thirtyMinEarlier,
        });

      expect(validate).toThrow('Message does not contain a valid timestamp');
    });
  });

  describe('Polkadot wallet signature tests', () => {
    test('Validate Polkadot wallet signature', async () => {
      const identity = new Identity(config);

      const customMessage = 'Identity Polkadot SDK test';
      const { message } = identity.generateSigningMessage(customMessage);
      const [firstPart, secondPart] = message.split('\n');
      // Validate that custom signing message was generated correctly
      expect(firstPart).toEqual(customMessage);
      expect(+secondPart).toBeLessThanOrEqual(new Date().getTime());

      const { walletAddress, signature } =
        generatePolkadotWalletAndSignature(message);

      const { isValid, address } = identity.validatePolkadotWalletSignature({
        walletAddress,
        signature,
        message,
      });

      expect(isValid).toBeTruthy();
      expect(address.toLowerCase()).toEqual(
        encodeAddress(walletAddress).toLowerCase(),
      );
    });

    test('Validate Polkadot wallet signature with timestamp', async () => {
      const identity = new Identity(config);

      const customMessage = 'Identity Polkadot SDK test';
      const { timestamp, message } =
        identity.generateSigningMessage(customMessage);
      expect(timestamp).toBeLessThanOrEqual(new Date().getTime());

      const { walletAddress, signature } =
        generatePolkadotWalletAndSignature(message);

      const { isValid, address } = identity.validatePolkadotWalletSignature({
        walletAddress,
        signature,
        message,
        timestamp,
        signatureValidityMinutes: 1,
      });

      expect(isValid).toBeTruthy();
      expect(address.toLowerCase()).toEqual(
        encodeAddress(walletAddress).toLowerCase(),
      );
    });

    test('Validate Polkadot wallet signature with invalid timestamp', async () => {
      const identity = new Identity(config);

      const customMessage = 'Identity Polkadot SDK test';
      const { message } = identity.generateSigningMessage(customMessage);

      const { walletAddress, signature } =
        generatePolkadotWalletAndSignature(message);
      const date = new Date();
      const thirtyMinEarlier = date.setTime(date.getTime() - 30 * 60_000);

      const validate = () =>
        identity.validatePolkadotWalletSignature({
          walletAddress,
          message,
          signature,
          timestamp: thirtyMinEarlier,
        });

      expect(validate).toThrow();
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

  const generateEvmWalletAndSignature = async (message: string) => {
    const mnemonic = Wallet.createRandom().mnemonic.phrase;
    const wallet = Wallet.fromPhrase(mnemonic);
    const signature = await wallet.signMessage(message);

    return { walletAddress: wallet.address, signature };
  };

  const generatePolkadotWalletAndSignature = (message: string) => {
    const mnemonic = mnemonicGenerate();
    const seedPhrase = mnemonicToMiniSecret(mnemonic);

    // wallet address obtained from seed phrase
    const walletAddress = ed25519PairFromSeed(seedPhrase).publicKey;

    const keypair = new Keyring({
      ss58Format: 38,
      type: 'ed25519',
    }).createFromUri(mnemonic);

    // Sign message with generated wallet
    const signature = keypair.sign(message);

    return { walletAddress, signature };
  };
});
