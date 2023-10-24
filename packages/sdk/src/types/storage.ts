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

export interface IStorageBucketContentRequest {
  directoryUuid?: string;
  markedForDeletion?: string;
}
