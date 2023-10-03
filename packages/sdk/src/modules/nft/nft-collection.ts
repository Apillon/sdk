import { AxiosInstance } from 'axios';
import { constructUrlWithQueryParams } from '../../lib/common';
import {
  IApillonResponse,
  IApillonList,
  IApillonStatus,
} from '../../types/apillon';
import {
  ICollectionFilters,
  ICollection,
  ICreateCollection,
  IMintCollectionNft,
  INestMintCollectionNft,
  IBurnCollectionNft,
  ITransferCollectionOwnership,
  ITransactionFilters,
  ITransaction,
} from '../../types/nfts';

const COLLECTIONS_ROUTE = '/nfts/collections';

export class NftCollection {
  protected api: AxiosInstance;
  private uuid;

  constructor(uuid: string, api: AxiosInstance) {
    this.api = api;
    this.uuid = uuid;
  }
  // COLLECTIONS
  public async listNftCollections(params: ICollectionFilters) {
    const url = constructUrlWithQueryParams(COLLECTIONS_ROUTE, params);

    const resp = await this.api.get<
      IApillonResponse<IApillonList<ICollection>>
    >(url);

    return resp.data.data;
  }

  public async getCollection(uuid: string) {
    const resp = await this.api.get<IApillonResponse<ICollection>>(
      `${COLLECTIONS_ROUTE}/${uuid}`,
    );

    return resp.data.data;
  }

  public async createCollection(data: ICreateCollection) {
    const resp = await this.api.post<IApillonResponse<ICollection>>(
      COLLECTIONS_ROUTE,
      data,
    );

    return resp.data.data;
  }

  public async mintCollectionNft(uuid: string, data: IMintCollectionNft) {
    const resp = await this.api.post<IApillonResponse<IApillonStatus>>(
      `${COLLECTIONS_ROUTE}/${uuid}/mint`,
      data,
    );

    return resp.data.data;
  }

  public async nestMintCollectionNft(
    uuid: string,
    data: INestMintCollectionNft,
  ) {
    const resp = await this.api.post<IApillonResponse<IApillonStatus>>(
      `${COLLECTIONS_ROUTE}/${uuid}/nest-mint`,
      data,
    );

    return resp.data.data;
  }

  public async burnCollectionNft(uuid: string, data: IBurnCollectionNft) {
    const resp = await this.api.post<IApillonResponse<IApillonStatus>>(
      `${COLLECTIONS_ROUTE}/${uuid}/burn`,
      data,
    );

    return resp.data.data;
  }

  public async transferCollectionOwnership(
    uuid: string,
    data: ITransferCollectionOwnership,
  ) {
    const resp = await this.api.post<IApillonResponse<ICollection>>(
      `${COLLECTIONS_ROUTE}/${uuid}/transfer`,
      data,
    );

    return resp.data.data;
  }

  // TRANSACTIONS
  public async listCollectionTransactions(
    uuid: string,
    params: ITransactionFilters,
  ) {
    const url = constructUrlWithQueryParams(
      `${COLLECTIONS_ROUTE}/${uuid}/transactions`,
      params,
    );

    const resp = await this.api.get<
      IApillonResponse<IApillonList<ITransaction>>
    >(url);

    return resp.data.data.items;
  }
}
