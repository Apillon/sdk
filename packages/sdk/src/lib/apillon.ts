import { LogLevel } from '../types/apillon';
import { ApillonApi } from './apillon-api';
import { ApillonLogger } from './apillon-logger';

export interface ApillonConfig {
  /**
   * Your API key, generated through the Apillon dashboard
   * @default env.APILLON_API_KEY
   */
  key?: string;
  /**
   * Your API secret, generated through the Apillon dashboard
   * @default env.APILLON_API_SECRET
   */
  secret?: string;
  /**
   * The API URL to use for executing the queries and actions.
   * @default https://api.apillon.io
   */
  apiUrl?: string;
  /**
   * The level of logger output to use for the Apillon logger.
   * @default ERROR
   */
  logLevel?: LogLevel;
  /**
   * Used for CLI - indicates whether to output verbose logs
   * @default false
   */
  debug?: boolean;
}

export class ApillonModule {
  protected config: ApillonConfig;

  public constructor(config?: ApillonConfig) {
    this.config = ApillonApi.initialize(config);
    ApillonLogger.initialize(
      config?.debug ? LogLevel.VERBOSE : config?.logLevel || LogLevel.ERROR,
    );
  }
}

export class ApillonModel {
  /**
   * API url prefix for this class.
   */
  protected API_PREFIX: string = null;

  /**
   * Unique identifier of the model.
   */
  public uuid: string;

  /**
   * The object's creation date
   */
  public createTime: string = null;

  /**
   * The date when the object was last updated
   */
  public updateTime: string = null;

  constructor(uuid: string) {
    this.uuid = uuid;
  }

  /**
   * Populates class properties via data object.
   * @param data Data object.
   */
  protected populate(data: object) {
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
   * Convert object to JSON output, with unnecessary properties excluded
   */
  public serialize() {
    return JSON.parse(JSON.stringify(this, this.serializeFilter));
  }

  /**
   * Define and exclude custom keys from serialized object
   */
  protected serializeFilter(key: string, value: any) {
    const excludedKeys = ['API_PREFIX'];
    return excludedKeys.includes(key) ? undefined : value;
  }
}
