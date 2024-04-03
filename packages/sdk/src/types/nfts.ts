import { IApillonPagination } from './apillon';

export enum EvmChain {
  MOONBEAM = 1284,
  MOONBASE = 1287,
  ASTAR = 592,
}

export enum SubstrateChain {
  ASTAR = 8,
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
  royaltiesAddress: string;
  royaltiesFees: number;
  drop: boolean;
  dropStart?: number;
  dropPrice?: number;
  dropReserve?: number;
}

export interface ICreateCollection extends ICreateCollectionBase {
  isRevokable: boolean;
  isSoulbound: boolean;
  isAutoIncrement?: boolean;
  chain: EvmChain;
}

export interface ICreateSubstrateCollection extends ICreateCollectionBase {
  chain: SubstrateChain;
}

//OUTPUTS
export interface ICollection extends ICreateCollection {
  collectionUuid: string;
  contractAddress: string;
  deployerAddress: string;
  transactionHash: string;
  collectionStatus: number;
  collectionType: number;
  chain: number;
  name: string;
  symbol: string;
  description: string;
  bucketUuid: string;
  updateTime: string;
  createTime: string;
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
