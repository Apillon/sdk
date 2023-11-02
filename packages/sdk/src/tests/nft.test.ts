import { CollectionType, EvmChain, NftCollection } from '../docs-index';
import { ApillonConfig } from '../lib/apillon';
import { Nft } from '../modules/nft/nft';
import { getCollectionUUID, getConfig, getMintAddress } from './helpers/helper';

describe('Nft tests', () => {
  let config: ApillonConfig;
  let collectionUUID: string;
  let receiverAddress: string;

  beforeAll(async () => {
    config = getConfig();
    collectionUUID = getCollectionUUID();
    receiverAddress = getMintAddress();
  });

  test('list nft collections', async () => {
    const nft = new Nft(config);
    const collections = await nft.listCollections();
    expect(collections.length).toBeGreaterThan(0);
    expect(collections[0]).toBeInstanceOf(NftCollection);
  });

  test.skip('creates a new collection', async () => {
    const nft = new Nft(config);
    const collection = await nft.create({
      chain: EvmChain.MOONBASE,
      collectionType: CollectionType.GENERIC,
      name: 'created from sdk tests',
      symbol: 'cfst',
      royaltiesFees: 0,
      royaltiesAddress: '0x0000000000000000000000000000000000000000',
      baseUri: 'https://test.com/metadata/',
      baseExtension: '.json',
      maxSupply: 5,
      isRevokable: true,
      isSoulbound: false,
      drop: false,
      dropStart: 0,
      dropPrice: 0,
      dropReserve: 0,
    });
    expect(collection.uuid).toBeDefined();
  });

  test.skip('mints a new nft', async () => {
    const nft = new Nft(config);
    const collection = nft.collection(collectionUUID);
    const res = await collection.mint(receiverAddress, 1);
    expect(res.success).toBe(true);
  });

  test('get nft collection transactions', async () => {
    const nft = new Nft(config);
    const transactions = await nft
      .collection(collectionUUID)
      .listTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0].transactionHash).toBeDefined();
  });

  test('get nft collection details', async () => {
    const nft = new Nft(config);
    const collection = await nft.collection(collectionUUID).get();
    console.log(collection);
    expect(collection.name).toBe('sdk test manual');
  });

  test('should fail nest minting for collection that is not nestable if collection populated', async () => {
    const nft = new Nft(config);
    const collection = await nft.collection(collectionUUID).get();
    await expect(collection.nestMint('', 1, 1)).rejects.toThrow(
      'Collection is not nestable.',
    );
  });

  // TODO: unhandled error in api
  test('should fail nest minting', async () => {
    const nft = new Nft(config);
    const collection = nft.collection(collectionUUID);
    await collection.nestMint('2ad03895-fd5d-40e7-af17-1d6daecf3b5a', 1, 1);
  });

  test('should fail revoking for collection that is not revokable if collection populated', async () => {
    const nft = new Nft(config);
    const collection = await nft.collection(collectionUUID).get();

    await expect(collection.burn('1')).rejects.toThrow(
      'Collection is not revokable.',
    );
  });
});
