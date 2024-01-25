import { Nft } from '../modules/nft/nft';
import { NftCollection } from '../modules/nft/nft-collection';
import { CollectionType, EvmChain } from '../types/nfts';
import { getCollectionUUID, getConfig, getMintAddress } from './helpers/helper';

const nftData = {
  chain: EvmChain.MOONBASE,
  collectionType: CollectionType.GENERIC,
  name: 'SDK Test',
  description: 'Created from SDK tests',
  symbol: 'SDKT',
  royaltiesFees: 0,
  royaltiesAddress: '0x0000000000000000000000000000000000000000',
  baseUri: 'https://test.com/metadata/',
  baseExtension: '.json',
  maxSupply: 5,
  isRevokable: false,
  isSoulbound: false,
  drop: false,
};

describe('Nft tests', () => {
  let nft: Nft;
  let collectionUuid: string;
  let receivingAddress: string;

  beforeAll(async () => {
    nft = new Nft(getConfig());
    collectionUuid = getCollectionUUID();
    receivingAddress = getMintAddress();
  });

  test('list nft collections', async () => {
    const { items: collections } = await nft.listCollections();
    expect(collections.length).toBeGreaterThan(0);
    expect(collections[0]).toBeInstanceOf(NftCollection);
  });

  test('creates a new collection', async () => {
    const collection = await nft.create(nftData);
    expect(collection.uuid).toBeDefined();
    expect(collection.contractAddress).toBeDefined();
    expect(collection.symbol).toEqual('SDKT');
    expect(collection.name).toEqual('SDK Test');
    expect(collection.description).toEqual('Created from SDK tests');
    expect(collection.isAutoIncrement).toEqual(true);

    collectionUuid = collection.uuid;
  });

  test('mints a new nft', async () => {
    const collection = nft.collection(collectionUuid);
    const res = await collection.mint({
      receivingAddress,
      quantity: 1,
    });
    expect(res.success).toBe(true);
    expect(res.transactionHash).toBeDefined();
  });

  test('get nft collection transactions', async () => {
    const { items: transactions } = await nft
      .collection(collectionUuid)
      .listTransactions();
    expect(transactions.length).toBeGreaterThan(0);
    expect(transactions[0].transactionHash).toBeDefined();
  });

  test('get nft collection details', async () => {
    const collection = await nft.collection(collectionUuid).get();
    console.log(collection);
    expect(collection.name).toBe('SDK Test');
  });

  test('should fail nest minting for collection that is not nestable if collection populated', async () => {
    const collection = await nft.collection(collectionUuid).get();
    await expect(collection.nestMint('', 1, 1)).rejects.toThrow(
      'Collection is not nestable.',
    );
  });

  // TODO: unhandled error in api
  test('should fail nest minting', async () => {
    const collection = nft.collection(collectionUuid);
    await expect(collection.nestMint(collectionUuid, 1, 1)).rejects.toThrow();
  });

  test('should fail revoking for collection that is not revokable if collection populated', async () => {
    const collection = await nft.collection(collectionUuid).get();

    await expect(collection.burn('1')).rejects.toThrow(
      'Collection is not revokable.',
    );
  });

  describe('NFT with custom IDs mint', () => {
    test('creates a new collection', async () => {
      const collection = await nft.create({
        ...nftData,
        name: 'SDK Test isAutoIncrement=false',
        isAutoIncrement: false,
      });
      expect(collection.uuid).toBeDefined();
      expect(collection.contractAddress).toBeDefined();
      expect(collection.symbol).toEqual('SDKT');
      expect(collection.name).toEqual('SDK Test isAutoIncrement=false');
      expect(collection.description).toEqual('Created from SDK tests');
      expect(collection.isAutoIncrement).toEqual(false);

      collectionUuid = collection.uuid;
    });

    test('mints new nfts with custom IDs', async () => {
      const collection = nft.collection(collectionUuid);
      const res = await collection.mint({
        receivingAddress,
        quantity: 2,
        idsToMint: [10, 20],
      });
      expect(res.success).toBe(true);
      expect(res.transactionHash).toBeDefined();
    });
  });
});
