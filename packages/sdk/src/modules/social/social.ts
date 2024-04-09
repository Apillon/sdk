import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList, IApillonPagination } from '../../types/apillon';
import {
  ICreateHub,
  ICreateChannel,
  IChannelFilters,
} from '../../types/social'; // Assume these types are defined similarly to the NFT types
import { SocialChannel } from './social-channel';
import { SocialHub } from './social-hub';

export class Social extends ApillonModule {
  private HUBS_API_PREFIX = '/social/hubs';
  private CHANNELS_API_PREFIX = '/social/channels';

  /**
   * Lists all hubs with optional filters.
   * @param {IApillonPagination} params Optional filters for listing hubs.
   * @returns A list of Hub instances.
   */
  public async listHubs(
    params?: IApillonPagination,
  ): Promise<IApillonList<SocialHub>> {
    const data = await ApillonApi.get<
      IApillonList<SocialHub & { hubUuid: string }>
    >(constructUrlWithQueryParams(this.HUBS_API_PREFIX, params));

    return {
      ...data,
      items: data.items.map((hub) => new SocialHub(hub.hubUuid, hub)),
    };
  }

  /**
   * Lists all channels with optional filters.
   * @param {IChannelFilters} params Optional filters for listing channels.
   * @returns A list of Channel instances.
   */
  public async listChannels(
    params?: IChannelFilters,
  ): Promise<IApillonList<SocialChannel>> {
    const url = constructUrlWithQueryParams(this.CHANNELS_API_PREFIX, params);
    const data = await ApillonApi.get<
      IApillonList<SocialChannel & { channelUuid: string }>
    >(url);

    return {
      ...data,
      items: data.items.map(
        (channel) => new SocialChannel(channel.channelUuid, channel),
      ),
    };
  }

  /**
   * Creates a new hub.
   * @param {ICreateHub} hubData Data for creating the hub.
   * @returns The created Hub instance.
   */
  public async createHub(hubData: ICreateHub): Promise<SocialHub> {
    const hub = await ApillonApi.post<SocialHub & { hubUuid: string }>(
      this.HUBS_API_PREFIX,
      hubData,
    );
    return new SocialHub(hub.hubUuid, hub);
  }

  /**
   * Creates a new channel.
   * @param {ICreateChannel} channelData Data for creating the channel.
   * @returns The created Channel instance.
   */
  public async createChannel(
    channelData: ICreateChannel,
  ): Promise<SocialChannel> {
    const channel = await ApillonApi.post<
      SocialChannel & { channelUuid: string }
    >(this.CHANNELS_API_PREFIX, channelData);
    return new SocialChannel(channel.channelUuid, channel);
  }

  /**
   * @param uuid Unique hub identifier.
   * @returns An instance of Hub.
   */
  public hub(uuid: string): SocialHub {
    return new SocialHub(uuid);
  }

  /**
   * @param uuid Unique channel identifier.
   * @returns An instance of SocialChannel.
   */
  public channel(uuid: string): SocialChannel {
    return new SocialChannel(uuid);
  }
}
