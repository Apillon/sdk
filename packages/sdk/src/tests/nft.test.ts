import { ApillonConfig } from '../lib/apillon';
import { Nft } from '../modules/nft/nft';
import { getCollectionUUID, getConfig } from './helpers/helper';

describe.skip('Nft tests', () => {
  let config: ApillonConfig;
  let collectionUUID: string;

  beforeAll(async () => {
    config = getConfig();
    collectionUUID = getCollectionUUID();
  });

  test('list nft collections', async () => {
    const nft = new Nft(config);
    try {
      const collection = await nft.list();
      console.log(collection);
    } catch (e) {
      console.log(e);
    }
  });

  test('get nft collection details', async () => {
    const nft = new Nft(config);
    try {
      const collection = await nft
        .collection(collectionUUID)
        .listTransactions();
      console.log(collection);
    } catch (e) {
      console.log(e);
    }
  });

  test.only('get nft collection details', async () => {
    const nft = new Nft(config);
    try {
      const collection = await nft.collection(collectionUUID).get();
      console.log(collection);
    } catch (e) {
      console.log(e);
    }
  });
});
