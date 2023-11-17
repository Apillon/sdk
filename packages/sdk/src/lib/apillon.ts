import { LogLevel } from '../types/apillon';
import { ApillonApi } from './apillon-api';
import { ApillonLogger } from './apillon-logger';

export interface ApillonConfig {
  key?: string;
  secret?: string;
  apiUrl?: string;
  logLevel?: LogLevel;
  debug?: boolean;
}

export class ApillonModule {
  public constructor(config?: ApillonConfig) {
    const defaultConfig: ApillonConfig = {
      key: process.env.APILLON_API_KEY,
      secret: process.env.APILLON_API_SECRET,
      apiUrl: process.env.APILLON_API_URL || 'https://api.apillon.io',
      logLevel: LogLevel.ERROR,
      debug: false,
    };

    const mergedConfig = { ...defaultConfig, ...config };

    ApillonApi.initialize(mergedConfig);
    ApillonLogger.initialize(
      mergedConfig.debug ? LogLevel.VERBOSE : mergedConfig.logLevel,
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
  public createTime: Date = null;

  /**
   * The date when the object was last updated
   */
  public updateTime: Date = null;

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

  public serialize() {
    return JSON.parse(JSON.stringify(this, this.serializeFilter));
  }

  protected serializeFilter(key: string, value: any) {
    const excludedKeys = ['API_PREFIX'];
    return excludedKeys.includes(key) ? undefined : value;
  }
}
