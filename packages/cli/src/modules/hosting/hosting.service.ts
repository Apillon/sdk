import { Hosting, DeployToEnvironment, toInteger } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';
import { withErrorHandler } from '../../lib/utils';

export async function listWebsites(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const data = await new Hosting(optsWithGlobals).listWebsites(
      paginate(optsWithGlobals),
    );
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  });
}

export async function getWebsite(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const website = await new Hosting(optsWithGlobals)
      .website(optsWithGlobals.uuid)
      .get();
    console.log(website.serialize());
  });
}

export async function deployWebsite(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async () => {
    const website = new Hosting(optsWithGlobals).website(optsWithGlobals.uuid);
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
  });
}

export async function uploadWebsiteFiles(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async () => {
    await new Hosting(optsWithGlobals)
      .website(optsWithGlobals.uuid)
      .uploadFromFolder(path);
  });
}

export async function deployToEnvironment(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    await new Hosting(optsWithGlobals)
      .website(optsWithGlobals.uuid)
      .deploy(toInteger(optsWithGlobals.env));
    console.log('Deploy successful');
  });
}

export async function listDeployments(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const params = {
      ...paginate(optsWithGlobals),
      environment: toInteger(optsWithGlobals.env),
      deploymentStatus: toInteger(optsWithGlobals.status),
    };
    const data = await new Hosting(optsWithGlobals)
      .website(optsWithGlobals.uuid)
      .listDeployments(params);
    data.items = data.items.map((w) => w.serialize());
    console.log(data);
  });
}

export async function getDeployment(optsWithGlobals: GlobalOptions) {
  await withErrorHandler(async () => {
    const deployment = await new Hosting(optsWithGlobals)
      .website(optsWithGlobals.websiteUuid)
      .deployment(optsWithGlobals.deploymentUuid)
      .get();
    console.log(deployment.serialize());
  });
}
