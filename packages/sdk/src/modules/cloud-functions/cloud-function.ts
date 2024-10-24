import { CloudFunctionJob } from './cloud-function-job';
import { ApillonApi } from '../../lib/apillon-api';
import { ApillonModel } from '../../lib/apillon';
import { ICreateCloudFunctionJob } from '../../types/cloud-functions';
import { ApillonLogger } from '../../lib/apillon-logger';

export class CloudFunction extends ApillonModel {
  /**
   * Unique identifier of the bucket where the cloud function code is stored
   */
  public bucketUuid: string = null;

  /**
   * Name of the cloud function
   */
  public name: string = null;

  /**
   * Description of the cloud function
   */
  public description: string = null;

  /**
   * Gateway URL of the cloud function, for triggering job execution
   */
  public gatewayUrl: string = null;

  /**
   * List of jobs associated with the cloud function
   */
  public jobs: CloudFunctionJob[] = [];

  /**
   * Constructor which should only be called via CloudFunctions class
   * @param data Data to populate cloud function with
   */
  constructor(uuid: string, data?: Partial<CloudFunction>) {
    super(uuid);
    this.API_PREFIX = `/cloud-functions/${this.uuid}`;
    this.populate(data);
    this.gatewayUrl = `https://${this.uuid}.${process.env.ACURAST_GATEWAY_URL}`;
  }

  /**
   * Gets and populates cloud function details.
   * @returns CloudFunction instance
   */
  public override async get(): Promise<this> {
    const data = await ApillonApi.get<any>(this.API_PREFIX);
    this.jobs = data.jobs.map((job) => new CloudFunctionJob(job.jobUuid, job));
    return this.populate(data);
  }

  /**
   * Sets environment variables for a specific cloud function
   * @param {{ key: string; value: string }[]} variables Environment variables to set
   * @returns {Promise<void>}
   */
  public async setEnvironment(
    variables: { key: string; value: string }[],
  ): Promise<void> {
    await ApillonApi.post<void>(`${this.API_PREFIX}/environment`, {
      variables,
    });
    ApillonLogger.log(
      `Environment variables for cloud function with UUID: ${this.uuid} successfully set`,
    );
  }

  /**
   * Creates a new job for a specific cloud function
   * @param {CreateJobDto} body Data for creating the job
   * @returns {Promise<CloudFunctionJob>} Newly created cloud function job
   */
  public async createJob(
    body: ICreateCloudFunctionJob,
  ): Promise<CloudFunctionJob> {
    const job = await ApillonApi.post<CloudFunctionJob & { jobUuid: string }>(
      `${this.API_PREFIX}/jobs`,
      body,
    );
    return new CloudFunctionJob(job.jobUuid, job);
  }
}
