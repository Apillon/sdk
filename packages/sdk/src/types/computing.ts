import { IApillonPagination } from './apillon';

export enum ComputingContractType {
  SCHRODINGER = 1,
}

export enum ComputingContractStatus {
  CREATED = 0,
  DEPLOY_INITIATED = 1,
  DEPLOYING = 2, //INSTANTIATING
  DEPLOYED = 3, //INSTANTIATED
  TRANSFERRING = 4,
  TRANSFERRED = 5,
  FAILED = 6,
}

export type ComputingContractData = {
  nftContractAddress: string;
  nftChainRpcUrl: string;
  restrictToOwner: string;
  ipfsGatewayUrl: string;
  clusterId: string;
};

export interface IContractFilters extends IApillonPagination {
  contractStatus?: ComputingContractStatus;
}
