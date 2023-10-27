import { Storage, exceptionHandler } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';

export async function listBuckets(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const { items: buckets } = await storage.listBuckets();
    console.log(buckets);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function getObjects(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const { items: objects } = await storage
      .bucket(optsWithGlobals.uuid)
      .getObjects();
    console.log(objects);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function getFiles(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const { items: files } = await storage
      .bucket(optsWithGlobals.uuid)
      .getFiles();
    console.log(files);
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
    await storage.bucket(optsWithGlobals.uuid).uploadFromFolder(path);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function file(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const file = await storage
      .bucket(optsWithGlobals.uuid)
      .file(optsWithGlobals.fileUuid)
      .get();
    console.log(file);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function deleteFile(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    await storage
      .bucket(optsWithGlobals.uuid)
      .deleteFile(optsWithGlobals.fileUuid);
    console.log('File deleted successfully');
  } catch (err) {
    exceptionHandler(err);
  }
}
