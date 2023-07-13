import { EvmChain } from '../constants/nfts';

export interface ICreateCollection {
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

export interface ITransferCollectionOwnership {
  address: string;
}

export interface IMintCollectionNft {
  receivingAddress: string;
  quantity: number;
}

export interface IBurnCollectionNft {
  tokenId: number;
}

//OUTPUTS
export interface ICollection {
  projectUuid: string;
  collectionUuid: string;
  chain: number;
  name: string;
  symbol: string;
  description: string;
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

export interface ITransaction {
  id: number;
  status: number;
  chainId: number;
  transactionType: number;
  transactionStatus: number;
  transactionHash: string;
  updatedTime: string;
}
