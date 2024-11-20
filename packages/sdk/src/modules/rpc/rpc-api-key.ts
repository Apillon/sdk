import { ApillonModel } from '../../lib/apillon';

export class RpcApiKey extends ApillonModel {
  /**
   * Unique identifier of the RPC API key.
   */
  public id: number = null;

  /**
   * Name of the RPC API key.
   */
  public name: string = null;

  /**
   * Description of the RPC API key.
   */
  public description: string = null;

  /**
   * Unique identifier of the project.
   */
  public projectUuid: string = null;

  /**
   * Unique identifier of the RPC API key, used for RPC calls.
   */
  public uuid: string = null;

  /**
   * Array of favorite URLs for the RPC API key.
   */
  public urls: string[] = [];

  /**
   * Constructor which should only be called via Rpc class.
   * @param id Unique identifier of the RPC API key.
   * @param data Data to populate RPC API key with.
   */
  constructor(id: number, data?: Partial<RpcApiKey>) {
    super(id.toString());
    this.API_PREFIX = `/rpc/api-key/${id}`;
    this.populate(data);
  }
}
