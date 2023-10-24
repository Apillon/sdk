import { ApillonConfig } from '../lib/apillon';
import { Storage } from '../modules/storage/storage';
import { StorageContentType } from '../types/storage';
import { getBucketUUID, getConfig } from './helpers/helper';

describe('Storage tests', () => {
  let config: ApillonConfig;
  let bucketUUID: string;

  beforeAll(async () => {
    config = getConfig();
    bucketUUID = getBucketUUID();
  });

  test('get bucket content', async () => {
    const storage = new Storage(config);
    const content = await storage.bucket(bucketUUID).getObjects();
    for (const item of content) {
      if (item.type == StorageContentType.DIRECTORY) {
        await item.get();
      }
      console.log(`${item.type}: ${item.name}`);
    }
    expect(content.length).toBeGreaterThanOrEqual(0);
  });

  test('get bucket files recursively', async () => {
    const storage = new Storage(config);
    const content = await storage.bucket(bucketUUID).getFilesRecursive();
    for (const item of content) {
      if (item.type == StorageContentType.DIRECTORY) {
        await item.get();
      }
      console.log(`${item.type}: ${item.name}`);
    }
    expect(content.length).toBeGreaterThanOrEqual(0);
  });

  test('get bucket directory content', async () => {
    const storage = new Storage(config);
    const content = await storage
      .bucket(bucketUUID)
      .getObjects({ directoryUuid: '6c9c6ab1-801d-4915-a63e-120eed21fee0' });

    for (const item of content) {
      if (item.type == StorageContentType.DIRECTORY) {
        await item.get();
      }
      console.log(`${item.type}: ${item.name}`);
    }
  });

  test.skip('get file details', async () => {
    const storage = new Storage(config);
    try {
      const content = await storage.bucket(bucketUUID).file('79961').get();
      console.log(content);
    } catch (e) {
      console.log(e);
    }
  });

  test.skip('upload files', async () => {
    const storage = new Storage(config);
    try {
      await storage
        .bucket(bucketUUID)
        .uploadFromFolder('./src/tests/helpers/website/');
      // console.log(content);
    } catch (e) {
      console.log(e);
    }
  });
});
