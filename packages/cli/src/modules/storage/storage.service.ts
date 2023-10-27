import { Storage } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';

export async function listBuckets(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  const { items: buckets } = await storage.listBuckets();
  console.log(buckets);
}

export async function getObjects(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  const { items: objects } = await storage
    .bucket(optsWithGlobals.uuid)
    .getObjects();
  console.log(objects);
}

export async function getFiles(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  const { items: files } = await storage
    .bucket(optsWithGlobals.uuid)
    .getFiles();
  console.log(files);
}

export async function uploadFromFolder(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  const storage = new Storage(optsWithGlobals);
  await storage.bucket(optsWithGlobals.uuid).uploadFromFolder(path);
}

export async function file(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  const file = await storage
    .bucket(optsWithGlobals.uuid)
    .file(optsWithGlobals.fileUuid)
    .get();
  console.log(file);
}

export async function deleteFile(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  await storage
    .bucket(optsWithGlobals.uuid)
    .deleteFile(optsWithGlobals.fileUuid);
  console.log('File deleted successfully');
}
