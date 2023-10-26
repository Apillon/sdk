import { IApillonPagination } from "./generic";

export enum StorageContentType {
  FILE = 2,
  DIRECTORY = 1,
}

export enum FileStatus {
  UPLOAD_REQUEST_GENERATED = 1,
  UPLOADED = 2,
  AVAILABLE_ON_IPFS = 3,
  AVAILABLE_ON_IPFS_AND_REPLICATED = 4,
}

export interface IStorageBucketContentRequest extends IApillonPagination {
  directoryUuid?: string;
  markedForDeletion?: boolean;
}

export interface IBucketFilesRequest extends IApillonPagination {
  fileStatus?: FileStatus;
}
