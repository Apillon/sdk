import {
  CollectionInput,
  exceptionHandler,
  Nfts,
  toBoolean,
  toInteger,
} from '@apillon/sdk';
import { readAndParseJson } from '../common/files';

function initNftService(options: Globals) {
  return new Nfts({
    key: options.key,
    secret: options.secret,
    apiUrl: options?.apiUrl || undefined,
  });
}

// COLLECTIONS
export async function listCollections(
  options: Params,
  optsWithGlobals: Globals,
) {
  const nftService = initNftService(optsWithGlobals);

  try {
    const data = await nftService.listNftCollections({
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
  const nftService = initNftService(optsWithGlobals);

  try {
    const data = await nftService.getCollection(uuid);
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function createCollection(
  filePath: string,
  optsWithGlobals: Globals,
) {
  const createCollectionData = readAndParseJson(filePath) as CollectionInput;
  if (!createCollectionData) {
    return;
  }

  const nftService = initNftService(optsWithGlobals);

  try {
    const data = await nftService.createCollection(createCollectionData);
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function mintCollectionNft(
  uuid: string,
  options: Params,
  optsWithGlobals: Globals,
) {
  const nftService = initNftService(optsWithGlobals);

  try {
    const data = await nftService.mintCollectionNft(uuid, {
      receivingAddress: options.address,
      quantity: toInteger(options.quantity),
    });
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function burnCollectionNft(
  uuid: string,
  options: Params,
  optsWithGlobals: Globals,
) {
  const nftService = initNftService(optsWithGlobals);

  try {
    const data = await nftService.burnCollectionNft(uuid, {
      tokenId: toInteger(options.tokenId),
    });
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function transferCollectionOwnership(
  uuid: string,
  options: Params,
  optsWithGlobals: Globals,
) {
  const nftService = initNftService(optsWithGlobals);

  try {
    const data = await nftService.transferCollectionOwnership(uuid, {
      address: options.address,
    });
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}

// TRANSACTIONS
export async function listCollectionTransactions(
  uuid: string,
  options: Params,
  optsWithGlobals: Globals,
) {
  const nftService = initNftService(optsWithGlobals);

  try {
    const data = await nftService.listCollectionTransactions(uuid, {
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
