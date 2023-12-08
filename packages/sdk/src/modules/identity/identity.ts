import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { IApillonResponse } from '../../types/apillon';
import { WalletIdentityData } from '../../types/identity';
import {
  bufferToHex,
  ecrecover,
  fromRpcSig,
  keccak256,
  publicToAddress,
} from 'ethereumjs-util';
import { signatureVerify, encodeAddress } from '@polkadot/util-crypto';

export class Identity extends ApillonModule {
  /**
   * Base API url for identity.
   */
  private API_PREFIX = '/wallet-identity';

  /**
   * Generate a message presented to the user when requested to sign using their wallet
   * @param {string} [customText='Please sign this message']
   * @returns {string}
   */
  public generateSigningMessage(customText = 'Please sign this message') {
    return `${customText}\n${new Date().getTime()}`;
  }

  /**
   * Get a wallet's on-chain identity data, including Subsocial and Polkadot Identity data
   * @param {string} walletAddress - Wallet address to retreive data for
   * @returns Identity data fetched from Polkadot Identity and Subsocial
   */
  public async getWalletIdentity(
    walletAddress: string,
  ): Promise<WalletIdentityData> {
    const { data } = await ApillonApi.get<IApillonResponse<WalletIdentityData>>(
      `${this.API_PREFIX}?address=${walletAddress}`,
    );

    return data;
  }

  /**
   * Check if a signed message from an EVM wallet address is valid
   * @param {string} walletAddress - Wallet address which signed the message
   * @param {string} message - The message that has been signed by the wallet
   * @param {string} signature - The wallet's signature, used for validation
   * @returns {{isValid: boolean; address: string;}}
   */
  public validateEvmWalletSignature(
    walletAddress: string,
    message: string | Uint8Array,
    signature: string,
  ): { isValid: boolean; address: string } {
    // Prefix the message and hash it using Keccak-256
    const prefixedMessage = keccak256(
      Buffer.from(
        `\x19Ethereum Signed Message:\n${message.length}${message}`,
        'utf-8',
      ),
    );
    // Split the signature into its components
    const signatureParams = fromRpcSig(signature);

    // Recover the public key
    const publicKey = ecrecover(
      prefixedMessage,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s,
    );

    // Recover the address from the signature and public key
    const address = bufferToHex(publicToAddress(publicKey)).toLowerCase();

    return {
      isValid: address.toLowerCase() === walletAddress.toLowerCase(),
      address,
    };
  }

  /**
   * Check if a signed message from a Polkadot wallet address is valid
   * @param {string} walletAddress - Wallet address which signed the message
   * @param {string} message - The message that has been signed by the wallet
   * @param {string} signature - The wallet's signature, used for validation
   * @returns {{isValid: boolean; address: string;}}
   */
  public validatePolkadotWalletSignature(
    walletAddress: string,
    message: string | Uint8Array,
    signature: string,
  ): { isValid: boolean; address: string } {
    const { isValid, publicKey } = signatureVerify(
      message,
      signature,
      walletAddress,
    );
    return { isValid, address: encodeAddress(publicKey) };
  }
}
