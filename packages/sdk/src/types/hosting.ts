import { IApillonPagination } from './apillon';

export enum DeployToEnvironment {
  TO_STAGING = 1,
  STAGING_TO_PRODUCTION = 2,
  DIRECTLY_TO_PRODUCTION = 3,
}

export enum DeploymentStatus {
  INITIATED = 0,
  IN_PROGRESS = 1,
  IN_REVIEW = 2,
  APPROVED = 3,
  SUCCESSFUL = 10,
  FAILED = 100,
  REJECTED = 101,
}

export interface IWebsiteFilters extends IApillonPagination {
  status?: number;
}

export interface IDeploymentFilters extends IApillonPagination {
  deploymentStatus?: DeploymentStatus;
  environment?: DeployToEnvironment;
}

export interface ShortUrl {
  /**
   * the short URL slug
   */
  id: string;
  /**
   * the short URL
   */
  url: string;
  /**
   * the target URL which the short link points to
   */
  targetUrl: string;
}
