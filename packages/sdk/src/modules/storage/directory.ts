import {
  IStorageBucketContentRequest,
  StorageContentType,
} from '../../types/storage';
import { File } from './file';
import { constructUrlWithQueryParams } from '../../lib/common';
import { ApillonApi } from '../../lib/apillon-api';
import { IApillonListResponse } from '../../types/apillon';
import { ApillonModel } from '../../docs-index';

export class Directory extends ApillonModel {
  /**
   * Unique identifier of the bucket.
   */
  public bucketUuid;

  /**
   * Directory name.
   */
  public name: string = null;

  /**
   * Directory unique ipfs identifier.
   */
  public CID: string = null;

  /**
   * Id of the directory in which the file resides.
   */
  public parentDirectoryUuid: string = null;

  /**
   * Type of content.
   */
  public type = StorageContentType.DIRECTORY;

  public content: (File | Directory)[] = [];

  /**
   * Constructor which should only be called via HostingWebsite class.
   * @param bucketUuid Unique identifier of the directory's bucket.
   * @param directoryUuid Unique identifier of the directory.
   * @param data Data to populate the directory with.
   */
  constructor(
    bucketUuid: string,
    directoryUuid: string,
    data?: Partial<Directory>,
  ) {
    super(directoryUuid);
    this.bucketUuid = bucketUuid;
    this.API_PREFIX = `/storage/${bucketUuid}`;
    this.populate(data);
  }

  /**
   * Gets contents of a directory.
   */
  async get(
    params: IStorageBucketContentRequest = {},
  ): Promise<(Directory | File)[]> {
    this.content = [];
    params.directoryUuid = this.uuid;
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/content`,
      params,
    );
    const { data } = await ApillonApi.get<
      IApillonListResponse<File | Directory>
    >(url);

    for (const item of data.items) {
      if (item.type == StorageContentType.FILE) {
        const file = item as File;
        this.content.push(
          new File(this.bucketUuid, file.directoryUuid, file.uuid, file),
        );
      } else {
        this.content.push(
          new Directory(this.bucketUuid, item.uuid, item as Directory),
        );
      }
    }

    return this.content;
  }
}
