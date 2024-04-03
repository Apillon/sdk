import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList } from '../../types/apillon';
import {
  ICollectionFilters,
  ICollection,
  ICreateCollection,
  ICreateSubstrateCollection,
  ICreateCollectionBase,
} from '../../types/nfts';
import { NftCollection } from './nft-collection';

export class Nft extends ApillonModule {
  /**
   * API url for collections.
   */
  private API_PREFIX = '/nfts/collections';

  /**
   * @param uuid Unique collection identifier.
   * @returns An instance of NFT Collection
   */
  public collection(uuid: string): NftCollection {
    return new NftCollection(uuid, null);
  }

  /**
   * Lists all nft collections available.
   * @param {ICollectionFilters} params Filter for listing collections.
   * @returns Array of NftCollection.
   */
  public async listCollections(
    params?: ICollectionFilters,
  ): Promise<IApillonList<NftCollection>> {
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const data = await ApillonApi.get<IApillonList<ICollection>>(url);

    return {
      ...data,
      items: data.items.map(
        (nft) => new NftCollection(nft.collectionUuid, nft),
      ),
    };
  }

  /**
   * Deploys a new EVM NftCollection smart contract.
   * @param data NFT collection data.
   * @returns A NftCollection instance.
   */
  public async create(data: ICreateCollection) {
    return await this.createNft(data, true);
  }

  /**
   * Deploys a new Substrate NftCollection smart contract.
   * @param data NFT collection data.
   * @returns A NftCollection instance.
   */
  public async createSubstrate(data: ICreateSubstrateCollection) {
    return await this.createNft(data, false);
  }

  private async createNft(data: ICreateCollectionBase, isEvm: boolean) {
    // If not drop, set drop properties to default 0
    if (!data.drop) {
      data.dropStart = data.dropPrice = data.dropReserve = 0;
    }
    const response = await ApillonApi.post<ICollection>(
      `${this.API_PREFIX}/${isEvm ? 'evm' : 'substrate'}`,
      data,
    );
    return new NftCollection(response.collectionUuid, response);
  }
}
