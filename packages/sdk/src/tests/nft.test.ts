import { Nft } from '../modules/nft/nft';
import { NftCollection } from '../modules/nft/nft-collection';
import { CollectionType, EvmChain } from '../types/nfts';
import { getCollectionUUID, getConfig, getMintAddress } from './helpers/helper';

describe('Nft tests', () => {
  let nft: Nft;
  let collectionUuid: string;
  let receiverAddress: string;

  beforeAll(async () => {
    nft = new Nft(getConfig());
    collectionUuid = getCollectionUUID();
    receiverAddress = getMintAddress();
  });

  test('list nft collections', async () => {
    const { items: collections } = await nft.listCollections();
    expect(collections.length).toBeGreaterThan(0);
    expect(collections[0]).toBeInstanceOf(NftCollection);
  });

  test('creates a new collection', async () => {
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
      isRevokable: false,
      isSoulbound: false,
      drop: false,
    });
    expect(collection.uuid).toBeDefined();
    collectionUuid = collection.uuid;
  });

  test('mints a new nft', async () => {
    const collection = nft.collection(collectionUuid);
    const res = await collection.mint(receiverAddress, 1);
    expect(res.success).toBe(true);
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
    expect(collection.name).toBe('created from sdk tests');
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
});
