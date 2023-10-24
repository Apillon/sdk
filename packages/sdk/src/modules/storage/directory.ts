import { AxiosInstance } from 'axios';
import { StorageContentType } from '../../types/storage';
import { File } from './file';
import { ApillonLogger } from '../../lib/apillon';

export class Directory {
  /**
   * Axios instance set to correct rootUrl with correct error handling.
   */
  protected api: AxiosInstance;

  /**
   * Logger.
   */
  protected logger: ApillonLogger;

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
  public uuid;

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

  public content: (File | Directory)[] = null;
  /**
   * @dev Constructor which should only be called via Storage class.
   * @param uuid Unique identifier of the bucket.
   * @param api Axios instance set to correct rootUrl with correct error handling.
   */
  constructor(
    api: AxiosInstance,
    logger: ApillonLogger,
    bucketUuid: string,
    directoryUuid: string,
    data: any,
  ) {
    this.api = api;
    this.logger = logger;
    this.bucketUuid = bucketUuid;
    this.uuid = directoryUuid;
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
    const postfix = `?directoryUuid=${this.uuid}`;
    const resp = await this.api.get(`${this.API_PREFIX}/content${postfix}`);
    for (const item of resp.data?.data?.items) {
      if (item.type == StorageContentType.FILE) {
        this.content.push(
          new File(
            this.api,
            this.logger,
            this.bucketUuid,
            item.uuid,
            item.directoryUuid,
            item,
          ),
        );
      } else {
        this.content.push(
          new Directory(
            this.api,
            this.logger,
            this.bucketUuid,
            item.uuid,
            item,
          ),
        );
      }
    }

    return this.content;
  }
}
