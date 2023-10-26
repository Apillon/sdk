import { AxiosInstance } from 'axios';
import { ApillonLogger } from '../../lib/apillon';
import { DeployToEnvironment, DeploymentStatus } from '../../docs-index';
import { LogLevel } from '../../types/apillon';

export class Deployment {
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
  public websiteUuid: string = null;

  /**
   * @dev Unique identifier of the deployment.
   */
  public uuid: string = null;

  /**
   * IPFS CID for the deployment.
   */
  public cid: string = null;

  /**
   * IPFS V1 CID for the deployment.
   */
  public cidv1: string = null;

  /**
   * Environment of the deployment
   */
  public environment: DeployToEnvironment = null;

  /**
   * Status of the deployment
   */
  public deploymentStatus: DeploymentStatus = null;

  /**
   * Size of the website in bytes
   */
  public size: number = null;

  /**
   * Serial number of the deployment for this environment
   */
  public number: number = null;

  /**
   * @dev Constructor which should only be called via HostingWebsite class.
   * @param uuid Unique identifier of the deployment.
   * @param api Axios instance set to correct rootUrl with correct error handling.
   */
  constructor(
    api: AxiosInstance,
    logger: ApillonLogger,
    websiteUuid: string,
    deploymentUuid: string,
    data: any,
  ) {
    this.api = api;
    this.logger = logger;
    this.websiteUuid = websiteUuid;
    this.uuid = deploymentUuid;
    this.API_PREFIX = `/hosting/websites/${websiteUuid}/deployments/${deploymentUuid}`;
    this.populate(data);
  }

  /**
   * Populates class properties via data object.
   * @param data Data object.
   */
  private populate(data: any) {
    if (data != null) {
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
   * @dev Gets deployment details.
   */
  async get(): Promise<Deployment> {
    this.logger.log(
      `Get deployment for website ${this.uuid}`,
      LogLevel.VERBOSE,
    );
    const { data } = await this.api.get(this.API_PREFIX);
    return this.populate(data.data);
  }
}
