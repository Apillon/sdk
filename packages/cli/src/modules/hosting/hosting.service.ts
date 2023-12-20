import {
  Hosting,
  exceptionHandler,
  DeployToEnvironment,
  toInteger,
} from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';

export async function listWebsites(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (hosting) => {
    const data = await hosting.listWebsites(paginate(optsWithGlobals));
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  }, optsWithGlobals);
}

export async function getWebsite(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (hosting) => {
    const website = await hosting.website(optsWithGlobals.uuid).get();
    console.log(website.serialize());
  }, optsWithGlobals);
}

export async function deployWebsite(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async (hosting) => {
    const website = hosting.website(optsWithGlobals.uuid);
    console.log(`Uploading files from folder: ${path}`);
    await website.uploadFromFolder(path);
    const deployment = await website.deploy(
      optsWithGlobals.preview
        ? DeployToEnvironment.TO_STAGING
        : DeployToEnvironment.DIRECTLY_TO_PRODUCTION,
    );
    console.log(`Deployment started!`);
    const deploymentData = await website.deployment(deployment.uuid).get();
    console.log(deploymentData.serialize());
  }, optsWithGlobals);
}

export async function uploadWebsiteFiles(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async (hosting) => {
    await hosting.website(optsWithGlobals.uuid).uploadFromFolder(path);
  }, optsWithGlobals);
}

export async function deployToEnvironment(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (hosting) => {
    await hosting
      .website(optsWithGlobals.uuid)
      .deploy(toInteger(optsWithGlobals.env));
    console.log('Deploy successful');
  }, optsWithGlobals);
}

export async function listDeployments(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (hosting) => {
    const params = {
      ...paginate(optsWithGlobals),
      environment: toInteger(optsWithGlobals.env),
      deploymentStatus: toInteger(optsWithGlobals.status),
    };
    const data = await hosting
      .website(optsWithGlobals.uuid)
      .listDeployments(params);
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  }, optsWithGlobals);
}

export async function getDeployment(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async (hosting) => {
    const deployment = await hosting
      .website(optsWithGlobals.websiteUuid)
      .deployment(optsWithGlobals.deploymentUuid)
      .get();
    console.log(deployment.serialize());
  }, optsWithGlobals);
}

async function withErrorHandler(
  handler: (module: Hosting) => Promise<any>,
  optsWithGlobals: GlobalOptions,
) {
  try {
    const module = new Hosting(optsWithGlobals);
    await handler(module);
  } catch (err) {
    exceptionHandler(err);
  }
}
