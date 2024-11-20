import { ApillonModule, ICreateApillonModel } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList, IApillonPagination } from '../../types/apillon';
import { RpcEndpoint } from '../../types/rpc';
import { RpcApiKey } from './rpc-api-key';

export class Rpc extends ApillonModule {
  /**
   * API URL for RPC module.
   */
  private API_PREFIX = '/rpc';

  /**
   * List all API keys for RPC.
   * @param {IApillonPagination} params - The query parameters for filtering API keys.
   * @returns The list of API keys.
   */
  public async listApiKeys(
    params?: IApillonPagination,
  ): Promise<IApillonList<RpcApiKey>> {
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/api-key`,
      params,
    );

    const data = await ApillonApi.get<IApillonList<RpcApiKey>>(url);

    return {
      ...data,
      items: data.items.map((apiKey) => new RpcApiKey(apiKey.id, apiKey)),
    };
  }

  /**
   * Create a new API key for RPC module.
   * @param {ApillonApiCreateRpcApiKeyDto} data - The data for creating an API key.
   * @returns The created API key.
   */
  public async createApiKey(data: ICreateApillonModel): Promise<any> {
    const apiKey = await ApillonApi.post<any>(
      `${this.API_PREFIX}/api-key`,
      data,
    );
    return new RpcApiKey(apiKey.uuid, apiKey);
  }

  /**
   * Get all available endpoints for the RPC service.
   * @returns The list of endpoints.
   */
  public async listEndpoints(): Promise<RpcEndpoint[]> {
    return await ApillonApi.get<RpcEndpoint[]>(`${this.API_PREFIX}/endpoints`);
  }

  /**
   * @param id Unique API key identifier.
   * @returns An empty instance of RpcApiKey.
   */
  public apiKey(id: number): RpcApiKey {
    return new RpcApiKey(id, null);
  }
}
