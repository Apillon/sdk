import { ApillonConfig } from '../lib/apillon';
import { Hosting } from '../modules/hosting/hosting';
import { DeployToEnvironment } from '../types/hosting';
import { getConfig, getWebsiteUUID } from './helpers/helper';

describe('Hosting tests', () => {
  let config: ApillonConfig;
  let websiteUUID: string;

  beforeAll(async () => {
    config = getConfig();
    websiteUUID = getWebsiteUUID();
  });

  test.only('get website info', async () => {
    const hosting = new Hosting(config);
    try {
      const website = await hosting.website(websiteUUID).get();
      console.log(website);
      console.log(website.name);
      console.log(website.bucketUuid);
      console.log(website.ipnsProduction);
      console.log(website.ipnsStaging);
    } catch (e) {
      console.log(e);
    }
  });

  test('upload website from folder', async () => {
    const hosting = new Hosting(config);
    const website = hosting.website(websiteUUID);
    try {
      await website.uploadFromFolder('./src/tests/helpers/website/');
    } catch (e) {
      console.log(e);
    }
    const deploymentId = await website.deploy(DeployToEnvironment.TO_STAGING);
    console.log(deploymentId);
  });

  // test('get deployment status', async () => {
  //   const hosting = new Hosting(config);
  //   const website = hosting.website(websiteUUID);

  //   const deployStatus = await website.deploy(DeployToEnvironment.TO_STAGING);
  //   console.log(deployStatus);
  // });

  test.only('get deployment status', async () => {
    const hosting = new Hosting(config);
    const website = hosting.website(websiteUUID);

    const deployStatus = await website.getDeployStatus('208');
    console.log(deployStatus);
  });
});
