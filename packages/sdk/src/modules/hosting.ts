import { listFilesRecursive, uploadFilesToS3 } from '../lib/common';
import { ApillonModule } from './apillon';

export enum DeployToEnvironment {
  TO_STAGING = 1,
  STAGING_TO_PRODUCTION = 2,
  DIRECTLY_TO_PRODUCTION = 3,
}

export class Hosting extends ApillonModule {
  public async createWebsite() {
    throw Error('Not implemented');
  }

  public async getWebsite(websiteUuid) {
    throw Error('Not implemented');
  }

  public async updateWebsite(websiteUuid, params) {
    throw Error('Not implemented');
  }

  public async uploadFromFolder(websiteUuid: string, folderPath: string) {
    console.log(
      `Preparing to upload files from ${folderPath} to website ${websiteUuid} ...`,
    );
    let files;
    try {
      files = listFilesRecursive(folderPath);
    } catch (err) {
      console.error(err);
      throw new Error(`Error reading files in ${folderPath}`);
    }

    const data = { files };
    console.log(`Files to upload: ${data.files.length}`);

    console.time('Got upload links');
    const resp = await this.api.post(
      `/hosting/websites/${websiteUuid}/upload`,
      data,
    );

    console.timeEnd('Got upload links');

    // console.log(resp);
    const sessionUuid = resp.data.data.sessionUuid;

    console.time('File upload complete');
    await uploadFilesToS3(resp.data.data.files, files);
    console.timeEnd('File upload complete');

    console.log('Closing session...');
    const respEndSession = await this.api.post(
      `/hosting/websites/${websiteUuid}/upload/${sessionUuid}/end`,
    );
    console.log('Session ended.');
    return respEndSession.data?.data;
  }

  public async deployWebsite(
    websiteUuid: string,
    toEnvironment: DeployToEnvironment,
  ) {
    //
    console.log(
      `Deploying website ${websiteUuid} to IPFS (${
        toEnvironment === DeployToEnvironment.TO_STAGING
          ? 'preview'
          : 'production'
      })`,
    );

    console.time('Deploy complete');
    const resp = await this.api.post(
      `/hosting/websites/${websiteUuid}/deploy`,
      {
        environment: toEnvironment,
      },
    );

    console.timeEnd('Deploy complete');

    return resp.data.data;
  }

  public async getWebsiteDeployments(
    websiteUuid: string,
    deploymentId?: string,
  ) {
    //
    console.log('Get deployments for website ', websiteUuid);
    return (
      await this.api.get(
        `/hosting/websites/${websiteUuid}/deployments/${deploymentId}`,
      )
    ).data;
  }
}
