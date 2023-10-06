import { IApillonPagination } from './generic';

export enum EvmChain {
  MOONBEAM = 1284,
  MOONBASE = 1287,
  ASTAR_SHIBUYA = 81,
  ASTAR = 592,
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

export interface ICreateCollection {
  collectionType: CollectionType;
  chain: EvmChain;
  name: string;
  symbol: string;
  description?: string;
  baseUri: string;
  baseExtension: string;
  maxSupply: number;
  isRevokable: boolean;
  isSoulbound: boolean;
  royaltiesAddress: string;
  royaltiesFees: number;
  drop: boolean;
  dropStart: number;
  dropPrice: number;
  dropReserve: number;
}

export interface INestMintCollectionNft {
  parentCollectionUuid: string;
  parentNftId: number;
  quantity: number;
}

//OUTPUTS
export interface ICollection {
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
  baseUri: string;
  baseExtension: string;
  maxSupply: number;
  isRevokable: boolean;
  isSoulbound: boolean;
  royaltiesAddress: string;
  royaltiesFees: number;
  drop: boolean;
  dropStart: number;
  dropPrice: number;
  dropReserve: number;
  updateTime: string;
  createTime: string;
}

export interface ITransaction {
  chainId: number;
  transactionType: number;
  transactionStatus: number;
  transactionHash: string;
  updateTime: string;
  createTime: string;
}

export interface ICollectionFilters extends IApillonPagination {
  collectionStatus: CollectionStatus;
}

export interface ITransactionFilters extends IApillonPagination {
  transactionStatus: TransactionStatus;
  transactionType: TransactionType;
}
