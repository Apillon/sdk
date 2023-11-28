import { Directory } from './directory';
import {
  FileMetadata,
  IBucketFilesRequest,
  IFileUploadRequest,
  IStorageBucketContentRequest,
  StorageContentType,
} from '../../types/storage';
import { File } from './file';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList, IApillonListResponse } from '../../types/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { uploadFiles } from '../../util/file-utils';
import { ApillonModel } from '../../lib/apillon';

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
    this.API_PREFIX = `/storage/${uuid}`;
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
   * @param fileUuid Uuid of the file.
   * @returns Instance of file.
   */
  file(fileUuid: string): File {
    return new File(this.uuid, null, fileUuid, {});
  }

  /**
   * Deletes a file from the bucket.
   * @param fileUuid Uuid of the file.
   */
  async deleteFile(fileUuid: string): Promise<void> {
    await ApillonApi.delete(`/storage/buckets/${this.uuid}/files/${fileUuid}`);
  }
}
