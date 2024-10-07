export interface IUrlForIndexerSourceCodeUpload {
  url: string;
}

export interface IDeployIndexer {
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
