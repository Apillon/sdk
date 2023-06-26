import { ApillonModule } from './apillon';
import { constructUrlWithQueryParams } from '../lib/common';

const COLLECTIONS_ROUTE = '/nfts/collections';

export class Nfts extends ApillonModule {
  // COLLECTIONS
  public async listNftCollections(params: ApillonPaginationInput) {
    const url = constructUrlWithQueryParams(COLLECTIONS_ROUTE, params);

    const resp = await this.api.get<ApillonResponse<ApillonList<Collection>>>(
      url,
    );

    return resp.data.data;
  }

  public async getCollection(uuid: string) {
    const resp = await this.api.get<ApillonResponse<Collection>>(
      `${COLLECTIONS_ROUTE}/${uuid}`,
    );

    return resp.data.data;
  }

  public async createCollection(data: CollectionInput) {
    const resp = await this.api.post<ApillonResponse<Collection>>(
      COLLECTIONS_ROUTE,
      data,
    );

    return resp.data.data;
  }

  public async mintCollectionNft(uuid: string, data: MintCollectionNftInput) {
    const resp = await this.api.post<ApillonResponse<ApillonStatus>>(
      `${COLLECTIONS_ROUTE}/${uuid}/mint`,
      data,
    );

    return resp.data.data;
  }

  public async burnCollectionNft(uuid: string, data: BurnCollectionNftInput) {
    const resp = await this.api.post<ApillonResponse<ApillonStatus>>(
      `${COLLECTIONS_ROUTE}/${uuid}/burn`,
      data,
    );

    return resp.data.data;
  }

  public async transferCollectionOwnership(
    uuid: string,
    data: TransferCollectionOwnershipInput,
  ) {
    const resp = await this.api.post<ApillonResponse<Collection>>(
      `${COLLECTIONS_ROUTE}/${uuid}/transfer`,
      data,
    );

    return resp.data.data;
  }

  // TRANSACTIONS
  public async listCollectionTransactions(
    uuid: string,
    params: ApillonPaginationInput,
  ) {
    const url = constructUrlWithQueryParams(
      `${COLLECTIONS_ROUTE}/${uuid}/transactions`,
      params,
    );

    const resp = await this.api.get<ApillonResponse<ApillonList<Transaction>>>(
      url,
    );

    return resp.data.data.items;
  }
}
