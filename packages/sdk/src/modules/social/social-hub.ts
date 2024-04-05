import { ApillonApi } from '../../lib/apillon-api';
import { ApillonModel } from '../../lib/apillon';
import { HubStatus } from '../../types/social';

export class SocialHub extends ApillonModel {
  /**
   * Hub ID on Subsocial chain.
   * @example https://grillapp.net/12927
   */
  public hubId: number = null;

  /**
   * Hub status (1: draft - deploying to chain, 5: active, 100: error).
   */
  public status: HubStatus = null;

  /**
   * Name of the hub.
   */
  public name: string = null;

  /**
   * Short description about the hub.
   */
  public about: string = null;

  /**
   * Comma separated tags associated with the hub.
   */
  public tags: string = null;

  /**
   * Number of channels in the hub.
   */
  public numOfChannels: number = null;

  constructor(uuid: string, data?: Partial<SocialHub>) {
    super(uuid);
    this.API_PREFIX = `/social/hubs/${uuid}`;
    this.populate(data);
  }

  /**
   * Fetches and populates the hub details from the API.
   * @returns An instance of Hub class with filled properties.
   */
  public async get(): Promise<SocialHub> {
    const data = await ApillonApi.get<SocialHub>(this.API_PREFIX);
    return this.populate(data);
  }
}
