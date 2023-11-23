import { Storage, exceptionHandler, toInteger } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';

export async function listBuckets(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const data = await storage.listBuckets(paginate(optsWithGlobals));
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function listObjects(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const data = await storage.bucket(optsWithGlobals.bucketUuid).listObjects({
      ...paginate(optsWithGlobals),
      directoryUuid: optsWithGlobals.directoryUuid,
      markedForDeletion: !!optsWithGlobals.deleted,
    });
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function listFiles(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const data = await storage.bucket(optsWithGlobals.bucketUuid).listFiles({
      ...paginate(optsWithGlobals),
      fileStatus: toInteger(optsWithGlobals.fileStatus),
    });
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function uploadFromFolder(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  const storage = new Storage(optsWithGlobals);
  try {
    await storage.bucket(optsWithGlobals.bucketUuid).uploadFromFolder(path);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function getFile(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const file = await storage
      .bucket(optsWithGlobals.bucketUuid)
      .file(optsWithGlobals.fileUuid)
      .get();
    console.log(file.serialize());
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function deleteFile(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    await storage
      .bucket(optsWithGlobals.bucketUuid)
      .deleteFile(optsWithGlobals.fileUuid);
    console.log('File deleted successfully');
  } catch (err) {
    exceptionHandler(err);
  }
}
