import { AxiosResponse } from 'axios';
import { ApillonModel } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { FileStatus, StorageContentType } from '../../types/storage';

export class File extends ApillonModel {
  /**
   * Unique identifier of the file's bucket.
   */
  public bucketUuid: string = null;

  /**
   * Unique identifier of the directory in which the file resides.
   */
  public directoryUuid: string = null;

  /**
   * File name.
   */
  public name: string = null;

  /**
   * File unique ipfs identifier.
   */
  public CID: string = null;

  /**
   * File content identifier V1.
   */
  public CIDv1: string = null;

  /**
   * File upload status.
   */
  public status: FileStatus = null;

  /**
   * Type of content.
   */
  public type = StorageContentType.FILE;

  /**
   * Link on IPFS gateway.
   */
  public link: string = null;

  /**
   * Full path to file.
   */
  public path: string = null;

  /**
   * Constructor which should only be called via HostingWebsite class.
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
    super(fileUuid);
    this.bucketUuid = bucketUuid;
    this.directoryUuid = directoryUuid;
    this.API_PREFIX = `/storage/${bucketUuid}/file/${fileUuid}`;
    this.status = data?.fileStatus;
    this.populate(data);
  }

  /**
   * Gets file details.
   */
  async get(): Promise<File> {
    const { data } = await ApillonApi.get<
      AxiosResponse<File & { fileStatus: number }>
    >(`${this.API_PREFIX}/detail`);
    this.status = data.fileStatus;
    return this.populate(data);
  }

  protected override serializeFilter(key: string, value: any) {
    const serialized = super.serializeFilter(key, value);
    const enums = {
      status: FileStatus[value],
      type: StorageContentType[value],
    };
    return Object.keys(enums).includes(key) ? enums[key] : serialized;
  }
}
