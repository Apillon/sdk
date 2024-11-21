export interface IUrlForIndexerSourceCodeUpload {
  url: string;
}

export enum DeploymentType {
  DEPLOY = 'DEPLOY',
  DEPLOY_HARD_RESET = 'DEPLOY_HARD_RESET',
  RESTART = 'RESTART',
  HIBERNATE = 'HIBERNATE',
  DELETE = 'DELETE',
  SCALE = 'SCALE',
  SET_TAG = 'SET_TAG',
  REMOVE_TAG = 'REMOVE_TAG',
}
export enum IndexerDeploymentStatus {
  UNPACKING = 'UNPACKING',
  IMAGE_BUILDING = 'IMAGE_BUILDING',
  RESETTING = 'RESETTING',
  ADDING_INGRESS = 'ADDING_INGRESS',
  REMOVING_INGRESS = 'REMOVING_INGRESS',
  SQUID_SYNCING = 'SQUID_SYNCING',
  SQUID_DELETING = 'SQUID_DELETING',
  ADDONS_SYNCING = 'ADDONS_SYNCING',
  ADDONS_DELETING = 'ADDONS_DELETING',
  OK = 'OK',
  DEPLOYING = 'DEPLOYING',
}
export enum DeploymentFailed {
  NO = 'NO',
  UNEXPECTED = 'UNEXPECTED',
  PERMISSIONS = 'PERMISSIONS',
  REQUIREMENTS = 'REQUIREMENTS',
  REQUIRED_SOURCE_FILE_MISSED = 'REQUIRED_SOURCE_FILE_MISSED',
  REQUIRED_SOURCE_FILE_INVALID = 'REQUIRED_SOURCE_FILE_INVALID',
  SOURCE_FILES_BUILD_FAILED = 'SOURCE_FILES_BUILD_FAILED',
}

export interface IDeployIndexer {
  /**
   * Indexer unique identifier.
   */
  indexer_uuid: string;
  /**
   * Indexer status (1 = draft, 5 = active)
   */
  status: number;
  /**
   * Indexer last deployment id - this is the deployment id from the sqd.
   */
  lastDeploymentId: number;
  /**
   * Indexer sqd deployment details.
   */
  deployment: {
    /**
     * Deployment id
     */
    id: number;
    type: DeploymentType;
    status: IndexerDeploymentStatus;
    failed: DeploymentFailed;
  };
}
