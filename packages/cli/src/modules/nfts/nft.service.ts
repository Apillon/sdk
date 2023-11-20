import {
  exceptionHandler,
  ICreateCollection,
  Nft,
  toInteger,
} from '@apillon/sdk';
import { readAndParseJson } from '../../lib/files';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';

// COLLECTIONS
export async function listCollections(optsWithGlobals: GlobalOptions) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService.listCollections({
      ...paginate(optsWithGlobals),
      collectionStatus: toInteger(optsWithGlobals.status),
    });
    console.log(data.map((d) => d.serialize()));
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function getCollection(optsWithGlobals: GlobalOptions) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService.collection(optsWithGlobals.uuid).get();
    console.log(data.serialize());
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

  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService.create(createCollectionData);
    console.log(data.serialize());
    console.log('NFT collection created successfully!');
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function mintCollectionNft(optsWithGlobals: GlobalOptions) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService
      .collection(optsWithGlobals.uuid)
      .mint(optsWithGlobals.address, toInteger(optsWithGlobals.quantity));
    if (data.success) {
      console.log('NFT minted successfully');
    }
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function nestMintCollectionNft(optsWithGlobals: GlobalOptions) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService
      .collection(optsWithGlobals.uuid)
      .nestMint(
        optsWithGlobals.parentCollectionUuid,
        toInteger(optsWithGlobals.parentNftId),
        toInteger(optsWithGlobals.quantity),
      );
    if (data.status === 5) {
      console.log('NFT nest minted successfully');
    }
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function burnCollectionNft(optsWithGlobals: GlobalOptions) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService
      .collection(optsWithGlobals.uuid)
      .burn(optsWithGlobals.tokenId);
    if (data.status === 5) {
      console.log('NFT burned successfully');
    }
  } catch (e: any) {
    exceptionHandler(e);
  }
}

export async function transferCollectionOwnership(
  optsWithGlobals: GlobalOptions,
) {
  const nftService = new Nft(optsWithGlobals);

  try {
    await nftService
      .collection(optsWithGlobals.uuid)
      .transferOwnership(optsWithGlobals.address);
    console.log('NFT ownership transfered successfully');
  } catch (e: any) {
    exceptionHandler(e);
  }
}

// TRANSACTIONS
export async function listCollectionTransactions(
  optsWithGlobals: GlobalOptions,
) {
  const nftService = new Nft(optsWithGlobals);

  try {
    const data = await nftService
      .collection(optsWithGlobals.uuid)
      .listTransactions({
        ...paginate(optsWithGlobals),
        transactionStatus: toInteger(optsWithGlobals.status),
        transactionType: toInteger(optsWithGlobals.type),
      });
    console.log(data);
  } catch (e: any) {
    exceptionHandler(e);
  }
}
