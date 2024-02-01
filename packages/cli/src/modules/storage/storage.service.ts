import { Storage, toInteger } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';
import { withErrorHandler } from '../../lib/utils';

export async function listBuckets(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new Storage(optsWithGlobals).listBuckets(
      paginate(optsWithGlobals),
    );
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  });
}

export async function listObjects(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .listObjects({
        ...paginate(optsWithGlobals),
        directoryUuid: optsWithGlobals.directoryUuid,
        markedForDeletion: !!optsWithGlobals.deleted,
      });
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  });
}

export async function listFiles(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .listFiles({
        ...paginate(optsWithGlobals),
        fileStatus: toInteger(optsWithGlobals.fileStatus),
      });
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  });
}

export async function uploadFromFolder(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async () => {
    console.log(`Uploading files from folder: ${path}`);
    await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .uploadFromFolder(path);
  });
}

export async function getFile(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const file = await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .file(optsWithGlobals.fileUuid)
      .get();
    console.log(file.serialize());
  });
}

export async function deleteFile(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .file(optsWithGlobals.fileUuid)
      .delete();
    console.log('File deleted successfully');
  });
}

export async function deleteDirectory(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .directory(optsWithGlobals.directoryUuid)
      .delete();
    console.log('Directory deleted successfully');
  });
}
