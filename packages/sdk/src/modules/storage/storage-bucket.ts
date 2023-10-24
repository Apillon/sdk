import { AxiosInstance } from 'axios';
import { Directory } from './directory';
import {
  IStorageBucketContentRequest,
  StorageContentType,
} from '../../types/storage';
import { File } from './file';
import { constructUrlWithQueryParams, listFilesRecursive, uploadFilesToS3 } from '../../lib/common';
import { ApillonLogger } from '../../docs-index';

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
  public uuid;

  /**
   * @dev Bucket content which are files and directories.
   */
  public content: (File | Directory)[] = null;

  /**
   * @dev Constructor which should only be called via Storage class.
   * @param uuid Unique identifier of the bucket.
   * @param api Axios instance set to correct rootUrl with correct error handling.
   */
  constructor(api: AxiosInstance, logger: ApillonLogger, uuid: string) {
    this.api = api;
    this.logger = logger;
    this.uuid = uuid;
    this.API_PREFIX = `/storage/${uuid}`;
  }

  /**
   * TODO: How to handle search etc.?
   * @dev Gets contents of a bucket.
   */
  async getObjects(data?: IStorageBucketContentRequest) {
    this.content = [];
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/content`,
      data,
    );
    const resp = await this.api.get(url);
    for (const item of resp.data?.data?.items) {
      if (item.type == StorageContentType.FILE) {
        this.content.push(
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
        this.content.push(
          new Directory(this.api, this.logger, this.uuid, item.uuid, item),
        );
      }
    }

    return this.content;
  }

  async getFilesRecursive(data?: IStorageBucketContentRequest) {
    const content = [];
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/content`,
      data,
    );
    const resp = await this.api.get(url);
    for (const item of resp.data?.data?.items) {
      if (item.type == StorageContentType.FILE) {
        new File(
          this.api,
          this.logger,
          this.uuid,
          item.uuid,
          item.directoryUuid,
          item,
        );
      } else {
        const files = await this.getFilesRecursive({
          directoryUuid: item.uuid,
        });
        content.push(...files);
      }
    }

    return (this.content = [...content]);
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

    const data = { files };
    console.log(`Files to upload: ${data.files.length}`);

    console.time('Got upload links');
    const resp = await this.api.post(`${this.API_PREFIX}/upload`, data);

    console.timeEnd('Got upload links');

    // console.log(resp);
    const sessionUuid = resp.data.data.sessionUuid;

    console.time('File upload complete');
    await uploadFilesToS3(resp.data.data.files, files);
    console.timeEnd('File upload complete');

    console.log('Closing session...');
    const respEndSession = await this.api.post(
      `${this.API_PREFIX}/upload/${sessionUuid}/end`,
    );
    console.log('Session ended.');

    if (!respEndSession.data?.data) {
      throw new Error();
    }
  }

  /**
   * Gets file instance.
   * @param fileUuid Uuid of the file.
   * @returns Instance of file.
   */
  file(fileUuid: string): File {
    return new File(this.api, this.logger, this.uuid, fileUuid, null, null);
  }
}
