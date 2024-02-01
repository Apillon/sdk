import { Storage } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';
import { withErrorHandler } from '../../lib/utils';

export async function listIpnsNames(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .listIpnsNames(paginate(optsWithGlobals));
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  });
}

export async function createIpns(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const ipns = await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .createIpns({
        name: optsWithGlobals.name,
        description: optsWithGlobals.description,
        cid: optsWithGlobals.cid,
      });
    console.log('IPNS record created successfully');
    console.log(ipns.serialize());
  });
}

export async function getIpns(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const ipns = await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .ipns(optsWithGlobals.ipnsUuid)
      .get();
    console.log(ipns.serialize());
  });
}

export async function publishIpns(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const ipns = await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .ipns(optsWithGlobals.ipnsUuid)
      .publish(optsWithGlobals.cid);
    console.log('IPNS published successfully');
    console.log(ipns.serialize());
  });
}

export async function deleteIpns(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    await new Storage(optsWithGlobals)
      .bucket(optsWithGlobals.bucketUuid)
      .ipns(optsWithGlobals.ipnsUuid)
      .delete();
    console.log('IPNS record deleted successfully');
  });
}
