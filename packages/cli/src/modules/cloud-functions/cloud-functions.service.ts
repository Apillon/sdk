/* eslint-disable security/detect-non-literal-fs-filename */
import { CloudFunctions } from '@apillon/sdk';
import { readFileSync } from 'fs';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';
import { withErrorHandler } from '../../lib/utils';
import { Storage } from '@apillon/sdk';

export async function listCloudFunctions(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new CloudFunctions(optsWithGlobals).listCloudFunctions({
      ...paginate(optsWithGlobals),
    });
    console.log(data.items.map((d) => d.serialize()));
  });
}

export async function getCloudFunction(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const cloudFunction = await new CloudFunctions(optsWithGlobals)
      .cloudFunction(optsWithGlobals.uuid)
      .get();

    cloudFunction.jobs = cloudFunction.jobs.map((job) => job.serialize());
    console.info(cloudFunction.serialize());
  });
}

export async function createCloudFunction(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const cloudFunctions = new CloudFunctions(optsWithGlobals);
    const data = await cloudFunctions.createCloudFunction({
      name: optsWithGlobals.name,
      description: optsWithGlobals.description,
    });
    if (data) {
      console.log(data.serialize());
      console.log('Cloud function created successfully!');
    }
  });
}

export async function createCloudFunctionJob(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    let scriptContent: string;
    const script = optsWithGlobals.script;

    if (!script.endsWith('.js')) {
      return console.error('The script file must have a .js extension.');
    }

    try {
      scriptContent = readFileSync(script, 'utf-8');
    } catch (e) {
      return e.code === 'ENOENT'
        ? console.error(`Error: Script file not found (${script}).`)
        : console.error(e);
    }

    const cloudFunction = await new CloudFunctions(optsWithGlobals)
      .cloudFunction(optsWithGlobals.uuid)
      .get();

    // Upload the script to IPFS
    const files = await new Storage(optsWithGlobals)
      .bucket(cloudFunction.bucketUuid)
      .uploadFiles(
        [
          {
            fileName: script.split('/').pop(),
            content: Buffer.from(scriptContent, 'utf-8'),
            contentType: 'application/javascript',
          },
        ],
        { awaitCid: true },
      );

    const job = await cloudFunction.createJob({
      name: optsWithGlobals.name,
      scriptCid: files[0].CID,
    });

    console.log(job.serialize());
    console.log('Cloud function job created successfully!');
  });
}

export async function setCloudFunctionEnvironment(
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async () => {
    const variables = optsWithGlobals.variables.split(',').map((v) => {
      const [key, value] = v.split('=');
      return { key, value };
    });

    await new CloudFunctions(optsWithGlobals)
      .cloudFunction(optsWithGlobals.uuid)
      .setEnvironment(variables);

    console.log('Environment variables set successfully!');
  });
}

export async function listCloudFunctionJobs(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new CloudFunctions(optsWithGlobals)
      .cloudFunction(optsWithGlobals.uuid)
      .get();

    console.log(data.jobs.map((job) => job.serialize()));
  });
}

export async function deleteCloudFunctionJob(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    await new CloudFunctions(optsWithGlobals)
      .cloudFunctionJob(optsWithGlobals.jobUuid)
      .delete();

    console.log('Cloud function job deleted successfully!');
  });
}
