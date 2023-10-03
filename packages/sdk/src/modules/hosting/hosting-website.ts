import { AxiosInstance } from 'axios';
import { listFilesRecursive, uploadFilesToS3 } from '../../lib/common';
import { DeployToEnvironment } from '../../types/hosting';

export class HostingWebsite {
  /**
   * Axios instance set to correct rootUrl with correct error handling.
   */
  protected api: AxiosInstance;

  /**
   * @dev API url prefix for this class.
   */
  private API_PREFIX = '/hosting/websites';

  /**
   * @dev Unique identifier of the website.
   */
  public uuid;

  /**
   * @dev User assigned name of the website.
   */
  public name: string = null;

  /**
   * @dev User assigned description of the website.
   */
  public description: string = null;

  /**
   * @dev Domain on which this website lives.
   */
  public domain: string = null;

  /**
   * @dev Unique identifier of a storage bucket in which this website files reside.
   */
  public bucketUuid: string = null;

  /**
   * @dev IPNS CID for staging environment.
   */
  public ipnsStaging: string = null;

  /**
   * @dev IPNS CID for production environment.
   */
  public ipnsProduction: string = null;

  /**
   * @dev Constructor which should only be called via Hosting class.
   * @param uuid Unique identifier of the website.
   * @param api Axios instance set to correct rootUrl with correct error handling.
   */
  constructor(uuid: string, api: AxiosInstance) {
    this.api = api;
    this.uuid = uuid;
  }

  /**
   * @dev Gets information about the website and fills properties with it.
   * @returns An instance of HostingWebsite class with filled properties.
   */
  public async get(): Promise<HostingWebsite> {
    const data = (await this.api.get(`${this.API_PREFIX}/${this.uuid}`)).data;
    this.name = data.data?.name;
    this.description = data.data?.description;
    this.domain = data.data?.domain;
    this.bucketUuid = data.data?.bucketUuid;
    this.ipnsStaging = data.data?.ipnsStaging;
    this.ipnsProduction = data.data?.ipnsProduction;
    return this;
  }

  /**
   * @dev Uploads website files inside a folder via path.
   * @param folderPath Path to the folder to upload.
   */
  public async uploadFromFolder(folderPath: string): Promise<void> {
    console.log(
      `Preparing to upload files from ${folderPath} to website ${this.uuid} ...`,
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
      `${this.API_PREFIX}/${this.uuid}/upload`,
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
      `${this.API_PREFIX}/${this.uuid}/upload/${sessionUuid}/end`,
    );
    console.log('Session ended.');

    if (!respEndSession.data?.data) {
      throw new Error();
    }
  }

  public async deploy(toEnvironment: DeployToEnvironment): Promise<any> {
    //
    console.log(
      `Deploying website ${this.uuid} to IPFS (${
        toEnvironment === DeployToEnvironment.TO_STAGING
          ? 'preview'
          : 'production'
      })`,
    );

    console.time('Deploy complete');
    const resp = await this.api.post(`${this.API_PREFIX}/${this.uuid}/deploy`, {
      environment: toEnvironment,
    });

    console.timeEnd('Deploy complete');

    return resp.data?.data;
  }

  public async getDeployStatus(deploymentId: string) {
    //
    console.log('Get deployments for website ', this.uuid);
    return (
      await this.api.get(
        `${this.API_PREFIX}/${this.uuid}/deployments/${deploymentId}`,
      )
    ).data;
  }
}
