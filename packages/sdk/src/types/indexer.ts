export interface IUrlForIndexerSourceCodeUpload {
  url: string;
}

export interface IDeployIndexer {
  indexer_uuid: string;
  status: number;
  lastDeploymentId: number;
  deployment: {
    id: number;
    type: string;
    status: string;
    failed: string;
  };
}
