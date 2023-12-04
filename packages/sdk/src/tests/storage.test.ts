import { resolve } from 'path';
import { ApillonConfig } from '../lib/apillon';
import { Storage } from '../modules/storage/storage';
import { StorageContentType } from '../types/storage';
import { getBucketUUID, getConfig } from './helpers/helper';
import * as fs from 'fs';

describe('Storage tests', () => {
  let config: ApillonConfig;
  let bucketUUID: string;

  beforeAll(async () => {
    config = getConfig();
    bucketUUID = getBucketUUID();
  });

  test('List buckets', async () => {
    const { items } = await new Storage(config).listBuckets();
    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach((item) => expect(item.name).toBeTruthy());
  });

  test('get bucket content', async () => {
    const storage = new Storage(config);
    const { items } = await storage.bucket(bucketUUID).listObjects();
    for (const item of items) {
      if (item.type == StorageContentType.DIRECTORY) {
        await item.get();
      }
      console.log(`${item.type}: ${item.name}`);
    }
    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach((item) => expect(item.name).toBeTruthy());
  });

  test('get bucket files', async () => {
    const storage = new Storage(config);
    const { items } = await storage.bucket(bucketUUID).listFiles();
    for (const item of items) {
      console.log(`${item.type}: ${item.name}`);
    }
    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach((item) => expect(item.name).toBeTruthy());
  });

  test('get bucket files markedForDeletion=true', async () => {
    const storage = new Storage(config);
    const { items } = await storage
      .bucket(bucketUUID)
      .listObjects({ markedForDeletion: true });
    expect(items.some((file) => file['status'] == 8));
  });

  test('get bucket directory content', async () => {
    const storage = new Storage(config);
    const { items } = await storage
      .bucket(bucketUUID)
      .listObjects({ directoryUuid: '6c9c6ab1-801d-4915-a63e-120eed21fee0' });

    for (const item of items) {
      if (item.type == StorageContentType.DIRECTORY) {
        await item.get();
      }
      console.log(`${item.type}: ${item.name}`);
    }
    items.forEach((item) => expect(item.name).toBeTruthy());
  });

  test('get file details', async () => {
    const storage = new Storage(config);
    const file = await storage
      .bucket(bucketUUID)
      .file('cf6a0d3d-2abd-4a0d-85c1-10b8f04cd4fc')
      .get();
    expect(file.name).toBeTruthy();
  });

  test.skip('upload files from folder', async () => {
    const storage = new Storage(config);
    try {
      const uploadDir = resolve(__dirname, './helpers/website/');
      console.time('File upload complete');
      await storage.bucket(bucketUUID).uploadFromFolder(uploadDir);
      console.timeEnd('File upload complete');

      // console.log(content);
    } catch (e) {
      console.log(e);
    }
  });

  test.skip('upload files from buffer', async () => {
    const storage = new Storage(config);
    const html = fs.readFileSync(
      resolve(__dirname, './helpers/website/index.html'),
    );
    const css = fs.readFileSync(
      resolve(__dirname, './helpers/website/style.css'),
    );
    try {
      console.time('File upload complete');
      await storage.bucket(bucketUUID).uploadFiles(
        [
          {
            fileName: 'index.html',
            contentType: 'text/html',
            path: null,
            content: html,
          },
          {
            fileName: 'style.css',
            contentType: 'text/css',
            path: null,
            content: css,
          },
        ],
        { wrapWithDirectory: true, directoryPath: 'main/subdir' },
      );
      console.timeEnd('File upload complete');

      // console.log(content);
    } catch (e) {
      console.log(e);
    }
  });

  test.skip('delete a file', async () => {
    const storage = new Storage(config);
    await storage
      .bucket(bucketUUID)
      .file('eddc52cf-92d2-436e-b6de-52d7cad621c2')
      .delete();
  });
});
