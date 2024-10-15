export interface ICreateCloudFunction {
  /**
   * Name of the cloud function.
   */
  name: string;
  /**
   * Description of the cloud function.
   */
  description: string;
}

export interface ISetCloudFunctionEnvironment {
  /**
   * Environment variables to set as key-value pairs.
   */
  environment: Record<string, string>;
}

/**
 * Interface for creating a cloud function job.
 */
export interface ICreateCloudFunctionJob {
  /**
   * Name of the cloud function job.
   */
  name: string;
  /**
   * Description of the cloud function job.
   */
  description: string;
  /**
   * CID of the script to be executed by the cloud function job.
   * @example 'bafybebcsl5d7wu3quxrsiwgxgyzpvknv5re2cqa6d4rybprhisomu3r5he'
   */
  scriptCid: string;
  /**
   * Number of processors to use for the cloud function job.
   * @default 1
   */
  slots: number;
}

export enum JobStatus {
  DEPLOYING = 1,
  DEPLOYED = 2,
  MATCHED = 3,
  INACTIVE = 4,
  DELETED = 9,
}
