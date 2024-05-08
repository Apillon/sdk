import { resolve } from 'path';
import { Storage } from '../modules/storage/storage';
import { StorageContentType } from '../types/storage';
import {
  getBucketUUID,
  getConfig,
  getDirectoryUUID,
  getFileUUID,
} from './helpers/helper';
import * as fs from 'fs';

describe('Storage tests', () => {
  let storage: Storage;
  let bucketUuid: string;
  // For get and delete tests
  let directoryUuid: string;
  let fileUuid: string;

  beforeAll(async () => {
    storage = new Storage(getConfig());
    bucketUuid = getBucketUUID();
    directoryUuid = getDirectoryUUID();
    fileUuid = getFileUUID();
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

    // .gitignore and index.html are not ignored
    // and HTML files are not allowed
    await expect(
      storage
        .bucket(bucketUuid)
        .uploadFromFolder(uploadDir, { ignoreFiles: false }),
    ).rejects.toThrow();
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

  describe.skip('File detail tests', () => {
    test('get file details', async () => {
      const file = await storage.bucket(bucketUuid).file(fileUuid).get();
      expect(file.name).toBeTruthy();
    });

    test('delete a file', async () => {
      await storage.bucket(bucketUuid).file(fileUuid).delete();
    });

    test('delete a directory', async () => {
      await storage.bucket(bucketUuid).directory(directoryUuid).delete();
    });
  });

  describe('Storage info tests', () => {
    test('Get storage info', async () => {
      const info = await storage.getInfo();
      expect(info).toBeDefined();
      expect(info.availableStorage).toBeGreaterThan(0);
      expect(info.usedStorage).toBeGreaterThanOrEqual(0);
      expect(info.usedStorage).toBeLessThan(info.availableStorage);
      expect(info.availableBandwidth).toBeGreaterThan(0);
      expect(info.usedBandwidth).toBeGreaterThanOrEqual(0);
      expect(info.usedBandwidth).toBeLessThan(info.availableBandwidth);
    });

    test('Get IPFS cluster info', async () => {
      const ipfsClusterInfo = await storage.getIpfsClusterInfo();
      expect(ipfsClusterInfo).toBeDefined();
      expect(ipfsClusterInfo.secret).toBeDefined();
      expect(ipfsClusterInfo.projectUuid).toBeDefined();
      expect(ipfsClusterInfo.ipfsGateway).toBeDefined();
      expect(ipfsClusterInfo.ipnsGateway).toBeDefined();
    });

    test('Generate IPFS link', async () => {
      const cid = 'bafybeigjhyc2tpvqfqsuvf3byo4e4a4v6spi6jk4qqvvtlpca6rsaf2cqi';
      const link = await storage.generateIpfsLink(cid);
      expect(link).toBeDefined();
      expect(link).toContain(cid);
    });
  });
});
