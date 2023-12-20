import {
  exceptionHandler,
  ICreateCollection,
  Nft,
  toInteger,
} from '@apillon/sdk';
import { readAndParseJson } from '../../lib/files';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';

export async function listCollections(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (nftService: Nft) => {
    const data = await nftService.listCollections({
      ...paginate(optsWithGlobals),
      collectionStatus: toInteger(optsWithGlobals.status),
    });
    console.log(data.items.map((d) => d.serialize()));
  }, optsWithGlobals);
}

export async function getCollection(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (nftService: Nft) => {
    const data = await nftService.collection(optsWithGlobals.uuid).get();
    console.log(data.serialize());
  }, optsWithGlobals);
}

export async function createCollection(
  filePath: string,
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async (nftService: Nft) => {
    let createCollectionData;
    try {
      createCollectionData = readAndParseJson(filePath) as ICreateCollection;
    } catch (e) {
      if (e.code === 'ENOENT') {
        return console.error(`Error: File not found (${filePath}).`);
      } else if (
        e.name === 'SyntaxError' &&
        e.message.includes('Unexpected end of JSON input')
      ) {
        return console.error(`Error: Failed to parse JSON file (${filePath}).`);
      } else {
        return console.error(e);
      }
    }
    if (!createCollectionData) {
      return;
    }

    const data = await nftService.create(createCollectionData);
    console.log(data.serialize());
    console.log('NFT collection created successfully!');
  }, optsWithGlobals);
}

export async function mintCollectionNft(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (nftService: Nft) => {
    const data = await nftService
      .collection(optsWithGlobals.uuid)
      .mint(optsWithGlobals.address, toInteger(optsWithGlobals.quantity));
    if (data.success) {
      console.log('NFT minted successfully');
    }
  }, optsWithGlobals);
}

export async function nestMintCollectionNft(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (nftService: Nft) => {
    const data = await nftService
      .collection(optsWithGlobals.uuid)
      .nestMint(
        optsWithGlobals.parentCollection,
        toInteger(optsWithGlobals.parentNft),
        toInteger(optsWithGlobals.quantity),
      );
    if (data.success) {
      console.log('NFT nest minted successfully');
    }
  }, optsWithGlobals);
}

export async function burnCollectionNft(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (nftService: Nft) => {
    const data = await nftService
      .collection(optsWithGlobals.uuid)
      .burn(optsWithGlobals.tokenId);
    if (data.success) {
      console.log('NFT burned successfully');
    }
  }, optsWithGlobals);
}

export async function transferCollectionOwnership(
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async (nftService: Nft) => {
    await nftService
      .collection(optsWithGlobals.uuid)
      .transferOwnership(optsWithGlobals.address);
    console.log('NFT ownership transferred successfully');
  }, optsWithGlobals);
}

export async function listCollectionTransactions(
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async (nftService: Nft) => {
    const data = await nftService
      .collection(optsWithGlobals.uuid)
      .listTransactions({
        ...paginate(optsWithGlobals),
        transactionStatus: toInteger(optsWithGlobals.status),
        transactionType: toInteger(optsWithGlobals.type),
      });
    console.log(data);
  }, optsWithGlobals);
}

async function withErrorHandler(
  handler: (module: Nft) => Promise<any>,
  optsWithGlobals: GlobalOptions,
) {
  try {
    const module = new Nft(optsWithGlobals);
    await handler(module);
  } catch (err) {
    exceptionHandler(err);
  }
}
