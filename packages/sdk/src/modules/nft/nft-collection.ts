import { ApillonModel } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { ApillonLogger } from '../../lib/apillon-logger';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList } from '../../types/apillon';
import {
  CollectionStatus,
  CollectionType,
  EvmChain,
  ITransaction,
  ITransactionFilters,
  TransactionType,
} from '../../types/nfts';
import {
  IMintNftData,
  INftActionResponse,
  SubstrateChain,
  TransactionStatus,
} from './../../types/nfts';

export class NftCollection extends ApillonModel {
  /**
   * Collection symbol.
   */
  public symbol = null;

  /**
   * Collection name
   */
  public name = null;

  /**
   * collection description.
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
   * If true, NFT token IDs are always sequential.
   * If false, custom token IDs can be provided when minting.
   */
  public isAutoIncrement: boolean = null;

  /**
   * If collection owner can burn / destroy a NFT.
   */
  public isRevokable: boolean = null;

  /**
   * If this collection has drop (anyone can buy a nft directly from the smart contract) functionality enabled.
   */
  public drop: boolean = null;

  /**
   * Price per NFT if drop is active.
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
   * Percentage amount of royalties fees.
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
   * Wallet address of deployer.
   */
  public deployerAddress: string = null;

  /**
   * Chain on which the smart contract was deployed.
   */
  public chain: EvmChain | SubstrateChain = null;

  /**
   * Logo URL of the collection (on IPFS)
   */
  public logoUrl: string = null;

  /**
   * Banner URL of the collection (on IPFS)
   */
  public bannerUrl: string = null;

  /**
   * Constructor which should only be called via Nft class.
   * @param uuid Unique identifier of the NFT collection.
   * @param data Data to populate the collection with.
   */
  constructor(uuid: string, data?: Partial<NftCollection>) {
    super(uuid);
    this.API_PREFIX = `/nfts/collections/${this.uuid}`;
    this.populate(data);
  }

  /**
   * @param {IMintNftData} params - NFT mint parameters
   * @returns {INftActionResponse} - success status and transaction hash of the mint
   */
  public async mint(params: IMintNftData): Promise<INftActionResponse> {
    if (params.idsToMint?.length) {
      params.quantity = params.idsToMint.length;
    }

    const data = await ApillonApi.post<INftActionResponse>(
      `${this.API_PREFIX}/mint`,
      params,
    );

    ApillonLogger.log(
      `${params.quantity} NFTs minted successfully to ${params.receivingAddress}`,
    );

    return data;
  }

  /**
   * Mints new nfts directly to an existing nft.
   * @warn This method is only available for nestable collections.
   * @param parentCollectionUuid UUID of the collection we want to nest mint to.
   * @param parentNftId ID of the nft in the collection we want to nest mint to.
   * @param quantity Amount of nfts we want to mint.
   * @returns Call status.
   */
  public async nestMint(
    parentCollectionUuid: string,
    parentNftId: number,
    quantity: number,
  ): Promise<INftActionResponse> {
    if (
      this.collectionType != null &&
      this.collectionType != CollectionType.NESTABLE
    ) {
      throw new Error('Collection is not nestable.');
    }
    const data = await ApillonApi.post<INftActionResponse>(
      `${this.API_PREFIX}/nest-mint`,
      { parentCollectionUuid, parentNftId, quantity },
    );

    ApillonLogger.log(`NFT nest minted successfully on NFT ${parentNftId}`);
    return data;
  }

  /**
   * Burns a nft.
   * @warn Can only burn NFTs if the collection is revokable.
   * @param tokenId Token ID of the NFT we want to burn.
   * @returns Success status and transaction hash.
   */
  public async burn(tokenId: string): Promise<INftActionResponse> {
    if (this.isRevokable != null && !this.isRevokable) {
      throw new Error('Collection is not revokable.');
    }
    const data = await ApillonApi.post<INftActionResponse>(
      `${this.API_PREFIX}/burn`,
      { tokenId },
    );

    ApillonLogger.log(`NFT ${tokenId} burned successfully`);
    return data;
  }

  /**
   * Transfers ownership of this collection.
   * @warn Once ownership is transferred you cannot call mint methods anymore since you are the
   * owner and you need to the smart contracts call directly on chain.
   * @param address Address to which the ownership will be transferred.
   * @returns Collection data.
   */
  public async transferOwnership(address: string): Promise<NftCollection> {
    const data = await ApillonApi.post<NftCollection>(
      `${this.API_PREFIX}/transfer`,
      { address },
    );

    this.populate(data);

    ApillonLogger.log(`NFT collection transferred successfully to ${address}`);
    return this;
  }

  /**
   * Gets list of transactions that occurred on this collection through Apillon.
   * @param params Filters.
   * @returns {ITransaction[]} List of transactions.
   */
  public async listTransactions(
    params?: ITransactionFilters,
  ): Promise<IApillonList<ITransaction>> {
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/transactions`,
      params,
    );

    return await ApillonApi.get<IApillonList<ITransaction>>(url);
  }

  protected override serializeFilter(key: string, value: any) {
    const serialized = super.serializeFilter(key, value);
    const enums = {
      collectionType: CollectionType[serialized],
      collectionStatus: CollectionStatus[serialized],
      transactionType: TransactionType[serialized],
      transactionStatus: TransactionStatus[serialized],
      chain: EvmChain[serialized] || SubstrateChain[serialized],
      chainId: EvmChain[serialized] || SubstrateChain[serialized],
    };
    return Object.keys(enums).includes(key) ? enums[key] : serialized;
  }
}
