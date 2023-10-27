import { Hosting } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';

export async function listWebsites(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  const { items: websites } = await hosting.listWebsites();
  console.log(websites);
}

export async function getWebsite(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  const website = await hosting.website(optsWithGlobals.uuid).get();
  console.log(website);
}

export async function uploadWebsiteFiles(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  const hosting = new Hosting(optsWithGlobals);
  await hosting.website(optsWithGlobals.uuid).uploadFromFolder(path);
}

export async function deployToEnvironment(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  await hosting.website(optsWithGlobals.uuid).deploy(+optsWithGlobals.env);
  console.log('Deploy successful');
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
  const { items: deployments } = await hosting
    .website(optsWithGlobals.uuid)
    .listDeployments(params);
  console.log(deployments);
}

export async function getDeployment(optsWithGlobals: GlobalOptions) {
  const hosting = new Hosting(optsWithGlobals);
  const deployment = await hosting
    .website(optsWithGlobals.uuid)
    .deployment(optsWithGlobals.deploymentUuid)
    .get();
  console.log(deployment);
}
