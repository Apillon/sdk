import { ApillonConfig } from '../lib/apillon';
import { Storage } from '../modules/storage/storage';
import { StorageContentType } from '../types/storage';
import { getBucketUUID, getConfig } from './helpers/helper';

describe.skip('Storage tests', () => {
  let config: ApillonConfig;
  let bucketUUID: string;

  beforeAll(async () => {
    config = getConfig();
    bucketUUID = getBucketUUID();
  });

  test('get bucket content', async () => {
    const storage = new Storage(config);
    try {
      const content = await storage.bucket(bucketUUID).getObjects();
      console.log(content);
    } catch (e) {
      console.log(e);
    }
  });

  test('get bucket directory content', async () => {
    const storage = new Storage(config);
    try {
      const content = await storage
        .bucket(bucketUUID)
        .getObjects({ directoryId: '3160' });

      for (let i = 0; i < content.length; i++) {
        if (content[i].type == StorageContentType.DIRECTORY) {
          await content[i].get();
          console.log(content[i]);
        }
        if (content[i].type == StorageContentType.FILE) {
          console.log(content[i]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  });

  test('get file details', async () => {
    const storage = new Storage(config);
    try {
      const content = await storage.bucket(bucketUUID).file('79961').get();
      console.log(content);
    } catch (e) {
      console.log(e);
    }
  });

  test('upload files', async () => {
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
