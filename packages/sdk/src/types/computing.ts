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

export type ComputingContractData = {
  nftContractAddress: string;
  nftChainRpcUrl: string;
  restrictToOwner: string;
  ipfsGatewayUrl: string;
  clusterId: string;
};

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
   * @default false
   */
  restrictToOwner?: boolean;
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

export interface IEncryptData {
  /**
   * fileName for the encrypted file that will be stored in the bucket
   */
  fileName: string;
  /**
   * Contents of the file to encrypt
   */
  content: Buffer;
  /**
   * Token ID of the NFT which will be used to decrypt the file's content
   *
   * The NFT should be a part of the contract's `data.nftContractAddress` field.
   */
  nftId: number;
}
