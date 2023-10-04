import { ApillonConfig } from '../lib/apillon';
import { Hosting } from '../modules/hosting/hosting';
import { DeployToEnvironment } from '../types/hosting';
import { getConfig } from './helpers/helper';

describe.skip('Hosting tests', () => {
  let config: ApillonConfig;

  beforeAll(async () => {
    config = getConfig();
  });

  test('get website info', async () => {
    const hosting = new Hosting(config);
    try {
      const website = await hosting
        .website('8e1a512d-5672-4c2f-ad5e-60333498cde2')
        .get();
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
    const website = hosting.website('8e1a512d-5672-4c2f-ad5e-60333498cde2');
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
  //   const website = hosting.website('8e1a512d-5672-4c2f-ad5e-60333498cde2');

  //   const deployStatus = await website.deploy(DeployToEnvironment.TO_STAGING);
  //   console.log(deployStatus);
  // });

  test.only('get deployment status', async () => {
    const hosting = new Hosting(config);
    const website = hosting.website('8e1a512d-5672-4c2f-ad5e-60333498cde2');

    const deployStatus = await website.getDeployStatus('208');
    console.log(deployStatus);
  });
});
