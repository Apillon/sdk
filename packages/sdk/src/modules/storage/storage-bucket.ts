import { Directory } from './directory';
import {
  IBucketFilesRequest,
  IStorageBucketContentRequest,
  StorageContentType,
} from '../../types/storage';
import { File } from './file';
import {
  constructUrlWithQueryParams,
  listFilesRecursive,
  uploadFilesToS3,
} from '../../lib/common';
import {
  IApillonList,
  IApillonListResponse,
  LogLevel,
} from '../../types/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { ApillonModel } from '../../docs-index';
import { ApillonLogger } from '../../lib/apillon-logger';

export class StorageBucket extends ApillonModel {
  /**
   * @dev Name of the bucket.
   */
  public name: string = null;

  /**
   * @dev Bucket description.
   */
  public description: string = null;

  /**
   * @dev Size of the bucket in bytes.
   */
  public size: number = null;

  /**
   * @dev Bucket content which are files and directories.
   */
  public content: (File | Directory)[] = [];

  /**
   * @dev Constructor which should only be called via Storage class.
   * @param uuid Unique identifier of the bucket.
   * @param data Data to populate storage bucket with.
   */
  constructor(uuid: string, data?: Partial<StorageBucket>) {
    super(uuid);
    this.API_PREFIX = `/storage/${uuid}`;
    this.populate(data);
  }

  /**
   * @dev Gets contents of a bucket.
   */
  async getObjects(
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
    for (const item of data.data.items) {
      if (item.type == StorageContentType.FILE) {
        const file = item as File;
        this.content.push(
          new File(this.uuid, file.directoryUuid, file.uuid, file),
        );
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
    return { total: data.data.total, items: content };
  }

  /**
   * @dev Gets all files in a bucket.
   */
  async getFiles(params?: IBucketFilesRequest): Promise<IApillonList<File>> {
    const url = constructUrlWithQueryParams(
      `/storage/buckets/${this.uuid}/files`,
      params,
    );
    const { data } = await ApillonApi.get<IApillonListResponse<File>>(url);

    return {
      total: data.data.total,
      items: data.data.items.map(
        (file) => new File(this.uuid, file.directoryUuid, file.uuid, file),
      ),
    };
  }

  /**
   * @dev Uploads files inside a folder via path.
   * @param folderPath Path to the folder to upload.
   */
  public async uploadFromFolder(folderPath: string): Promise<void> {
    ApillonLogger.log(
      `Preparing to upload files from ${folderPath} to website ${this.uuid} ...`,
      LogLevel.VERBOSE,
    );
    let files;
    try {
      files = listFilesRecursive(folderPath);
    } catch (err) {
      console.error(err);
      throw new Error(`Error reading files in ${folderPath}`);
    }

    ApillonLogger.log(`Files to upload: ${files.length}`, LogLevel.VERBOSE);

    const { data } = await ApillonApi.post<any>(`${this.API_PREFIX}/upload`, {
      files,
    });

    const uploadLinks = data.data.files.sort((a, b) =>
      a.fileName.localeCompare(b.fileName),
    );
    // Divide files into chunks for parallel processing and uploading
    const chunkSize = 10;
    const fileChunks = [];
    for (let i = 0; i < files.length; i += chunkSize) {
      const chunkFiles = files.slice(i, i + chunkSize);
      const chunkLinks = uploadLinks.slice(i, i + chunkSize);
      fileChunks.push({ chunkFiles, chunkLinks });
    }
    await Promise.all(
      fileChunks.map(({ chunkFiles, chunkLinks }) =>
        uploadFilesToS3(chunkLinks, chunkFiles),
      ),
    );

    ApillonLogger.log('Closing upload session...', LogLevel.VERBOSE);
    const respEndSession = await ApillonApi.post<any>(
      `${this.API_PREFIX}/upload/${data.data.sessionUuid}/end`,
    );
    ApillonLogger.log('Session ended.', LogLevel.VERBOSE);

    if (!respEndSession.data?.data) {
      throw new Error('Failure when trying to end file upload session');
    }
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
