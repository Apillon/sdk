import axios, { AxiosInstance } from 'axios';
import { LogLevel } from '../types/apillon';

export interface ApillonConfig {
  key?: string;
  secret?: string;
  apiUrl?: string;
  logLevel?: LogLevel;
}

export class ApillonApiError extends Error {}
export class ApillonRequestError extends Error {}
export class ApillonNetworkError extends Error {}

export class ApillonModule {
  protected api: AxiosInstance;
  protected logger: ApillonLogger;
  private config: ApillonConfig;

  public constructor(config?: ApillonConfig) {
    const defaultOptions: ApillonConfig = {
      key: process.env.APILLON_API_KEY,
      secret: process.env.APILLON_API_SECRET,
      apiUrl: process.env.APILLON_API_URL || 'https://api.apillon.io',
      logLevel: LogLevel.NONE,
    };

    this.config = { ...defaultOptions, ...config };
    this.logger = new ApillonLogger(this.config.logLevel);

    let auth = undefined;
    if (this.config.key && this.config.secret) {
      auth = {
        username: this.config.key,
        password: this.config.secret,
      };
    }

    this.api = axios.create({
      baseURL: this.config.apiUrl,
      headers: {
        'content-type': 'application/json',
      },
      auth,
    });

    this.api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        this.logger.log(error, LogLevel.ERROR);
        throw new ApillonRequestError(error.request);
      },
    );

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        this.logger.log(error, LogLevel.ERROR);
        if (error.response?.data) {
          throw new ApillonApiError(
            JSON.stringify(error.response.data, null, 2),
          );
        } else {
          throw new ApillonNetworkError(error.message);
        }
      },
    );
  }
}

export class ApillonLogger {
  private logLevel: LogLevel = LogLevel.NONE;
  constructor(logLevel?: LogLevel) {
    this.logLevel = logLevel || LogLevel.NONE;
  }

  log(message: any, logLevel: LogLevel) {
    if (this.logLevel >= logLevel) {
      if (message instanceof Object) {
        console.log(JSON.stringify(message));
      } else {
        console.log(message);
      }
    }
  }
  logWithTime(message: any, logLevel: LogLevel) {
    if (this.logLevel >= logLevel) {
      if (message instanceof Object) {
        console.log(`${new Date().toISOString()}: `, JSON.stringify(message));
      } else {
        console.log(`${new Date().toISOString()}: `, message);
      }
    }
  }
}
