import {
  Hosting,
  exceptionHandler,
  DeployToEnvironment,
  toInteger,
} from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { paginate } from '../../lib/options';

export async function listWebsites(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  try {
    const { items: websites } = await hosting.listWebsites(
      paginate(optsWithGlobals),
    );
    console.log(websites.map((w) => w.serialize()));
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function getWebsite(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  try {
    const website = await hosting.website(optsWithGlobals.uuid).get();
    console.log(website.serialize());
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function deployWebsite(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  const hosting = new Hosting(optsWithGlobals);
  try {
    const website = hosting.website(optsWithGlobals.uuid);
    await website.uploadFromFolder(path);
    const deployment = await website.deploy(
      optsWithGlobals.preview
        ? DeployToEnvironment.TO_STAGING
        : DeployToEnvironment.DIRECTLY_TO_PRODUCTION,
    );
    console.log(`Deployment started!`);
    const deploymentData = await website
      .deployment(deployment.deploymentUuid)
      .get();
    console.log(deploymentData.serialize());
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function uploadWebsiteFiles(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  const hosting = new Hosting(optsWithGlobals);
  try {
    await hosting.website(optsWithGlobals.uuid).uploadFromFolder(path);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function deployToEnvironment(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  try {
    await hosting
      .website(optsWithGlobals.uuid)
      .deploy(toInteger(optsWithGlobals.env));
    console.log('Deploy successful');
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function listDeployments(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  const params = {
    ...paginate(optsWithGlobals),
    environment: toInteger(optsWithGlobals.env),
    deploymentStatus: toInteger(optsWithGlobals.status),
  };
  try {
    const { items: deployments } = await hosting
      .website(optsWithGlobals.uuid)
      .listDeployments(params);
    console.log(deployments.map((d) => d.serialize()));
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function getDeployment(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  try {
    const deployment = await hosting
      .website(optsWithGlobals.websiteUuid)
      .deployment(optsWithGlobals.deploymentUuid)
      .get();
    console.log(deployment.serialize());
  } catch (err) {
    exceptionHandler(err);
  }
}
