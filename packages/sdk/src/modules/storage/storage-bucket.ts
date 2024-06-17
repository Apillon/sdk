import { Directory } from './directory';
import {
  BucketType,
  FileMetadata,
  FileUploadResult,
  IBucketFilesRequest,
  ICreateIpns,
  IFileUploadRequest,
  IPNSListRequest,
  IStorageBucketContentRequest,
  StorageContentType,
} from '../../types/storage';
import { File } from './file';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList, LogLevel } from '../../types/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { uploadFiles } from '../../util/file-utils';
import { ApillonModel } from '../../lib/apillon';
import { Ipns } from './ipns';
import { ApillonLogger } from '../../lib/apillon-logger';

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
   * Type of bucket (storage, hosting or NFT metadata)
   */
  public bucketType: number = null;

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
    const data = await ApillonApi.get<IApillonList<File | Directory>>(url);
    for (const item of data.items) {
      if (item.type == StorageContentType.FILE) {
        const file = item as File & { fileStatus: number };
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
   * @param {?IBucketFilesRequest} [params] - query filter parameters
   * @returns List of files in the bucket
   */
  async listFiles(params?: IBucketFilesRequest): Promise<IApillonList<File>> {
    const url = constructUrlWithQueryParams(`${this.API_PREFIX}/files`, params);
    const data = await ApillonApi.get<
      IApillonList<File & { fileUuid: string; fileStatus: number }>
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
   * @returns List of uploaded files with their properties
   */
  public async uploadFromFolder(
    folderPath: string,
    params?: IFileUploadRequest,
  ): Promise<FileUploadResult[]> {
    const { files: uploadedFiles, sessionUuid } = await uploadFiles({
      apiPrefix: this.API_PREFIX,
      folderPath,
      params,
    });

    if (!params?.awaitCid) {
      return this.getUploadedFiles(sessionUuid, uploadedFiles.length);
    }

    return await this.resolveFileCIDs(sessionUuid, uploadedFiles.length);
  }

  /**
   * Uploads files to the bucket.
   * @param {FileMetadata[]} files - The files to be uploaded
   * @param {IFileUploadRequest} params - Optional parameters to be used for uploading files
   */
  public async uploadFiles(
    files: FileMetadata[],
    params?: IFileUploadRequest,
  ): Promise<FileUploadResult[]> {
    const { files: uploadedFiles, sessionUuid } = await uploadFiles({
      apiPrefix: this.API_PREFIX,
      params,
      files,
    });

    if (!params?.awaitCid) {
      return this.getUploadedFiles(sessionUuid, uploadedFiles.length);
    }

    return await this.resolveFileCIDs(sessionUuid, uploadedFiles.length);
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

  private async resolveFileCIDs(
    sessionUuid: string,
    limit: number,
  ): Promise<FileUploadResult[]> {
    let resolvedFiles: FileUploadResult[] = [];

    // Resolve CIDs for each file
    let retryTimes = 0;
    ApillonLogger.log('Resolving file CIDs...');
    while (resolvedFiles.length === 0 || !resolvedFiles.every((f) => !!f.CID)) {
      resolvedFiles = await this.getUploadedFiles(sessionUuid, limit);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (++retryTimes >= 30) {
        ApillonLogger.log('Unable to resolve file CIDs', LogLevel.ERROR);
        return resolvedFiles;
      }
    }
    return resolvedFiles;
  }

  private async getUploadedFiles(sessionUuid: string, limit: number) {
    return (await this.listFiles({ sessionUuid, limit })).items.map((file) => ({
      fileName: file.name,
      fileUuid: file.uuid,
      CID: file.CID,
      // CIDv1: file.CIDv1,
    }));
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
   * @returns List of IPNS names in the bucket
   */
  async listIpnsNames(params?: IPNSListRequest) {
    const url = constructUrlWithQueryParams(`${this.API_PREFIX}/ipns`, params);
    const data = await ApillonApi.get<
      IApillonList<Ipns & { ipnsUuid: string }>
    >(url);

    return {
      ...data,
      items: data.items.map((ipns) => new Ipns(this.uuid, ipns.ipnsUuid, ipns)),
    };
  }

  /**
   * Create a new IPNS record for this bucket
   * @param {ICreateIpns} body
   * @returns New IPNS instance
   */
  async createIpns(body: ICreateIpns): Promise<Ipns> {
    const data = await ApillonApi.post<Ipns & { ipnsUuid: string }>(
      `${this.API_PREFIX}/ipns`,
      body,
    );
    return new Ipns(this.uuid, data.ipnsUuid, data);
  }
  //#endregion

  protected override serializeFilter(key: string, value: any) {
    const serialized = super.serializeFilter(key, value);
    const enums = {
      bucketType: BucketType[value],
    };
    return Object.keys(enums).includes(key) ? enums[key] : serialized;
  }
}
