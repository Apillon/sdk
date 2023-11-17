import { Storage, exceptionHandler } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';

export async function listBuckets(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const { items: buckets } = await storage.listBuckets(
      paginate(optsWithGlobals),
    );
    console.log(buckets.map((x) => x.serialize()));
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function listObjects(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const { items: objects } = await storage
      .bucket(optsWithGlobals.bucketUuid)
      .getObjects({
        ...paginate(optsWithGlobals),
        markedForDeletion: !!optsWithGlobals.deleted,
      });
    console.log(objects.map((x) => x.serialize()));
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function listFiles(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const { items: files } = await storage
      .bucket(optsWithGlobals.bucketUuid)
      .getFiles(paginate(optsWithGlobals));
    console.log(files.map((x) => x.serialize()));
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
      .file(optsWithGlobals.uuid)
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
      .deleteFile(optsWithGlobals.uuid);
    console.log('File deleted successfully');
  } catch (err) {
    exceptionHandler(err);
  }
}
