import { ApillonConfig } from '../lib/apillon';
import { Storage } from '../modules/storage/storage';
import { StorageContentType } from '../types/storage';
import { getConfig } from './helpers/helper';

describe.skip('Storage tests', () => {
  let config: ApillonConfig;

  beforeAll(async () => {
    config = getConfig();
  });

  test('get bucket content', async () => {
    const storage = new Storage(config);
    try {
      const content = await storage
        .bucket('f2df445a-ab8d-4248-b231-470cc8a18385')
        .getContent();
      console.log(content);
    } catch (e) {
      console.log(e);
    }
  });

  test('get bucket directory content', async () => {
    const storage = new Storage(config);
    try {
      const content = await storage
        .bucket('f2df445a-ab8d-4248-b231-470cc8a18385')
        .getContent({ directoryId: '3160' });

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
      const content = await storage
        .bucket('f2df445a-ab8d-4248-b231-470cc8a18385')
        .file('79961')
        .get();
      console.log(content);
    } catch (e) {
      console.log(e);
    }
  });

  test('upload files', async () => {
    const storage = new Storage(config);
    try {
      await storage
        .bucket('f2df445a-ab8d-4248-b231-470cc8a18385')
        .uploadFromFolder('./src/tests/helpers/website/');
      // console.log(content);
    } catch (e) {
      console.log(e);
    }
  });
});
