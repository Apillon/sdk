import { resolve } from 'path';
import { Hosting } from '../modules/hosting/hosting';
import { DeployToEnvironment, DeploymentStatus } from '../types/hosting';
import { getConfig, getWebsiteUUID } from './helpers/helper';
import { HostingWebsite } from '../modules/hosting/hosting-website';
import * as fs from 'fs';

describe('Hosting tests', () => {
  let hosting: Hosting;
  let websiteUuid: string;
  let deploymentUuid: string;

  beforeAll(async () => {
    hosting = new Hosting(getConfig());
    websiteUuid = getWebsiteUUID();
  });

  test('get all websites', async () => {
    const { items } = await hosting.listWebsites();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toBeInstanceOf(HostingWebsite);
    expect(items[0].name).toBeTruthy();
  });

  test('get website info', async () => {
    const website = await hosting.website(websiteUuid).get();
    expect(website).toBeInstanceOf(HostingWebsite);
    expect(website.name).toBeTruthy();
    expect(website.uuid).toBeTruthy();
  });

  test.only('upload website from folder', async () => {
    const website = hosting.website(websiteUuid);

    const uploadDir = resolve(__dirname, './helpers/website/');
    await website.uploadFromFolder(uploadDir, { ignoreFiles: false });
    const deployment = await website.deploy(
      DeployToEnvironment.STAGING_TO_PRODUCTION,
    );
    expect(deployment.environment).toEqual(
      DeployToEnvironment.STAGING_TO_PRODUCTION,
    );
    deploymentUuid = deployment.uuid;

    await website.get();
    expect(website.lastDeploymentStatus).toEqual(DeploymentStatus.INITIATED);
  });

  test('upload files from buffer', async () => {
    const html = fs.readFileSync(
      resolve(__dirname, './helpers/website/index.html'),
    );
    const css = fs.readFileSync(
      resolve(__dirname, './helpers/website/style.css'),
    );
    console.time('File upload complete');
    await hosting.website(websiteUuid).uploadFiles([
      {
        fileName: 'index.html',
        contentType: 'text/html',
        content: html,
      },
      {
        fileName: 'style.css',
        contentType: 'text/css',
        content: css,
      },
    ]);
    console.timeEnd('File upload complete');
  });

  test('list all deployments', async () => {
    const website = hosting.website(websiteUuid);

    const { items } = await website.listDeployments({
      environment: DeployToEnvironment.TO_STAGING,
    });
    expect(
      items.every((d) => d.environment === DeployToEnvironment.TO_STAGING),
    );
  });

  test('get deployment status', async () => {
    const website = hosting.website(websiteUuid);

    const deployment = await website.deployment(deploymentUuid).get();
    expect(deployment.environment).toEqual(DeployToEnvironment.TO_STAGING);
  });

  test('generate short url', async () => {
    const targertUrl = 'https://ipfs.apillon.io/ipfs/abc';

    const shortUrl = await hosting.generateShortUrl(targertUrl);
    expect(shortUrl.id).toBeDefined();
    expect(shortUrl.targetUrl).toBe(targertUrl);
    expect(shortUrl.url).toContain(shortUrl.id);
  });
});
