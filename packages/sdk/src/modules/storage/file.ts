import { AxiosInstance } from 'axios';
import { FileStatus, StorageContentType } from '../../types/storage';
import { ApillonLogger } from '../../lib/apillon';

export class File {
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
  public bucketUuid: string;

  /**
   * @dev Unique identifier of the file.
   */
  public uuid: string;

  /**
   * File name.
   */
  public name: string = null;

  /**
   * File unique ipfs identifier.
   */
  public CID: string = null;

  /**
   * File status.
   */
  public status: FileStatus = null;

  /**
   * Id of the directory in which the file resides.
   */
  public directoryUuid: string = null;

  /**
   * Type of content.
   */
  public type = StorageContentType.FILE;

  /**
   * @dev Constructor which should only be called via Storage class.
   * @param uuid Unique identifier of the file.
   * @param api Axios instance set to correct rootUrl with correct error handling.
   */
  constructor(
    api: AxiosInstance,
    logger: ApillonLogger,
    bucketUuid: string,
    fileUuid: string,
    directoryUuid: string,
    data: any,
  ) {
    this.api = api;
    this.logger = logger;
    this.bucketUuid = bucketUuid;
    this.uuid = fileUuid;
    this.directoryUuid = directoryUuid;
    this.API_PREFIX = `/storage/${bucketUuid}/file/${fileUuid}`;
    this.status = data?.fileStatus;
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
    return this;
  }

  /**
   * @dev Gets file details.
   */
  async get(): Promise<File> {
    const { data } = await this.api.get(`${this.API_PREFIX}/detail`);
    this.status = data.data.fileStatus;
    return this.populate(data.data);
  }
}
