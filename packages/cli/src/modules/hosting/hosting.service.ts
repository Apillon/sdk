import { Hosting, exceptionHandler, DeployToEnvironment } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';

export async function listWebsites(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  try {
    const { items: websites } = await hosting.listWebsites();
    console.log(websites);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function getWebsite(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  try {
    const website = await hosting.website(optsWithGlobals.uuid).get();
    console.log(website);
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
    const deploymentData = await website.deployment(deployment.deployment_uuid);
    console.log(`Deployment started!`);
    console.log(deploymentData);
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
    await hosting.website(optsWithGlobals.uuid).deploy(+optsWithGlobals.env);
    console.log('Deploy successful');
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function listDeployments(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  const params =
    optsWithGlobals.env || optsWithGlobals.status
      ? {
          environment: +optsWithGlobals.env,
          deploymentStatus: +optsWithGlobals.status,
        }
      : null;
  try {
    const { items: deployments } = await hosting
      .website(optsWithGlobals.uuid)
      .listDeployments(params);
    console.log(deployments);
  } catch (err) {
    exceptionHandler(err);
  }
}

export async function getDeployment(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  try {
    const deployment = await hosting
      .website(optsWithGlobals.uuid)
      .deployment(optsWithGlobals.deploymentUuid)
      .get();
    console.log(deployment);
  } catch (err) {
    exceptionHandler(err);
  }
}
