import { AxiosInstance } from 'axios';
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
import { ApillonLogger } from '../../docs-index';
import { IApillonList, IApillonListResponse } from '../../types/apillon';

export class StorageBucket {
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
  public uuid: string;

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
  public content: (File | Directory)[] = null;

  /**
   * @dev Constructor which should only be called via Storage class.
   * @param uuid Unique identifier of the bucket.
   * @param api Axios instance set to correct rootUrl with correct error handling.
   * @param data Data to populate storage bucket
   */
  constructor(
    api: AxiosInstance,
    logger: ApillonLogger,
    uuid: string,
    data?: Partial<StorageBucket>,
  ) {
    this.api = api;
    this.logger = logger;
    this.uuid = uuid;
    this.API_PREFIX = `/storage/${uuid}`;
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
    const { data } = await this.api.get(url);
    for (const item of data.data.items) {
      if (item.type == StorageContentType.FILE) {
        content.push(
          new File(
            this.api,
            this.logger,
            this.uuid,
            item.uuid,
            item.directoryUuid,
            item,
          ),
        );
      } else {
        const directory = new Directory(
          this.api,
          this.logger,
          this.uuid,
          item.uuid,
          item,
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
    const { data } = await this.api.get<IApillonListResponse<File>>(url);

    return {
      total: data.data.total,
      items: data.data.items.map(
        (file) =>
          new File(
            this.api,
            this.logger,
            this.uuid,
            file.uuid,
            file.directoryUuid,
            file,
          ),
      ),
    };
  }

  /**
   * @dev Uploads files inside a folder via path.
   * @param folderPath Path to the folder to upload.
   */
  public async uploadFromFolder(folderPath: string): Promise<void> {
    console.log(
      `Preparing to upload files from ${folderPath} to website ${this.uuid} ...`,
    );
    let files;
    try {
      files = listFilesRecursive(folderPath);
    } catch (err) {
      console.error(err);
      throw new Error(`Error reading files in ${folderPath}`);
    }

    console.log(`Files to upload: ${files.length}`);

    console.time('Got upload links');
    const { data } = await this.api.post(`${this.API_PREFIX}/upload`, {
      files,
    });
    console.timeEnd('Got upload links');

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

    console.log('Closing session...');
    const respEndSession = await this.api.post(
      `${this.API_PREFIX}/upload/${data.data.sessionUuid}/end`,
    );
    console.log('Session ended.');

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
    return new File(this.api, this.logger, this.uuid, fileUuid, null, {});
  }

  /**
   * Deletes a file from the bucket.
   * @param fileUuid Uuid of the file.
   */
  async deleteFile(fileUuid: string): Promise<void> {
    await this.api.delete(`/storage/buckets/${this.uuid}/files/${fileUuid}`);
  }
}
