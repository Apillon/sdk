import { ApillonApi } from '../../lib/apillon-api';
import { ApillonModel } from '../../lib/apillon';
import { ApillonLogger } from '../../lib/apillon-logger';
import { JobStatus } from '../../types/cloud-functions';

export class CloudFunctionJob extends ApillonModel {
  /**
   * Unique identifier of the cloud function.
   */
  public functionUuid: string = null;

  /**
   * Name of the job.
   */
  public name: string = null;

  /**
   * CID of the script to be executed by the job.
   */
  public scriptCid: string = null;

  /**
   * Number of processors to use for the job.
   */
  public slots: number = null;

  /**
   * Status of the job.
   */
  public jobStatus: JobStatus = null;

  constructor(uuid: string, data: Partial<CloudFunctionJob>) {
    super(uuid);
    this.API_PREFIX = `/cloud-functions/jobs/${uuid}`;
    this.populate(data);
  }

  /**
   * Deletes a specific job.
   * @returns {Promise<void>}
   */
  public async delete(): Promise<void> {
    await ApillonApi.delete<void>(this.API_PREFIX);
    ApillonLogger.log(`Job with UUID: ${this.uuid} successfully deleted`);
  }

  protected override serializeFilter(key: string, value: any) {
    const serialized = super.serializeFilter(key, value);
    const enums = {
      jobStatus: JobStatus[value],
    };
    return Object.keys(enums).includes(key) ? enums[key] : serialized;
  }
}
