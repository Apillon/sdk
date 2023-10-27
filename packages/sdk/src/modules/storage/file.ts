import { AxiosResponse } from 'axios';
import { ApillonApi } from '../../lib/apillon-api';
import { FileStatus, StorageContentType } from '../../types/storage';

export class File {
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
   * @dev Constructor which should only be called via HostingWebsite class.
   * @param bucketUuid Unique identifier of the file's bucket.
   * @param directoryUuid Unique identifier of the file's directory.
   * @param fileUuid Unique identifier of the file.
   * @param data Data to populate the directory with.
   */
  constructor(
    bucketUuid: string,
    directoryUuid: string,
    fileUuid: string,
    data?: Partial<File & { fileStatus: number }>,
  ) {
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
    const { data } = await ApillonApi.get<
      AxiosResponse<File & { fileStatus: number }>
    >(`${this.API_PREFIX}/detail`);
    this.status = data.fileStatus;
    return this.populate(data);
  }
}
