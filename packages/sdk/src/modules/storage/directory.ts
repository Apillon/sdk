import { AxiosInstance } from 'axios';
import { StorageContentType } from '../../types/storage';
import { File } from './file';

export class Directory {
  /**
   * Axios instance set to correct rootUrl with correct error handling.
   */
  protected api: AxiosInstance;

  /**
   * @dev API url prefix for this class.
   */
  private API_PREFIX: string = null;

  /**
   * @dev Unique identifier of the bucket.
   */
  public bucketUuid;

  /**
   * @dev Unique identifier of the directory.
   */
  public id;

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
  public parentDirectoryId: string = null;

  /**
   * Type of content.
   */
  public type = StorageContentType.DIRECTORY;

  public content: (File | Directory)[] = null;
  /**
   * @dev Constructor which should only be called via Storage class.
   * @param uuid Unique identifier of the bucket.
   * @param api Axios instance set to correct rootUrl with correct error handling.
   */
  constructor(
    api: AxiosInstance,
    bucketUuid: string,
    directoryId: string,
    data: any,
  ) {
    this.api = api;
    this.bucketUuid = bucketUuid;
    this.id = directoryId;
    this.API_PREFIX = `/storage/${bucketUuid}`;
    this.populate(data);
  }

  /**
   * Populates class properties via data object.
   * @param data Data object.
   */
  private populate(data: any) {
    if (data != null) {
      Object.keys(data || {}).forEach((key) => {
        const prop = this[key];
        if (prop === null) {
          this[key] = data[key];
        }
      });
    }
  }

  /**
   * @dev Gets contents of a directory.
   */
  async get() {
    this.content = [];
    const postfix = `?directoryId=${this.id}`;
    const resp = await this.api.get(`${this.API_PREFIX}/content${postfix}`);
    for (const item of resp.data?.data?.items) {
      if (item.type == StorageContentType.FILE) {
        this.content.push(new File(this.api, this.bucketUuid, item.id, item));
      } else {
        this.content.push(
          new Directory(this.api, this.bucketUuid, item.id, item),
        );
      }
    }

    return this.content;
  }
}
