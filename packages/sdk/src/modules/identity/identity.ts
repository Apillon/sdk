import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { IApillonResponse } from '../../types/apillon';
import {
  IValidateEvmWalletSignature,
  IValidatePolkadotWalletSignature,
  VerifySignedMessageResult,
  WalletIdentityData,
} from '../../types/identity';
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
   * Generate a message presented to the user when requested to sign using their wallet
   * @param {string} [customText='Please sign this message']
   * @returns {{message: string, timestamp: number}}
   */
  public generateSigningMessage(customText = 'Please sign this message'): {
    message: string;
    timestamp: number;
  } {
    const timestamp = new Date().getTime();
    const message = `${customText}\n${timestamp}`;
    return { message, timestamp };
  }

  /**
   * Check if a signed message from an EVM wallet address is valid
   * @param {IValidateWalletSignature} data - The data used to validate the EVM signature
   * @returns {VerifySignedMessageResult}
   */
  public validateEvmWalletSignature(
    data: IValidateEvmWalletSignature,
  ): VerifySignedMessageResult {
    const { walletAddress, message, timestamp } = data;

    // Check if the timestamp is within the valid time range (default 10 minutes)
    const isValidTimestamp = timestamp
      ? new Date().getTime() - timestamp <=
        (data.signatureValidityMinutes || 10) * 60_000
      : true;

    // Prefix the message and hash it using Keccak-256
    const prefixedMessage = keccak256(
      Buffer.from(
        `\x19Ethereum Signed Message:\n${message.length}${message}`,
        'utf-8',
      ),
    );
    // Split the signature into its components
    const { v, r, s } = fromRpcSig(data.signature);

    // Recover the public key
    const publicKey = ecrecover(prefixedMessage, v, r, s);

    // Recover the address from the signature and public key
    const address = bufferToHex(publicToAddress(publicKey));

    const isValidAddress = walletAddress
      ? address.toLowerCase() === walletAddress.toLowerCase()
      : true;

    return {
      isValid: isValidTimestamp && isValidAddress,
      address,
    };
  }

  /**
   * Check if a signed message from a Polkadot wallet address is valid
   * @param {IValidatePolkadotWalletSignature} data - The data used to validate the Polkadot signature
   * @returns {{isValid: boolean; address: string;}}
   */
  public validatePolkadotWalletSignature(
    data: IValidatePolkadotWalletSignature,
  ): {
    isValid: boolean;
    address: string;
  } {
    const { message, signature, walletAddress, timestamp } = data;

    // Check if the timestamp is within the valid time range (default 10 minutes)
    const isValidTimestamp = timestamp
      ? new Date().getTime() - timestamp <=
        (data.signatureValidityMinutes || 10) * 60_000
      : true;

    const { isValid, publicKey } = signatureVerify(
      message,
      signature,
      walletAddress,
    );

    return {
      isValid: isValidTimestamp && isValid,
      address: encodeAddress(publicKey),
    };
  }
}
