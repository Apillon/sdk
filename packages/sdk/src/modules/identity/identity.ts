import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { IApillonResponse } from '../../types/apillon';
import { WalletIdentityData } from '../../types/identity';

export class Identity extends ApillonModule {
  /**
   * Base API url for identity.
   */
  private API_PREFIX = '/identity';

  /**
   * Get a wallet's online profile, including data from Subsocial, Polkadot Identity and Litentry
   * @param {string} walletAddress - Wallet address to retreive data for
   * @param {string} message - The message that has been signed by the wallet
   * @param {string} signature - The wallet's signature, used for validation
   * @returns Identity data fetched from Polkadot Identity and Subsocial
   */
  public async getWalletProfile(
    walletAddress: string,
    message: string | Uint8Array,
    signature: string | Uint8Array,
  ): Promise<WalletIdentityData> {
    const { data } = await ApillonApi.post<
      IApillonResponse<WalletIdentityData>
    >(`${this.API_PREFIX}/${walletAddress}`, {
      message,
      signature,
    });

    return data;
  }
}
