import { ApillonModel } from '../../lib/apillon';
import { DeployToEnvironment, DeploymentStatus } from '../../types/hosting';

export class Deployment extends ApillonModel {
  /**
   * Unique identifier of the website.
   */
  public websiteUuid: string = null;

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
   * Constructor which should only be called via HostingWebsite class.
   * @param websiteUuid Unique identifier of the deployment's website.
   * @param deploymentUuid Unique identifier of the deployment.
   * @param data Data to populate the deployment with.
   */
  constructor(
    websiteUuid: string,
    deploymentUuid: string,
    data?: Partial<Deployment>,
  ) {
    super(deploymentUuid);
    this.websiteUuid = websiteUuid;
    this.API_PREFIX = `/hosting/websites/${websiteUuid}/deployments/${deploymentUuid}`;
    this.populate(data);
  }

  protected override serializeFilter(key: string, value: any) {
    const serialized = super.serializeFilter(key, value);
    const enums = {
      environment: DeployToEnvironment[value],
      deploymentStatus: DeploymentStatus[value],
    };
    return Object.keys(enums).includes(key) ? enums[key] : serialized;
  }
}
