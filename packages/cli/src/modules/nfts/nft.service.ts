import { Nfts } from '@apillon/sdk';
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

  const data = await nftService.listNftCollections(options);
  console.log(data);
}

export async function getCollection(uuid: string, optsWithGlobals) {
  const nftService = initNftService(optsWithGlobals);

  const data = await nftService.getCollection(uuid);
  console.log(data);
}

export async function createCollection(
  filePath: string,
  optsWithGlobals: Globals,
) {
  const createCollectionData = readAndParseJson(filePath);
  if (!createCollectionData) {
    return;
  }

  const nftService = initNftService(optsWithGlobals);

  const data = await nftService.createCollection(createCollectionData);
  console.log(data);
}

export async function mintCollectionNft(
  uuid: string,
  options: Params,
  optsWithGlobals: Globals,
) {
  const nftService = initNftService(optsWithGlobals);

  const data = await nftService.mintCollectionNft(uuid, {
    receivingAddress: options.address,
    quantity: options.quantity,
  });
  console.log(data);
}

export async function burnCollectionNft(
  uuid: string,
  options: Params,
  optsWithGlobals: Globals,
) {
  const nftService = initNftService(optsWithGlobals);

  const data = await nftService.burnCollectionNft(uuid, options);
  console.log(data);
}

export async function transferCollectionOwnership(
  uuid: string,
  options: Params,
  optsWithGlobals: Globals,
) {
  const nftService = initNftService(optsWithGlobals);

  const data = await nftService.transferCollectionOwnership(uuid, options);
  console.log(data);
}

// TRANSACTIONS
export async function listCollectionTransactions(
  uuid: string,
  options: Params,
  optsWithGlobals: Globals,
) {
  const nftService = initNftService(optsWithGlobals);

  const data = await nftService.listCollectionTransactions(uuid, options);
  console.log(data);
}
