import { ChainRpcUrl, IApillonPagination } from './apillon';

export enum ComputingContractType {
  SCHRODINGER = 1,
}

export enum ComputingContractStatus {
  CREATED = 0,
  DEPLOY_INITIATED = 1,
  DEPLOYING = 2, //INSTANTIATING
  DEPLOYED = 3, //INSTANTIATED
  TRANSFERRING = 4,
  TRANSFERRED = 5,
  FAILED = 6,
}

export enum ComputingTransactionType {
  DEPLOY_CONTRACT = 1,
  TRANSFER_CONTRACT_OWNERSHIP = 2,
  DEPOSIT_TO_CONTRACT_CLUSTER = 3,
  ASSIGN_CID_TO_NFT = 4,
}

export enum ComputingTransactionStatus {
  PENDING = 1,
  CONFIRMED = 2,
  FAILED = 3,
  ERROR = 4,
  WORKER_SUCCESS = 5,
  WORKER_FAILED = 6,
}

export interface SchrodingerContractData {
  /**
   * Contract address of NFT which will be used to authenticate decryption
   */
  nftContractAddress: string;
  /**
   * RPC URL of the chain the NFT collection exists on
   */
  nftChainRpcUrl: ChainRpcUrl | string;
  /**
   * If true, only the owner is able to use the contract for data encryption/decryption
   * @default true
   */
  restrictToOwner?: boolean;
}

export interface ComputingContractData extends SchrodingerContractData {
  /**
   * The IPFS gateway where the encrypted files are stored on
   */
  ipfsGatewayUrl: string;
  /**
   * Identifier of the Phala computing cluster the contract runs on
   */
  clusterId: string;
}

export interface IContractListFilters extends IApillonPagination {
  contractStatus?: ComputingContractStatus;
}

export interface ICreateComputingContract {
  name: string;
  description?: string;
  /**
   * Bucket where the encrypted files will be stored via IPFS
   * @optional If this parameter is not passed, a new bucket will be created for the contract
   */
  bucket_uuid?: string;
  contractData: SchrodingerContractData;
}

export interface IComputingTransaction {
  walletAddress: string;
  transactionType: ComputingTransactionType;
  transactionStatus: ComputingContractStatus;
  transactionStatusMessage: string;
  transactionHash: string;
  updateTime: string;
  createTime: string;
}

export interface ITransactionListFilters extends IApillonPagination {
  transactionStatus?: ComputingTransactionStatus;
  transactionType?: ComputingTransactionType;
}

export interface IEncryptData {
  /**
   * fileName for the encrypted file that will be stored in the bucket
   */
  fileName: string;
  /**
   * Contents of the file to encrypt. If the file is an image, the format needs to be base64.
   */
  content: Buffer;
  /**
   * Token ID of the NFT which will be used to decrypt the file's content
   *
   * The NFT should be a part of the contract's `data.nftContractAddress` field.
   */
  nftId: number;
}
