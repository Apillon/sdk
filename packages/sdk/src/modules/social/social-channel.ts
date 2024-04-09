import { ApillonApi } from '../../lib/apillon-api';
import { ApillonModel } from '../../lib/apillon';
import { HubStatus } from '../../types/social';

export class SocialChannel extends ApillonModel {
  /**
   * Channel ID on Subsocial chain. This ID is used in widget.
   */
  public channelId: number = null;

  /**
   * Channel status (1: draft - deploying to chain, 5: active, 100: error).
   */
  public status: HubStatus = null;

  /**
   * Name of the channel.
   */
  public title: string = null;

  /**
   * Short description or content of the channel.
   */
  public body: string = null;

  /**
   * Comma separated tags associated with the channel.
   */
  public tags: string = null;

  constructor(uuid: string, data?: Partial<SocialChannel>) {
    super(uuid);
    this.API_PREFIX = `/social/channels/${uuid}`;
    this.populate(data);
  }

  /**
   * Fetches and populates the channel details from the API.
   * @returns An instance of Channel class with filled properties.
   */
  public async get(): Promise<SocialChannel> {
    const data = await ApillonApi.get<SocialChannel>(this.API_PREFIX);
    return this.populate(data);
  }
}
