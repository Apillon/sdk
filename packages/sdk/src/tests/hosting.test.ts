import { resolve } from 'path';
import { ApillonConfig } from '../lib/apillon';
import { Hosting } from '../modules/hosting/hosting';
import { DeployToEnvironment } from '../types/hosting';
import { getConfig, getWebsiteUUID } from './helpers/helper';
import { HostingWebsite } from '../modules/hosting/hosting-website';

describe('Hosting tests', () => {
  let config: ApillonConfig;
  let websiteUUID: string;

  beforeAll(async () => {
    config = getConfig();
    websiteUUID = getWebsiteUUID();
  });

  test('get all websites', async () => {
    const hosting = new Hosting(config);
    const websites = await hosting.listWebsites();
    expect(websites.length).toBeGreaterThan(0);
    expect(websites[0]).toBeInstanceOf(HostingWebsite);
    expect(websites[0].name).toBeTruthy();
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

  test('get deployment status', async () => {
    const hosting = new Hosting(config);
    const website = hosting.website(websiteUUID);

    const deployment = await website.getDeployment('e21a8e4e-bfce-4e63-b65b-59404d4fc6b4');
    expect(deployment.environment).toEqual(DeployToEnvironment.TO_STAGING);
  });
});
