import { ApillonConfig } from '../lib/apillon';
import { Identity } from '../modules/identity/identity';
import { getConfig, getWalletPrivateKey } from './helpers/helper';
import { Wallet } from 'ethers';

describe('IPNS tests for StorageBucket', () => {
  let config: ApillonConfig;

  beforeAll(async () => {
    config = getConfig();
  });

  test('Validate EVM wallet signature', async () => {
    const identity = new Identity(config);

    const customMessage = 'Identity SDK test';
    const message = identity.generateSigningMessage(customMessage);
    const [firstPart, secondPart] = message.split('\n');
    // Validate that custom signing message was generated correctly
    expect(firstPart).toEqual(customMessage);
    expect(+secondPart).toBeLessThan(new Date().getTime());

    // Create a wallet from your private key
    const wallet = new Wallet(getWalletPrivateKey());

    const signature = await wallet.signMessage(message);

    console.log('Message:', message);
    console.log('Signature:', signature);

    const res = identity.validateEvmWalletSignature(
      wallet.address,
      message,
      signature,
    );

    expect(res.isValid).toBeTruthy();
    expect(res.address.toLowerCase()).toEqual(wallet.address.toLowerCase());
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
});
