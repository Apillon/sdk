import {
  exceptionHandler,
  ICreateCollection,
  Nft,
  toBoolean,
  toInteger,
} from '@apillon/sdk';
import { readAndParseJson } from '../../lib/files';
import { GlobalOptions, Options } from '../../lib/types';

// COLLECTIONS
export async function listCollections(
  options: Options,
  optsWithGlobals: GlobalOptions,
) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService.listCollections({
      collectionStatus: toInteger(options.status),
      page: toInteger(options.page),
      limit: toInteger(options.limit),
      orderBy: options.orderBy,
      desc: toBoolean(options.desc),
    });
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function getCollection(uuid: string, optsWithGlobals) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService.collection(uuid).get();
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function createCollection(
  filePath: string,
  optsWithGlobals: GlobalOptions,
) {
  let createCollectionData;
  try {
    createCollectionData = readAndParseJson(filePath) as ICreateCollection;
  } catch (e) {
    if (e.code === 'ENOENT') {
      console.error(`Error: File not found (${filePath}).`);
      return;
    } else if (
      e.name === 'SyntaxError' &&
      e.message.includes('Unexpected end of JSON input')
    ) {
      console.error(`Error: Failed to parse JSON file (${filePath}).`);
      return;
    } else {
      console.error(e);
      return;
    }
  }
  if (!createCollectionData) {
    return;
  }

  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService.create(createCollectionData);
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function mintCollectionNft(
  uuid: string,
  options: Options,
  optsWithGlobals: GlobalOptions,
) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService
      .collection(uuid)
      .mint(options.address, toInteger(options.quantity));
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function nestMintCollectionNft(
  uuid: string,
  options: Options,
  optsWithGlobals: GlobalOptions,
) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService
      .collection(uuid)
      .nestMint(
        options.parentCollectionUuid,
        toInteger(options.parentNftId),
        toInteger(options.quantity),
      );
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function burnCollectionNft(
  uuid: string,
  options: Options,
  optsWithGlobals: GlobalOptions,
) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService.collection(uuid).burn(options.tokenId);
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function transferCollectionOwnership(
  uuid: string,
  options: Options,
  optsWithGlobals: GlobalOptions,
) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService
      .collection(uuid)
      .transferOwnership(options.address);
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

// TRANSACTIONS
export async function listCollectionTransactions(
  uuid: string,
  options: Options,
  optsWithGlobals: GlobalOptions,
) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService.collection(uuid).listTransactions({
      transactionStatus: toInteger(options.status),
      transactionType: toInteger(options.type),
      page: toInteger(options.page),
      limit: toInteger(options.limit),
      orderBy: options.orderBy,
      desc: toBoolean(options.desc),
    });
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}
