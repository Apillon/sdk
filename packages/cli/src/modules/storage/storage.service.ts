import { Storage, exceptionHandler, toInteger } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';

export async function listBuckets(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    const data = await storage.listBuckets(paginate(optsWithGlobals));
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  }, optsWithGlobals);
}

export async function listObjects(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    const data = await storage.bucket(optsWithGlobals.bucketUuid).listObjects({
      ...paginate(optsWithGlobals),
      directoryUuid: optsWithGlobals.directoryUuid,
      markedForDeletion: !!optsWithGlobals.deleted,
    });
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  }, optsWithGlobals);
}

export async function listFiles(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    const data = await storage.bucket(optsWithGlobals.bucketUuid).listFiles({
      ...paginate(optsWithGlobals),
      fileStatus: toInteger(optsWithGlobals.fileStatus),
    });
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  }, optsWithGlobals);
}

export async function uploadFromFolder(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async (storage: Storage) => {
    console.log(`Uploading files from folder: ${path}`);
    await storage.bucket(optsWithGlobals.bucketUuid).uploadFromFolder(path);
  }, optsWithGlobals);
}

export async function getFile(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    const file = await storage
      .bucket(optsWithGlobals.bucketUuid)
      .file(optsWithGlobals.fileUuid)
      .get();
    console.log(file.serialize());
  }, optsWithGlobals);
}

export async function deleteFile(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    await storage
      .bucket(optsWithGlobals.bucketUuid)
      .file(optsWithGlobals.fileUuid)
      .delete();
    console.log('File deleted successfully');
  }, optsWithGlobals);
}

export async function deleteDirectory(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    await storage
      .bucket(optsWithGlobals.bucketUuid)
      .directory(optsWithGlobals.directoryUuid)
      .delete();
    console.log('Directory deleted successfully');
  }, optsWithGlobals);
}

async function withErrorHandler(
  handler: (module: Storage) => Promise<any>,
  optsWithGlobals: GlobalOptions,
) {
  try {
    const module = new Storage(optsWithGlobals);
    await handler(module);
  } catch (err) {
    exceptionHandler(err);
  }
}
