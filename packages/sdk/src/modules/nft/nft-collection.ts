import { INftActionResponse, TransactionStatus } from './../../types/nfts';
import { ApillonApi } from '../../lib/apillon-api';
import { ApillonLogger } from '../../lib/apillon-logger';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList } from '../../types/apillon';
import {
  ICollection,
  ITransactionFilters,
  ITransaction,
  CollectionType,
  CollectionStatus,
  EvmChain,
  TransactionType,
} from '../../types/nfts';
import { ApillonModel } from '../../lib/apillon';

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
  public chain: EvmChain = null;

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
   * Gets and populates collection information.
   * @returns Collection instance.
   */
  public async get(): Promise<NftCollection> {
    const data = await ApillonApi.get<ICollection>(this.API_PREFIX);
    return this.populate(data);
  }

  /**
   * Mints new nfts to a receiver.
   * @param receiver Address of the receiver.
   * @param quantity Amount of nfts to mint.
   * @param idsToMint Custom token IDs for minted NFTs. Only when collection.isAutoIncrement=false.
   * @returns Call status.
   */
  public async mint(receiver: string, quantity: number, idsToMint?: number[]) {
    const data = await ApillonApi.post<INftActionResponse>(
      `${this.API_PREFIX}/mint`,
      { receivingAddress: receiver, quantity, idsToMint },
    );

    ApillonLogger.log(`NFT minted successfully to ${receiver}`);

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
   * @returns Status.
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
    const data = await ApillonApi.post<ICollection>(
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
   * @returns List of transactions.
   */
  public async listTransactions(
    params?: ITransactionFilters,
  ): Promise<IApillonList<ITransaction>> {
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/transactions`,
      params,
    );

    const data = await ApillonApi.get<IApillonList<ITransaction>>(url);

    return {
      ...data,
      items: data.items.map((t) =>
        JSON.parse(JSON.stringify(t, this.serializeFilter)),
      ),
    };
  }

  protected override serializeFilter(key: string, value: any) {
    const serialized = super.serializeFilter(key, value);
    const enums = {
      collectionType: CollectionType[serialized],
      collectionStatus: CollectionStatus[serialized],
      transactionType: TransactionType[serialized],
      transactionStatus: TransactionStatus[serialized],
      chain: EvmChain[serialized],
      chainId: EvmChain[serialized],
    };
    return Object.keys(enums).includes(key) ? enums[key] : serialized;
  }
}
