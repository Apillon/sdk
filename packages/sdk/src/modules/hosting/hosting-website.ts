import { AxiosInstance } from 'axios';
import { constructUrlWithQueryParams, listFilesRecursive, uploadFilesToS3 } from '../../lib/common';
import { DeployToEnvironment, IDeploymentFilters } from '../../types/hosting';
import { ApillonLogger } from '../../index';
import { IApillonList, LogLevel } from '../../types/apillon';
import { Deployment } from './deployment';

export class HostingWebsite {
  /**
   * Axios instance set to correct rootUrl with correct error handling.
   */
  protected api: AxiosInstance;

  /**
   * Logger.
   */
  protected logger: ApillonLogger;

  /**
   * @dev API url prefix for this class.
   */
  private API_PREFIX: string = null;

  /**
   * @dev Unique identifier of the website.
   */
  public uuid: string;

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
  constructor(api: AxiosInstance, logger: ApillonLogger, uuid: string, data?: Partial<HostingWebsite>) {
    this.api = api;
    this.uuid = uuid;
    this.logger = logger;
    this.populate(data);
    this.API_PREFIX = `/hosting/websites/${uuid}`;
  }

  /**
   * Populates class properties via data object.
   * @param data Data object.
   */
  private populate(data: any) {
    if (!data != null) {
      Object.keys(data || {}).forEach((key) => {
        const prop = this[key];
        if (prop === null) {
          this[key] = data[key];
        }
      });
    }
    return this;
  }

  /**
   * @dev Gets information about the website and fills properties with it.
   * @returns An instance of HostingWebsite class with filled properties.
   */
  public async get(): Promise<HostingWebsite> {
    const { data } = (await this.api.get(this.API_PREFIX)).data;
    return this.populate(data);
  }

  /**
   * @dev Uploads website files inside a folder via path.
   * @param folderPath Path to the folder to upload.
   */
  public async uploadFromFolder(folderPath: string): Promise<void> {
    this.logger.log(
      `Preparing to upload files from ${folderPath} to website ${this.uuid} ...`,
      LogLevel.VERBOSE,
    );

    let files;
    try {
      files = listFilesRecursive(folderPath);
    } catch (err) {
      this.logger.log(err, LogLevel.ERROR);
      throw new Error(`Error reading files in ${folderPath}`);
    }

    const data = { files };
    this.logger.log(`Files to upload: ${data.files.length}`, LogLevel.VERBOSE);

    this.logger.logWithTime('Get upload links', LogLevel.VERBOSE);
    const resp = await this.api.post(`${this.API_PREFIX}/upload`, data);

    this.logger.logWithTime('Got upload links', LogLevel.VERBOSE);

    // console.log(resp);
    const sessionUuid = resp.data.data.sessionUuid;

    this.logger.logWithTime('File upload complete', LogLevel.VERBOSE);
    await uploadFilesToS3(resp.data.data.files, files);
    this.logger.logWithTime('File upload complete', LogLevel.VERBOSE);

    this.logger.log('Closing session...', LogLevel.VERBOSE);
    const respEndSession = await this.api.post(
      `${this.API_PREFIX}/upload/${sessionUuid}/end`,
    );
    this.logger.log('Session ended.', LogLevel.VERBOSE);

    if (!respEndSession.data.data) {
      throw new Error();
    }
  }

  /**
   * @dev Deploy a website to a new environment.
   * @param {DeployToEnvironment} toEnvironment The environment to deploy to
   * @returns The new deployment instance
   */
  public async deploy(toEnvironment: DeployToEnvironment): Promise<any> {
    this.logger.log(
      `Deploying website ${this.uuid} to IPFS (${toEnvironment === DeployToEnvironment.TO_STAGING
        ? 'preview'
        : 'production'
      })`,
      LogLevel.VERBOSE,
    );

    this.logger.logWithTime('Deploy start', LogLevel.VERBOSE);
    const { data } = await this.api.post(`${this.API_PREFIX}/deploy`, {
      environment: toEnvironment,
    });

    this.logger.logWithTime('Deploy complete', LogLevel.VERBOSE);

    return data.data;
  }

  /**
   * @dev Returns an list of websites.
   * @param {IWebsiteFilters} params Query filters for listing websites
   * @returns A list of all deployments instances.
   */
  public async listDeployments(params?: IDeploymentFilters): Promise<IApillonList<any>> {
    const url = constructUrlWithQueryParams(`${this.API_PREFIX}/deployments`, params);

    const { data } = await this.api.get(url);

    return {
      items: data.data.items.map(
        item => new Deployment(this.api, this.logger, item.websiteUuid, item.deploymentUuid, item)
      ),
      total: data.data.total
    }
  }

  /**
   * Gets a deployment instance.
   * @param deploymentUuid Uuid of the deployment.
   * @returns Instance of a deployment.
   */
  deployment(deploymentUuid: string): Deployment {
    return new Deployment(this.api, this.logger, this.uuid, deploymentUuid, {});
  }
}
