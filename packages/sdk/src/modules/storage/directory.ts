import {
  IStorageBucketContentRequest,
  StorageContentType,
} from '../../types/storage';
import { File } from './file';
import { constructUrlWithQueryParams } from '../../lib/common';
import { ApillonApi } from '../../lib/apillon-api';
import { IApillonList } from '../../types/apillon';
import { ApillonModel } from '../../lib/apillon';
import { ApillonLogger } from '../../lib/apillon-logger';

export class Directory extends ApillonModel {
  /**
   * Unique identifier of the bucket.
   */
  public bucketUuid: string = null;

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

  /**
   * Link on IPFS gateway.
   */
  public link: string = null;

  public content: (File | Directory)[] = [];

  /**
   * Constructor which should only be called via StorageBucket class.
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
    this.API_PREFIX = `/storage/buckets/${bucketUuid}`;
    this.populate(data);
  }

  /**
   * Gets contents of a directory.
   * @returns Directory data and content (files and subfolders)
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
    const data = await ApillonApi.get<IApillonList<File | Directory>>(url);

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

  /**
   * Deletes a directory from the bucket.
   */
  async delete(): Promise<void> {
    await ApillonApi.delete(`${this.API_PREFIX}/directories/${this.uuid}`);
    ApillonLogger.log('Directory deleted successfully');
  }

  protected serializeFilter(key: string, value: string) {
    const serialized = super.serializeFilter(key, value);
    const enums = {
      type: StorageContentType[value],
    };
    if (Object.keys(enums).includes(key)) {
      return enums[key];
    }
    const excludedKeys = ['content'];
    return excludedKeys.includes(key) ? undefined : serialized;
  }
}
