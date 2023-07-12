import { EvmChain } from '../constants/nfts';

export class CollectionInput {
  constructor(
    chain: EvmChain,
    name: string,
    symbol: string,
    baseUri: string,
    baseExtension: string,
    maxSupply: number,
    isRevokable: boolean,
    isSoulbound: boolean,
    royaltiesAddress: string,
    royaltiesFees: number,
    drop: boolean,
    dropStart: number,
    dropPrice: number,
    dropReserve: number,
    description?: string,
  ) {
    this.chain = chain;
    this.symbol = symbol;
    this.name = name;
    this.description = description;
    this.baseUri = baseUri;
    this.baseExtension = baseExtension;
    this.maxSupply = maxSupply;
    this.isRevokable = isRevokable;
    this.isSoulbound = isSoulbound;
    this.royaltiesAddress = royaltiesAddress;
    this.royaltiesFees = royaltiesFees;
    this.drop = drop;
    this.dropStart = dropStart;
    this.dropPrice = dropPrice;
    this.dropReserve = dropReserve;
  }

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

export class TransferCollectionOwnership {
  constructor(address: string) {
    this.address = address;
  }

  address: string;
}

export class MintCollectionNft {
  constructor(receivingAddress: string, quantity: number) {
    this.receivingAddress = receivingAddress;
    this.quantity = quantity;
  }

  receivingAddress: string;
  quantity: number;
}

export class BurnCollectionNft {
  constructor(tokenId: number) {
    this.tokenId = tokenId;
  }

  tokenId: number;
}
