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

  test.skip('get bucket content', async () => {
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

  test.skip('get bucket files recursively', async () => {
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

  test.skip('get bucket files markedForDeletion=true', async () => {
    const storage = new Storage(config);
    const content = await storage.bucket(bucketUUID).getObjects({ markedForDeletion: true });
    expect(content.some(file => file['status'] == 8))
  });

  test.skip('get bucket directory content', async () => {
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
    const file = await storage.bucket(bucketUUID).file('cad1e0ef-29c5-4ae1-b9de-1065e8ec1e68').get();
    expect(file.name).toBeTruthy();
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
