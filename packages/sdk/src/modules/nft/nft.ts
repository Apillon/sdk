import { ApillonModule } from '../../lib/apillon';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonResponse, IApillonList } from '../../types/apillon';
import {
  ICollectionFilters,
  ICollection,
  ICreateCollection,
} from '../../types/nfts';
import { NftCollection } from './nft-collection';

export class Nft extends ApillonModule {
  API_PREFIX = '/nfts/collections';
  /**
   * @dev Returns a collection instance.
   * @param uuid Unique collection identifier.
   * @returns An instance of NFT Collection
   */
  public collection(uuid: string): NftCollection {
    return new NftCollection(uuid, this.api);
  }

  public async list(params: ICollectionFilters) {
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const resp = await this.api.get<
      IApillonResponse<IApillonList<ICollection>>
    >(url);

    return resp.data?.data;
  }

  public async create(data: ICreateCollection) {
    const resp = await this.api.post<IApillonResponse<ICollection>>(
      this.API_PREFIX,
      data,
    );

    return resp.data?.data;
  }
}
