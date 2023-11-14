import axios, { AxiosInstance } from 'axios';
import { ApillonConfig } from './apillon';
import { LogLevel } from '../types/apillon';
import { ApillonLogger } from './apillon-logger';
import {
  ApillonApiError,
  ApillonNetworkError,
  ApillonRequestError,
} from './common';

export class ApillonApi {
  private static instance: AxiosInstance;

  public static initialize(apiConfig?: ApillonConfig) {
    const defaultOptions: ApillonConfig = {
      key: process.env.APILLON_API_KEY,
      secret: process.env.APILLON_API_SECRET,
      apiUrl: process.env.APILLON_API_URL || 'https://api.apillon.io',
      logLevel: LogLevel.NONE,
    };

    const config = { ...defaultOptions, ...apiConfig };

    const auth =
      config.key && config.secret
        ? {
            username: config.key,
            password: config.secret,
          }
        : undefined;

    this.instance = axios.create({
      baseURL: config.apiUrl,
      headers: { 'content-type': 'application/json' },
      auth,
    });

    this.instance.interceptors.request.use(
      (request) => request,
      (error) => {
        ApillonLogger.log(error.message, LogLevel.ERROR);
        throw new ApillonRequestError(error.request);
      },
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // ApillonLogger.log(error, LogLevel.ERROR);
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

  public static async get<T>(url: string, config?: any): Promise<T> {
    const { data } = await this.instance.get<T>(url, config);
    return data;
  }

  public static async post<T>(
    url: string,
    body?: any,
    config?: any,
  ): Promise<T> {
    const { data } = await this.instance.post<T>(url, body, config);
    return data;
  }

  public static async delete<T>(url: string, config?: any): Promise<T> {
    const { data } = await this.instance.delete<T>(url, config);
    return data;
  }
}
