import { Directory } from './directory';
import {
  FileMetadata,
  IBucketFilesRequest,
  ICreateIpns,
  IFileUploadRequest,
  IPNSListRequest,
  IStorageBucketContentRequest,
  StorageContentType,
} from '../../types/storage';
import { File } from './file';
import { constructUrlWithQueryParams } from '../../lib/common';
import {
  IApillonList,
  IApillonListResponse,
  IApillonResponse,
} from '../../types/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { uploadFiles } from '../../util/file-utils';
import { ApillonModel } from '../../lib/apillon';
import { Ipns } from './ipns';

export class StorageBucket extends ApillonModel {
  /**
   * Name of the bucket.
   */
  public name: string = null;

  /**
   * Bucket description.
   */
  public description: string = null;

  /**
   * Size of the bucket in bytes.
   */
  public size: number = null;

  /**
   * Bucket content which are files and directories.
   */
  public content: (File | Directory)[] = [];

  /**
   * Constructor which should only be called via Storage class.
   * @param uuid Unique identifier of the bucket.
   * @param data Data to populate storage bucket with.
   */
  constructor(uuid: string, data?: Partial<StorageBucket>) {
    super(uuid);
    this.API_PREFIX = `/storage/buckets/${uuid}`;
    this.populate(data);
  }

  /**
   * Gets contents of a bucket.
   * @returns A a list of File and Directory objects.
   */
  async listObjects(
    params?: IStorageBucketContentRequest,
  ): Promise<IApillonList<File | Directory>> {
    const content = [];
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
        content.push(new File(this.uuid, file.directoryUuid, file.uuid, file));
      } else {
        const directory = new Directory(
          this.uuid,
          item.uuid,
          item as Directory,
        );
        content.push(directory, ...(await directory.get()));
      }
    }
    this.content = content;
    return { total: data.total, items: content };
  }

  /**
   * Gets all files in a bucket.
   */
  async listFiles(params?: IBucketFilesRequest): Promise<IApillonList<File>> {
    const url = constructUrlWithQueryParams(
      `/storage/buckets/${this.uuid}/files`,
      params,
    );
    const { data } = await ApillonApi.get<
      IApillonListResponse<File & { fileUuid: string }>
    >(url);

    return {
      ...data,
      items: data.items.map(
        (file) => new File(this.uuid, file.directoryUuid, file.fileUuid, file),
      ),
    };
  }

  /**
   * Uploads files inside a local folder via path.
   * @param folderPath Path to the folder to upload.
   * @param {IFileUploadRequest} params - Optional parameters to be used for uploading files
   */
  public async uploadFromFolder(
    folderPath: string,
    params?: IFileUploadRequest,
  ): Promise<void> {
    await uploadFiles(folderPath, this.API_PREFIX, params);
  }

  /**
   * Uploads files to the bucket.
   * @param {FileMetadata[]} files - The files to be uploaded
   * @param {IFileUploadRequest} params - Optional parameters to be used for uploading files
   */
  public async uploadFiles(
    files: FileMetadata[],
    params?: IFileUploadRequest,
  ): Promise<void> {
    await uploadFiles(null, this.API_PREFIX, params, files);
  }

  /**
   * Gets file instance.
   * @param fileUuid UUID of the file.
   * @returns File instance.
   */
  file(fileUuid: string): File {
    return new File(this.uuid, null, fileUuid);
  }

  /**
   * Gets a directory instance.
   * @param directoryUuid UUID of the directory.
   * @returns Directory instance.
   */
  directory(directoryUuid: string): Directory {
    return new Directory(this.uuid, directoryUuid);
  }

  //#region IPNS methods

  /**
   * Gets an IPNS record instance.
   * @param ipnsUuid UUID of the IPNS record.
   * @returns Ipns instance.
   */
  ipns(ipnsUuid: string): Ipns {
    return new Ipns(this.uuid, ipnsUuid);
  }

  /**
   * List all IPNS records for this bucket
   * @param {IPNSListRequest?} [params] - Listing query filters
   */
  async listIpnsNames(params?: IPNSListRequest) {
    const url = constructUrlWithQueryParams(
      `/storage/buckets/${this.uuid}/ipns`,
      params,
    );
    const { data } = await ApillonApi.get<
      IApillonListResponse<Ipns & { ipnsUuid: string }>
    >(url);

    return {
      ...data,
      items: data.items.map((ipns) => new Ipns(this.uuid, ipns.ipnsUuid, ipns)),
    };
  }

  /**
   * Create a new IPNS record for this bucket
   * @param {ICreateIpns} body
   * @returns {Promise<Ipns>}
   */
  async createIpns(body: ICreateIpns): Promise<Ipns> {
    const url = `/storage/buckets/${this.uuid}/ipns`;
    const { data } = await ApillonApi.post<
      IApillonResponse<Ipns & { ipnsUuid: string }>
    >(url, body);
    return new Ipns(this.uuid, data.ipnsUuid, data);
  }
  //#endregion
}
