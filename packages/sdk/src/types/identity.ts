export interface WalletIdentityData {
  /**
   * [Polkadot Identity Info DTO](https://github.com/polkadot-js/api/blob/c73c26d13324a6211a7cf4e401aa032c87f7aa10/packages/types-augment/src/lookup/types-substrate.ts#L3331)
   */
  polkadot: any;
  /**
   * [Subsocial SpaceData DTO](https://docs.subsocial.network/js-docs/js-sdk/modules/dto.html#spacedata)
   */
  subsocial: any;
}

/**
 * Represents the parameters checking the validity of a signed message from an EVM wallet address.
 */
export interface IValidateEvmWalletSignature {
  /**
   * The message that has been signed by the wallet.
   */
  message: string;
  /**
   * The wallet's signature for the given message
   */
  signature: string;
  /**
   * (Optional) Wallet address parameter, used to check if address obtained from signature matches the parameter address
   */
  walletAddress?: string;
  /**
   * The timestamp when the message was generated, for added security (optional).
   */
  timestamp?: number;
  /**
   * For how many minutes the wallet signature is valid.
   */
  signatureValidityMinutes?: number;
}

/**
 * Represents the result of checking the validity of a signed message.
 */
export interface VerifySignedMessageResult {
  /**
   * Indicates whether the message signature is valid.
   */
  isValid: boolean;
  /**
   * The wallet address associated with the signature.
   */
  address: string;
}
