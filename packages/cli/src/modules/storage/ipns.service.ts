import { Storage, exceptionHandler } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';

export async function listIpnsNames(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    const data = await storage
      .bucket(optsWithGlobals.bucketUuid)
      .listIpnsNames(paginate(optsWithGlobals));
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  }, optsWithGlobals);
}

export async function createIpns(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    const ipns = await storage.bucket(optsWithGlobals.bucketUuid).createIpns({
      name: optsWithGlobals.name,
      description: optsWithGlobals.description,
      cid: optsWithGlobals.cid,
    });
    console.log('IPNS record created successfully');
    console.log(ipns.serialize());
  }, optsWithGlobals);
}

export async function getIpns(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    const ipns = await storage
      .bucket(optsWithGlobals.bucketUuid)
      .ipns(optsWithGlobals.ipnsUuid)
      .get();
    console.log(ipns.serialize());
  }, optsWithGlobals);
}

export async function publishIpns(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    const ipns = await storage
      .bucket(optsWithGlobals.bucketUuid)
      .ipns(optsWithGlobals.ipnsUuid)
      .publish(optsWithGlobals.cid);
    console.log('IPNS published successfully');
    console.log(ipns.serialize());
  }, optsWithGlobals);
}

export async function deleteIpns(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (storage: Storage) => {
    await storage
      .bucket(optsWithGlobals.bucketUuid)
      .ipns(optsWithGlobals.ipnsUuid)
      .delete();
    console.log('IPNS record deleted successfully');
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
