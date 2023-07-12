import axios, { AxiosInstance } from 'axios';

export interface ApillonConfig {
  key?: string;
  secret?: string;
  apiUrl?: string;
}

export class ApillonApiError extends Error {}
export class ApillonRequestError extends Error {}
export class ApillonNetworkError extends Error {}

export class ApillonModule {
  protected api: AxiosInstance;
  private config: ApillonConfig;

  public constructor(config?: ApillonConfig) {
    const defaultOptions: ApillonConfig = {
      key: process.env.APILLON_API_KEY,
      secret: process.env.APILLON_API_SECRET,
      apiUrl: process.env.APILLON_API_URL || 'https://api.apillon.io',
    };

    this.config = { ...defaultOptions, ...config };

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
        throw new ApillonRequestError(error.request);
      },
    );

    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
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
