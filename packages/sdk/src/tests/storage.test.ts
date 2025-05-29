import * as fs from 'fs';
import { resolve } from 'path';
import { Storage } from '../modules/storage/storage';
import { BucketType, StorageContentType } from '../types/storage';
import { getConfig, getDirectoryUUID, getFileUUID } from './helpers/helper';

describe('Storage tests', () => {
  let storage: Storage;
  let bucketUuid: string;
  // For get and delete tests
  let directoryUuid: string;
  let fileUuid: string;

  beforeAll(async () => {
    storage = new Storage(getConfig());
    directoryUuid = getDirectoryUUID();
    fileUuid = getFileUUID();
  });

  test('Create bucket', async () => {
    const bucketName = 'SDK Test Bucket';
    const bucket = await storage.createBucket({
      name: bucketName,
      description: 'SDK Test Bucket Description',
    });
    expect(bucket).toBeDefined();
    expect(bucket.uuid).toBeTruthy();
    expect(bucket.name).toEqual(bucketName);
    expect(bucket.description).toEqual('SDK Test Bucket Description');
    expect(bucket.size).toEqual(0);
    expect(bucket.bucketType).toEqual(BucketType.STORAGE);

    bucketUuid = bucket.uuid;
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
    expect(bucket.size).toEqual(0);
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
    expect(files.every((f) => !!f.CID)).toBeTruthy();
  });

  test('upload files from folder with ignoreFiles=false', async () => {
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
    const css = fs.readFileSync(
      resolve(__dirname, './helpers/website/style.css'),
    );
    const css2 = fs.readFileSync(
      resolve(__dirname, './helpers/website/style2.css'),
    );
    console.time('File upload complete');
    const files = await storage.bucket(bucketUuid).uploadFiles(
      [
        {
          fileName: 'style.css',
          contentType: 'text/css',
          path: null,
          content: css,
        },
        {
          fileName: 'style2.css',
          contentType: 'text/css',
          path: null,
          content: css2,
        },
      ],
      { directoryPath: 'main/subdir' },
    );

    expect(files.length).toBe(2);
    expect(files[0].CID).toBe(
      'bafybeibjawzowog5hmybfo6i7yaowsgwnmgdy6m3665da7xxpu2lwqjmia',
    );
    expect(files[0].fileUuid).toBeDefined();
    expect(files[0].path).toBeNull();
    expect(files[0].url).toContain(
      'https://bafybeibjawzowog5hmybfo6i7yaowsgwnmgdy6m3665da7xxpu2lwqjmia',
    );

    expect(files[1].CID).toBe(
      'bafybeihvpgcpq4cvhuhx7lobnv4zirzhk2ftgbf7hoqsphszabz7dxvwkq',
    );
    expect(files[1].fileUuid).toBeDefined();
    expect(files[1].path).toBeNull();
    expect(files[1].url).toContain(
      'https://bafybeihvpgcpq4cvhuhx7lobnv4zirzhk2ftgbf7hoqsphszabz7dxvwkq',
    );

    console.timeEnd('File upload complete');
  });

  test('upload files from buffer with wrapWithDirectory=true', async () => {
    const css = fs.readFileSync(
      resolve(__dirname, './helpers/website/style.css'),
    );

    console.time('File upload complete');
    const files = await storage.bucket(bucketUuid).uploadFiles(
      [
        {
          fileName: 'style.css',
          contentType: 'text/css',
          path: null,
          content: css,
        },
      ],
      { wrapWithDirectory: true, directoryPath: 'main/subdir-wrapped' },
    );

    expect(files.length).toBe(1);
    expect(files[0].fileUuid).toBeDefined();
    expect(files[0].CID).toBeUndefined();
    expect(files[0].path).toBeNull();
    expect(files[0].url).toBeUndefined();

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
