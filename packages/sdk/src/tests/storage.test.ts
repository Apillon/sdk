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

  test('Get bucket', async () => {
    const bucket = await storage.bucket(bucketUuid).get();
    expect(bucket.uuid).toEqual(bucketUuid);
    expect(bucket.name).toBeTruthy();
    expect(bucket.size).toBeGreaterThan(0);
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

  test('upload files from folder', async () => {
    const uploadDir = resolve(__dirname, './helpers/website/');

    console.time('File upload complete');
    const files = await storage.bucket(bucketUuid).uploadFromFolder(uploadDir);
    console.timeEnd('File upload complete');

    expect(files.every((f) => !!f.fileUuid)).toBeTruthy();
  });

  test('upload files from folder with awaitCid', async () => {
    const uploadDir = resolve(__dirname, './helpers/website/');

    console.time('File upload complete');
    const files = await storage
      .bucket(bucketUuid)
      .uploadFromFolder(uploadDir, { awaitCid: true });
    console.timeEnd('File upload complete');

    expect(files.length).toBeGreaterThan(0);
    expect(files.every((f) => !!f.CID)).toBeTruthy();
  });

  test('upload files from folder with ignoreFiles = false', async () => {
    const uploadDir = resolve(__dirname, './helpers/website/');

    console.time('File upload complete');
    const files = await storage
      .bucket(bucketUuid)
      .uploadFromFolder(uploadDir, { ignoreFiles: false });
    expect(files.length).toEqual(3); // .gitignore and index.html are not ignored

    console.timeEnd('File upload complete');
  });

  test('upload files from buffer', async () => {
    // const html = fs.readFileSync(
    //   resolve(__dirname, './helpers/website/index.html'),
    // );
    const css = fs.readFileSync(
      resolve(__dirname, './helpers/website/style.css'),
    );
    console.time('File upload complete');
    await storage.bucket(bucketUuid).uploadFiles(
      [
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
  });

  test.skip('delete a file', async () => {
    await storage.bucket(bucketUuid).file(fileUuid).delete();
  });

  test.skip('delete a directory', async () => {
    await storage.bucket(bucketUuid).directory(directoryUuid).delete();
  });
});
