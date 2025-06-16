import { constructUrlWithQueryParams } from '../../lib/common';
import {
  DeployToEnvironment,
  DeploymentStatus,
  IDeploymentFilters,
} from '../../types/hosting';
import { IApillonList } from '../../types/apillon';
import { Deployment } from './deployment';
import { ApillonApi } from '../../lib/apillon-api';
import { ApillonLogger } from '../../lib/apillon-logger';
import { uploadFiles } from '../../util/file-utils';
import { ApillonModel } from '../../lib/apillon';
import { FileMetadata, IDeployRequest, IFileUploadRequest } from '../../types/storage';

export class HostingWebsite extends ApillonModel {
  /**
   * User assigned name of the website.
   */
  public name: string = null;

  /**
   * User assigned description of the website.
   */
  public description: string = null;

  /**
   * Domain on which this website lives.
   */
  public domain: string = null;

  /**
   * Unique identifier of a storage bucket in which this website files reside.
   */
  public bucketUuid: string = null;

  /**
   * IPNS CID for staging environment.
   * @deprecated - Use `cidStaging` instead
   */
  public ipnsStaging: string = null;

  /**
   * IPFS CID for staging environment.
   */
  public cidStaging: string = null;

  /**
   * IPFS CID for production environment.
   */
  public cidProduction: string = null;

  /**
   * IPNS CID for production environment.
   */
  public ipnsProduction: string = null;

  /**
   * Link to staging version of the website
   */
  public w3StagingLink: string = null;

  /**
   * Link to production version of the website
   */
  public w3ProductionLink: string = null;

  /**
   * Website last deployment (to any environment) unique identifier
   */
  public lastDeploymentUuid: string = null;

  /**
   * Status of last deployment
   */
  public lastDeploymentStatus: DeploymentStatus = null;

  /**
   * Constructor which should only be called via Hosting class.
   * @param uuid Unique identifier of the website.
   * @param data Data to populate the website with.
   */
  constructor(uuid: string, data?: Partial<HostingWebsite>) {
    super(uuid);
    this.API_PREFIX = `/hosting/websites/${uuid}`;
    this.populate(data);
  }

  /**
   * Uploads website files inside a folder via path.
   * @param folderPath Path to the folder to upload.
   * @param {IFileUploadRequest} params - Optional parameters to be used for uploading files
   */
  public async uploadFromFolder(
    folderPath: string,
    params?: IFileUploadRequest,
  ): Promise<void> {
    await uploadFiles({ apiPrefix: this.API_PREFIX, folderPath, params });
  }

  /**
   * Uploads files to the hosting bucket.
   * @param {FileMetadata[]} files - The files to be uploaded
   * @param {IFileUploadRequest} params - Optional parameters to be used for uploading files
   */
  public async uploadFiles(
    files: FileMetadata[],
    params?: IFileUploadRequest,
  ): Promise<void> {
    await uploadFiles({ apiPrefix: this.API_PREFIX, params, files });
  }

  /**
   * Deploy a website to a new environment.
   * @param {DeployToEnvironment} toEnvironment The environment to deploy to
   * @returns Newly created deployment
   */
  public async deploy(toEnvironment: DeployToEnvironment, params?: IDeployRequest) {
    ApillonLogger.log(
      `Deploying website ${this.uuid} to IPFS (${
        toEnvironment === DeployToEnvironment.TO_STAGING
          ? 'preview'
          : 'production'
      })`,
    );

    ApillonLogger.logWithTime('Initiating deployment');
    const data = await ApillonApi.post<Deployment & { deploymentUuid: string }>(
      `${this.API_PREFIX}/deploy`,
      { environment: toEnvironment, ...params },
    );

    ApillonLogger.logWithTime('Deployment in progress');

    return new Deployment(this.uuid, data.deploymentUuid, data);
  }

  /**
   * @param {IWebsiteFilters} params Query filters for listing websites
   * @returns A list of all deployments instances.
   */
  public async listDeployments(
    params?: IDeploymentFilters,
  ): Promise<IApillonList<Deployment>> {
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/deployments`,
      params,
    );

    const data = await ApillonApi.get<
      IApillonList<Deployment & { deploymentUuid: string }>
    >(url);

    return {
      ...data,
      items: data.items.map(
        (item) => new Deployment(item.websiteUuid, item.deploymentUuid, item),
      ),
    };
  }

  /**
   * Gets a deployment instance.
   * @param deploymentUuid Uuid of the deployment.
   * @returns Instance of a deployment.
   */
  deployment(deploymentUuid: string): Deployment {
    return new Deployment(this.uuid, deploymentUuid, {});
  }

  protected override serializeFilter(key: string, value: any) {
    const serialized = super.serializeFilter(key, value);
    const enums = {
      lastDeploymentStatus: DeploymentStatus[value],
    };
    return Object.keys(enums).includes(key) ? enums[key] : serialized;
  }
}
