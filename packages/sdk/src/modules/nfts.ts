import { ApillonModule } from './apillon';
import { constructUrlWithQueryParams } from '../lib/common';
import {
  IBurnCollectionNft,
  ICollection,
  ICollectionFilters,
  ICreateCollection,
  IMintCollectionNft,
  INestMintCollectionNft,
  ITransaction,
  ITransactionFilters,
  ITransferCollectionOwnership,
} from '../types/nfts';
import {
  IApillonList,
  IApillonResponse,
  IApillonStatus,
} from '../types/apillon';

const COLLECTIONS_ROUTE = '/nfts/collections';

export class Nfts extends ApillonModule {
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
