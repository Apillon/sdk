import { IApillonPagination } from './apillon';

export enum HubStatus {
  DRAFT = 1,
  ACTIVE = 5,
  ERORR = 100,
}

export interface ICreateHub {
  name: string;
  /**
   * Short description about the hub.
   */
  about?: string;
  /**
   * Comma separated tags associated with the hub.
   */
  tags?: string;
}

export interface ICreateChannel {
  title: string;
  /**
   * Short description or content of the channel.
   */
  body: string;
  /**
   * Comma separated tags associated with the channel.
   */
  tags?: string;
  /**
   * Hub in which the channel will be created
   * @default Apillon default hub
   */
  hubUuid?: string;
}

export interface IChannelFilters extends IApillonPagination {
  /**
   * Parent hub unique identifier
   */
  hubUuid?: string;
}
