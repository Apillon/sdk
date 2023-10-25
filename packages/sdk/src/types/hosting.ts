import { IApillonPagination } from "./generic";

export enum DeployToEnvironment {
  TO_STAGING = 1,
  STAGING_TO_PRODUCTION = 2,
  DIRECTLY_TO_PRODUCTION = 3,
}

export enum DeploymentStatus {
  INITIATED = 0,
  IN_PROCESS = 1,
  SUCCESSFUL = 10,
  FAILED = 100,
}

export interface IWebsiteFilters extends IApillonPagination {
  status?: number;
}