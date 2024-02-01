import { ICreateCollection, Nft, toInteger } from '@apillon/sdk';
import { readAndParseJson } from '../../lib/files';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';
import { withErrorHandler } from '../../lib/utils';

export async function listCollections(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new Nft(optsWithGlobals).listCollections({
      ...paginate(optsWithGlobals),
      collectionStatus: toInteger(optsWithGlobals.status),
    });
    console.log(data.items.map((d) => d.serialize()));
  });
}

export async function getCollection(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new Nft(optsWithGlobals)
      .collection(optsWithGlobals.uuid)
      .get();
    console.log(data.serialize());
  });
}

export async function createCollection(
  filePath: string,
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async () => {
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

    const data = await new Nft(optsWithGlobals).create(createCollectionData);
    console.log(data.serialize());
    console.log('NFT collection created successfully!');
  });
}

export async function mintCollectionNft(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new Nft(optsWithGlobals)
      .collection(optsWithGlobals.uuid)
      .mint({
        receivingAddress: optsWithGlobals.address,
        quantity: toInteger(optsWithGlobals.quantity),
      });
    if (data.success) {
      console.log('NFT minted successfully');
    }
  });
}

export async function nestMintCollectionNft(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new Nft(optsWithGlobals)
      .collection(optsWithGlobals.uuid)
      .nestMint(
        optsWithGlobals.parentCollection,
        toInteger(optsWithGlobals.parentNft),
        toInteger(optsWithGlobals.quantity),
      );
    if (data.success) {
      console.log('NFT nest minted successfully');
    }
  });
}

export async function burnCollectionNft(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new Nft(optsWithGlobals)
      .collection(optsWithGlobals.uuid)
      .burn(optsWithGlobals.tokenId);
    if (data.success) {
      console.log('NFT burned successfully');
    }
  });
}

export async function transferCollectionOwnership(
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async () => {
    await new Nft(optsWithGlobals)
      .collection(optsWithGlobals.uuid)
      .transferOwnership(optsWithGlobals.address);
    console.log('NFT ownership transferred successfully');
  });
}

export async function listCollectionTransactions(
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async () => {
    const data = await new Nft(optsWithGlobals)
      .collection(optsWithGlobals.uuid)
      .listTransactions({
        ...paginate(optsWithGlobals),
        transactionStatus: toInteger(optsWithGlobals.status),
        transactionType: toInteger(optsWithGlobals.type),
      });
    console.log(data);
  });
}
