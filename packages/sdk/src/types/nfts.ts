import { IApillonPagination } from './apillon';

export enum EvmChain {
  MOONBEAM = 1284,
  MOONBASE = 1287,
  ASTAR = 592,
}

export enum SubstrateChain {
  ASTAR = 8,
  UNIQUE = 11,
}

export enum CollectionStatus {
  CREATED = 0,
  DEPLOY_INITIATED = 1,
  DEPLOYING = 2,
  DEPLOYED = 3,
  TRANSFERRED = 4,
  FAILED = 5,
}

export enum CollectionType {
  GENERIC = 1,
  NESTABLE = 2,
}

export enum TransactionStatus {
  PENDING = 1,
  CONFIRMED = 2,
  FAILED = 3,
  ERROR = 4,
}

export enum TransactionType {
  DEPLOY_CONTRACT = 1,
  TRANSFER_CONTRACT_OWNERSHIP = 2,
  MINT_NFT = 3,
  SET_COLLECTION_BASE_URI = 4,
  BURN_NFT = 5,
  NEST_MINT_NFT = 6,
}

export interface ICreateCollectionBase {
  collectionType: CollectionType;
  name: string;
  symbol: string;
  description?: string;
  baseUri: string;
  baseExtension: string;
  maxSupply?: number;
  royaltiesAddress?: string;
  royaltiesFees: number;
  drop: boolean;
  dropStart?: number;
  dropPrice?: number;
  dropReserve?: number;
}

export interface ICreateCollection extends ICreateCollectionBase {
  /**
   * Indicates if the collection is revokable (burnable).
   */
  isRevokable: boolean;
  /**
   * Indicates if the collection is soulbound.
   */
  isSoulbound: boolean;
  /**
   * If enabled, newly minted NFTs will have token IDs in sequential order.
   */
  isAutoIncrement?: boolean;
  /**
   * The EVM chain on which the collection will be deployed.
   */
  chain: EvmChain;
}

export interface ICreateSubstrateCollection extends ICreateCollectionBase {
  chain: SubstrateChain;
}

export interface IMetadataAttributes {
  /**
   * Trait value.
   */
  value: string;
  /**
   * Name of the trait.
   */
  trait_type: string;
  /**
   * Type for displaying trait (number, date,...).
   */
  display_type: string;
}

export interface IMetadata {
  /**
   * NFT name.
   */
  name: string;
  /**
   * NFT description.
   */
  description: string;
  /**
   * NFT image URL.
   */
  image: string;
  /**
   * Array of NFT attributes.
   */
  attributes: IMetadataAttributes[];
}

export interface ICreateUniqueCollection extends ICreateCollectionBase {
  /**
   * Maximum supply of the collection.
   */
  maxSupply: number;
  /**
   * For revokable collection owner can destroy (burn) NFTs at any time.
   */
  isRevokable: boolean;
  /**
   * Soulbound tokens are NFTs that are bound to wallet and not transferable. (default: false)
   */
  isSoulbound: boolean;
  /**
   * Object containing metadata for different token ids.
   */
  metadata: { [tokenId: string]: IMetadata };
}

export interface ITransaction {
  chainId: number;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  transactionHash: string;
  updateTime: string;
  createTime: string;
}

export interface ICollectionFilters extends IApillonPagination {
  collectionStatus?: CollectionStatus;
}

export interface INftActionResponse {
  success: boolean;
  transactionHash: string;
}

export interface ITransactionFilters extends IApillonPagination {
  transactionStatus?: TransactionStatus;
  transactionType?: TransactionType;
}

export interface IMintNftData {
  /**
   * Address to receive the minted NFT
   */
  receivingAddress: string;
  /**
   * How many NFTs to mint to the receiver
   */
  quantity?: number;
  /**
   * If collection is set as isAutoIncrement=false,
   * use this parameter to define the custom minted NFT token IDS
   */
  idsToMint?: number[];
}
