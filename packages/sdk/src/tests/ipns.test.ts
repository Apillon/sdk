import { Ipns } from '../modules/storage/ipns';
import { Storage } from '../modules/storage/storage';
import { getBucketUUID, getConfig } from './helpers/helper';

describe('IPNS tests for StorageBucket', () => {
  let storage: Storage;
  let bucketUuid: string;
  let newIpnsUuid: string;

  beforeAll(async () => {
    storage = new Storage(getConfig());
    bucketUuid = getBucketUUID();
  });

  test('List IPNS records in a bucket', async () => {
    const response = await storage.bucket(bucketUuid).listIpnsNames();
    expect(response.items).toBeInstanceOf(Array<Ipns>);
    expect(response.items.length).toBeGreaterThanOrEqual(0);
  });

  test('Create a new IPNS record', async () => {
    const name = 'Test IPNS';
    const description = 'This is a test description';
    const cid = 'QmUxtfFfWFguxSWUUy2FiBsGuH6Px4KYFxJqNYJRiDpemj';
    const ipns = await storage.bucket(bucketUuid).createIpns({
      name,
      description,
      cid,
    });
    expect(ipns).toBeDefined();
    expect(ipns.name).toEqual(name);
    expect(ipns.description).toEqual(description);
    expect(ipns.ipnsValue).toEqual(`/ipfs/${cid}`);
    newIpnsUuid = ipns.uuid; // Save the new IPNS UUID for later use in other tests
  });

  test('Get a specific IPNS record', async () => {
    const ipns = await storage.bucket(bucketUuid).ipns(newIpnsUuid).get();
    expect(ipns).toBeDefined();
    expect(ipns.name).toEqual('Test IPNS');
    expect(ipns.uuid).toEqual(newIpnsUuid);
  });

  test('Publish an IPNS record', async () => {
    const cid = 'Qmakf2aN7wzt5u9H3RadGjfotu62JsDfBq8hHzGsV2LZFx';
    const ipns = await storage
      .bucket(bucketUuid)
      .ipns(newIpnsUuid)
      .publish(cid);
    expect(ipns).toBeDefined();
    expect(ipns.ipnsValue).toEqual(`/ipfs/${cid}`);
    expect(ipns.uuid).toEqual(newIpnsUuid);
  });

  test('Delete an IPNS record', async () => {
    const ipns = await storage.bucket(bucketUuid).ipns(newIpnsUuid).delete();
    expect(ipns).toBeDefined();
    expect(ipns.name).toEqual('Test IPNS');
    expect(ipns.uuid).toEqual(newIpnsUuid);
  });
});
