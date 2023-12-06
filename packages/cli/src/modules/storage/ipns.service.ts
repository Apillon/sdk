import { Storage, exceptionHandler } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';

export async function listIpnsNames(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const data = await storage
      .bucket(optsWithGlobals.bucketUuid)
      .listIpnsNames(paginate(optsWithGlobals));
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function createIpns(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const ipns = await storage.bucket(optsWithGlobals.bucketUuid).createIpns({
      name: optsWithGlobals.name,
      description: optsWithGlobals.description,
      cid: optsWithGlobals.cid,
    });
    console.log('IPNS record created successfully');
    console.log(ipns.serialize());
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function getIpns(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const ipns = await storage
      .bucket(optsWithGlobals.bucketUuid)
      .ipns(optsWithGlobals.ipnsUuid)
      .get();
    console.log(ipns.serialize());
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function publishIpns(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    const ipns = await storage
      .bucket(optsWithGlobals.bucketUuid)
      .ipns(optsWithGlobals.ipnsUuid)
      .publish(optsWithGlobals.cid);
    console.log('IPNS published successfully');
    console.log(ipns.serialize());
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function deleteIpns(optsWithGlobals: GlobalOptions) {
  const storage = new Storage(optsWithGlobals);
  try {
    await storage
      .bucket(optsWithGlobals.bucketUuid)
      .ipns(optsWithGlobals.ipnsUuid)
      .delete();
    console.log('IPNS record deleted successfully');
  } catch (err) {
    exceptionHandler(err);
  }
}
