import { resolve } from 'path';
import { ApillonConfig } from '../lib/apillon';
import { Hosting } from '../modules/hosting/hosting';
import { DeployToEnvironment } from '../types/hosting';
import { getConfig, getWebsiteUUID } from './helpers/helper';
import { HostingWebsite } from '../modules/hosting/hosting-website';
import { Deployment } from '../modules/hosting/deployment';

describe('Hosting tests', () => {
  let config: ApillonConfig;
  let websiteUUID: string;

  beforeAll(async () => {
    config = getConfig();
    websiteUUID = getWebsiteUUID();
  });

  test('get all websites', async () => {
    const hosting = new Hosting(config);
    const { items } = await hosting.listWebsites();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toBeInstanceOf(HostingWebsite);
    expect(items[0].name).toBeTruthy();
  });

  test('get website info', async () => {
    const hosting = new Hosting(config);
    const website = await hosting.website(websiteUUID).get();
    expect(website).toBeInstanceOf(HostingWebsite);
    expect(website.name).toBeTruthy();
    expect(website.uuid).toBeTruthy();
  });

  test.skip('upload website from folder', async () => {
    const hosting = new Hosting(config);
    const website = hosting.website(websiteUUID);

    const uploadDir = resolve(__dirname, './helpers/website/');
    await website.uploadFromFolder(uploadDir);
    const deployment = await website.deploy(DeployToEnvironment.TO_STAGING);
    expect(deployment.environment).toEqual(DeployToEnvironment.TO_STAGING);
  });

  // test('get deployment status', async () => {
  //   const hosting = new Hosting(config);
  //   const website = hosting.website(websiteUUID);

  //   const deployStatus = await website.deploy(DeployToEnvironment.TO_STAGING);
  //   console.log(deployStatus);
  // });

  test('list all deployments', async () => {
    const hosting = new Hosting(config);
    const website = hosting.website(websiteUUID);

    const { items } = await website.listDeployments({ environment: DeployToEnvironment.TO_STAGING });
    expect(items.every(d => d.environment === DeployToEnvironment.TO_STAGING));
  });

  test('get deployment status', async () => {
    const hosting = new Hosting(config);
    const website = hosting.website(websiteUUID);

    const deployment = await website.deployment('e21a8e4e-bfce-4e63-b65b-59404d4fc6b4').get();
    expect(deployment.environment).toEqual(DeployToEnvironment.TO_STAGING);
  });
});
