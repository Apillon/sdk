import { resolve } from 'path';
import { Storage } from '../modules/storage/storage';
import { StorageContentType } from '../types/storage';
import { getBucketUUID, getConfig } from './helpers/helper';
import * as fs from 'fs';

describe('Storage tests', () => {
  let storage: Storage;
  let bucketUuid: string;
  // For get and delete tests
  const directoryUuid = '6c9c6ab1-801d-4915-a63e-120eed21fee0';
  const fileUuid = 'cf6a0d3d-2abd-4a0d-85c1-10b8f04cd4fc';

  beforeAll(async () => {
    storage = new Storage(getConfig());
    bucketUuid = getBucketUUID();
  });

  test('List buckets', async () => {
    const { items } = await storage.listBuckets();
    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach((item) => expect(item.name).toBeTruthy());
  });

  test('get bucket content', async () => {
    const { items } = await storage.bucket(bucketUuid).listObjects();
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
    const { items } = await storage.bucket(bucketUuid).listFiles();
    for (const item of items) {
      console.log(`${item.type}: ${item.name}`);
    }
    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach((item) => expect(item.name).toBeTruthy());
  });

  test('get bucket files markedForDeletion=true', async () => {
    const { items } = await storage
      .bucket(bucketUuid)
      .listObjects({ markedForDeletion: true });
    expect(items.some((file) => file['status'] == 8));
  });

  test('get bucket directory content', async () => {
    const { items } = await storage
      .bucket(bucketUuid)
      .listObjects({ directoryUuid });

    for (const item of items) {
      if (item.type == StorageContentType.DIRECTORY) {
        await item.get();
      }
      console.log(`${item.type}: ${item.name}`);
    }
    items.forEach((item) => expect(item.name).toBeTruthy());
  });

  test('get file details', async () => {
    const file = await storage.bucket(bucketUuid).file(fileUuid).get();
    expect(file.name).toBeTruthy();
  });

  test.skip('upload files from folder', async () => {
    try {
      const uploadDir = resolve(__dirname, './helpers/website/');
      console.time('File upload complete');
      await storage.bucket(bucketUuid).uploadFromFolder(uploadDir);
      console.timeEnd('File upload complete');

      // console.log(content);
    } catch (e) {
      console.log(e);
    }
  });

  test.skip('upload files from buffer', async () => {
    const html = fs.readFileSync(
      resolve(__dirname, './helpers/website/index.html'),
    );
    const css = fs.readFileSync(
      resolve(__dirname, './helpers/website/style.css'),
    );
    try {
      console.time('File upload complete');
      await storage.bucket(bucketUuid).uploadFiles(
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
    await storage.bucket(bucketUuid).file(fileUuid).delete();
  });

  test.skip('delete a directory', async () => {
    await storage.bucket(bucketUuid).directory(directoryUuid).delete();
  });
});
