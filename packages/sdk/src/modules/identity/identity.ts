import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { IApillonResponse } from '../../types/apillon';
import {
  IValidateEvmWalletSignature,
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
   * @param {IValidateEvmWalletSignature} data - The data used to validate the EVM signature
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
    const signatureParams = fromRpcSig(data.signature);

    // Recover the public key
    const publicKey = ecrecover(
      prefixedMessage,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s,
    );

    // Recover the address from the signature and public key
    const address = bufferToHex(publicToAddress(publicKey));

    return {
      isValid: walletAddress
        ? isValidTimestamp &&
          address.toLowerCase() === walletAddress.toLowerCase()
        : true,
      address,
    };
  }

  /**
   * Check if a signed message from a Polkadot wallet address is valid
   * @param {string} walletAddress - Wallet address which signed the message
   * @param {string | Uint8Array} message - The message that has been signed by the wallet
   * @param {string | Uint8Array} signature - The wallet's signature, used for validation
   * @returns {{isValid: boolean; address: string;}}
   */
  public validatePolkadotWalletSignature(
    walletAddress: string,
    message: string | Uint8Array,
    signature: string | Uint8Array,
  ): { isValid: boolean; address: string } {
    const { isValid, publicKey } = signatureVerify(
      message,
      signature,
      walletAddress,
    );
    return { isValid, address: encodeAddress(publicKey) };
  }
}
