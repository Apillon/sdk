import { ApillonConfig } from '../lib/apillon';
import { Ipns } from '../modules/storage/ipns';
import { Storage } from '../modules/storage/storage';
import { getBucketUUID, getConfig } from './helpers/helper';

describe('IPNS tests for StorageBucket', () => {
  let config: ApillonConfig;
  let bucketUUID: string;
  let newIpnsUuid: string;

  beforeAll(async () => {
    config = getConfig();
    bucketUUID = getBucketUUID();
  });

  test('List IPNS records in a bucket', async () => {
    const storage = new Storage(config);
    const response = await storage.bucket(bucketUUID).listIpnsNames();
    expect(response.items).toBeInstanceOf(Array<Ipns>);
    expect(response.items.length).toBeGreaterThanOrEqual(0);
  });

  test('Create a new IPNS record', async () => {
    const storage = new Storage(config);
    const name = 'Test IPNS';
    const description = 'This is a test description';
    const cid = 'QmUxtfFfWFguxSWUUy2FiBsGuH6Px4KYFxJqNYJRiDpemj';
    const ipns = await storage.bucket(bucketUUID).createIpns({
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
    const storage = new Storage(config);
    const ipns = await storage.bucket(bucketUUID).ipns(newIpnsUuid).get();
    expect(ipns).toBeDefined();
    expect(ipns.name).toEqual('Test IPNS');
    expect(ipns.uuid).toEqual(newIpnsUuid);
  });

  test('Publish an IPNS record', async () => {
    const storage = new Storage(config);
    const cid = 'Qmakf2aN7wzt5u9H3RadGjfotu62JsDfBq8hHzGsV2LZFx';
    const ipns = await storage
      .bucket(bucketUUID)
      .ipns(newIpnsUuid)
      .publish(cid);
    expect(ipns).toBeDefined();
    expect(ipns.ipnsValue).toEqual(`/ipfs/${cid}`);
    expect(ipns.uuid).toEqual(newIpnsUuid);
  });

  test('Delete an IPNS record', async () => {
    const storage = new Storage(config);
    const ipns = await storage.bucket(bucketUUID).ipns(newIpnsUuid).delete();
    expect(ipns).toBeDefined();
    expect(ipns.name).toEqual('Test IPNS');
    expect(ipns.uuid).toEqual(newIpnsUuid);
  });
});
