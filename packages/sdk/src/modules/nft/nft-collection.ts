import { AxiosInstance } from 'axios';
import { constructUrlWithQueryParams } from '../../lib/common';
import {
  IApillonResponse,
  IApillonList,
  IApillonStatus,
} from '../../types/apillon';
import {
  ICollection,
  IMintCollectionNft,
  INestMintCollectionNft,
  IBurnCollectionNft,
  ITransferCollectionOwnership,
  ITransactionFilters,
  ITransaction,
} from '../../types/nfts';

export class NftCollection {
  /**
   * Axios instance set to correct rootUrl with correct error handling.
   */
  protected api: AxiosInstance;

  /**
   * @dev Unique identifier of the collection.
   */
  private uuid;

  /**
   * @dev API url prefix for this class.
   */
  private API_PREFIX: string = null;

  constructor(uuid: string, api: AxiosInstance) {
    this.api = api;
    this.uuid = uuid;
    this.API_PREFIX = `/nfts/collections/${this.uuid}`;
  }

  public async get() {
    const resp = await this.api.get<IApillonResponse<ICollection>>(
      this.API_PREFIX,
    );

    return resp.data?.data;
  }

  public async mint(data: IMintCollectionNft) {
    const resp = await this.api.post<IApillonResponse<IApillonStatus>>(
      `${this.API_PREFIX}/mint`,
      data,
    );

    return resp.data?.data;
  }

  public async nestMintNft(data: INestMintCollectionNft) {
    const resp = await this.api.post<IApillonResponse<IApillonStatus>>(
      `${this.API_PREFIX}/nest-mint`,
      data,
    );

    return resp.data?.data;
  }

  public async burnNft(data: IBurnCollectionNft) {
    const resp = await this.api.post<IApillonResponse<IApillonStatus>>(
      `${this.API_PREFIX}/burn`,
      data,
    );

    return resp.data?.data;
  }

  public async transferOwnership(data: ITransferCollectionOwnership) {
    const resp = await this.api.post<IApillonResponse<ICollection>>(
      `${this.API_PREFIX}/transfer`,
      data,
    );

    return resp.data?.data;
  }

  // TRANSACTIONS
  public async listTransactions(uuid: string, params: ITransactionFilters) {
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/transactions`,
      params,
    );

    const resp = await this.api.get<
      IApillonResponse<IApillonList<ITransaction>>
    >(url);

    return resp.data?.data.items;
  }
}
