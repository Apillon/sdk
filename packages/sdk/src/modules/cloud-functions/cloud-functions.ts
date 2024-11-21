import { ApillonModule, ICreateApillonModel } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList, IApillonPagination } from '../../types/apillon';
import { CloudFunction } from './cloud-function';
import { CloudFunctionJob } from './cloud-function-job';

export class CloudFunctions extends ApillonModule {
  /**
   * API url for cloud functions.
   */
  private API_PREFIX = '/cloud-functions';

  /**
   * Lists all cloud functions.
   * @param {IApillonPagination} params Filter for listing cloud functions.
   * @returns Array of CloudFunction objects.
   */
  public async listCloudFunctions(
    params?: IApillonPagination,
  ): Promise<IApillonList<CloudFunction>> {
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const data = await ApillonApi.get<
      IApillonList<CloudFunction & { functionUuid: string }>
    >(url);

    return {
      ...data,
      items: data.items.map((cf) => {
        const cloudFunction = new CloudFunction(cf.functionUuid, cf);
        delete cloudFunction.jobs;
        return cloudFunction;
      }),
    };
  }

  /**
   * Creates a new cloud function based on the provided data.
   * @param {ICreateApillonModel} data Data for creating the cloud function.
   * @returns {CloudFunction} Newly created cloud function.
   */
  public async createCloudFunction(
    data: ICreateApillonModel,
  ): Promise<CloudFunction> {
    const cloudFunction = await ApillonApi.post<
      CloudFunction & { functionUuid: string }
    >(this.API_PREFIX, data);
    return new CloudFunction(cloudFunction.functionUuid, cloudFunction);
  }

  /**
   * Gets a specific cloud function.
   * @param {string} uuid Unique identifier of the cloud function.
   * @returns {CloudFunction} An empty instance of CloudFunction.
   */
  public cloudFunction(uuid: string): CloudFunction {
    return new CloudFunction(uuid);
  }

  /**
   * Gets a specific cloud function job.
   * @param {string} uuid Unique identifier of the cloud function job.
   * @returns {CloudFunctionJob} An empty instance of CloudFunctionJob.
   */
  public cloudFunctionJob(uuid: string): CloudFunctionJob {
    return new CloudFunctionJob(uuid);
  }
}
