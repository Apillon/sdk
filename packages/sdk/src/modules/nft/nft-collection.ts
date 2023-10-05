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
  CollectionType,
  CollectionStatus,
  EvmChain,
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

  /**
   * @dev collection symbol.
   */
  public symbol = null;

  /**
   * @dev collection name
   */
  public name = null;

  /**
   * @dev collection description.
   */
  public description: string = null;

  /**
   * Collection type. Defines the smart contract used.
   */
  public collectionType: CollectionType = null;

  /**
   * Max amount of NFTs that can get minted in this collection. 0 represents unlimited.
   */
  public maxSupply: number = null;

  /**
   * Base uri from which uri for each token is calculated from:
   * Base uri + token id + base extension.
   */
  public baseUri: string = null;

  /**
   * Base extension from which uri for each token is calculated from:
   * Base uri + token id + base extension.
   */
  public baseExtension: string = null;

  /**
   * If nft is transferable.
   */
  public isSoulbound: boolean = null;

  /**
   * If collection owner can burn / destroy a NFT.
   */
  public isRevokable: boolean = null;

  /**
   * If this collection has drop (anyone can buy a nft directly from the smart contract) functionality enabled.
   */
  public drop: boolean = null;

  /**
   * Pri per NFT if drop is active.
   */
  public dropPrice: number = null;

  /**
   * UNIX timestamp of when general buying of NFTs start.
   */
  public dropStart: number = null;

  /**
   * Amount of reserved NFTs that can't be bought by general public but can get minted by the collection owner.
   */
  public dropReserve: number = null;

  /**
   * Procentual amount of royalties fees.
   */
  public royaltiesFees: number = null;

  /**
   * Address to which royalties are paid.
   */
  public royaltiesAddress: string = null;

  /**
   * Status of the collection. From not deployed etc.
   */
  public collectionStatus: CollectionStatus = null;

  /**
   * Smart contract address (available after succesfull deploy).
   */
  public contractAddress: string = null;

  /**
   * Transaction hash of contract deploy.
   */
  public transactionHash: string = null;

  /**
   * Chain on which the smart contract was deployed.
   */
  public chain: EvmChain = null;

  constructor(api: AxiosInstance, uuid: string, data: any) {
    this.api = api;
    this.uuid = uuid;
    this.API_PREFIX = `/nfts/collections/${this.uuid}`;
    this.populate(data);
  }

  /**
   * Populates class properties via data object.
   * @param data Data object.
   */
  private populate(data: any) {
    if (data != null) {
      Object.keys(data || {}).forEach((key) => {
        const prop = this[key];
        if (prop === null) {
          this[key] = data[key];
        }
      });
    }
  }

  public async get() {
    const resp = await this.api.get<IApillonResponse<ICollection>>(
      this.API_PREFIX,
    );
    this.populate(resp.data?.data);

    return this;
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
  public async listTransactions(params?: ITransactionFilters) {
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
