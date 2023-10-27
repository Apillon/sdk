import { LogLevel } from '../types/apillon';
import { ApillonApi } from './apillon-api';
import { ApillonLogger } from './apillon-logger';

export interface ApillonConfig {
  key?: string;
  secret?: string;
  apiUrl?: string;
  logLevel?: LogLevel;
}

export class ApillonModule {
  public constructor(config?: ApillonConfig) {
    const defaultConfig: ApillonConfig = {
      key: process.env.APILLON_API_KEY,
      secret: process.env.APILLON_API_SECRET,
      apiUrl: process.env.APILLON_API_URL || 'https://api.apillon.io',
      logLevel: LogLevel.NONE,
    };

    const mergedConfig = { ...defaultConfig, ...config };

    ApillonApi.initialize(mergedConfig);
    ApillonLogger.initialize(mergedConfig.logLevel);
  }
}

export class ApillonModel {
  /**
   * @dev API url prefix for this class.
   */
  protected API_PREFIX: string = null;

  /**
   * @dev Unique identifier of the model.
   */
  public uuid: string;

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
}
