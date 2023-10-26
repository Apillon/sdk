import { IApillonPagination } from '../../docs-index';
import { ApillonModule } from '../../lib/apillon';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList, IApillonListResponse } from '../../types/apillon';
import { StorageBucket } from './storage-bucket';

export class Storage extends ApillonModule {
  /**
     * @dev API url for storage.
     */
  private API_PREFIX = '/storage/buckets';

  /**
   * Lists all buckets.
   * @param {ICollectionFilters} params Filter for listing collections.
   * @returns Array of NftCollection.
   */
  public async listBuckets(params?: IApillonPagination): Promise<IApillonList<StorageBucket>> {
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const { data } = await this.api.get<IApillonListResponse<any>>(url);

    return {
      items: data.data.items.map(
        bucket => new StorageBucket(this.api, this.logger, bucket.bucketUuid, bucket)
      ),
      total: data.data.total
    };
  }

  /**
   * @dev Returns an website instance.
   * @param uuid Unique website identifier.
   * @returns An instance of Website.∂
   */
  public bucket(uuid: string): StorageBucket {
    return new StorageBucket(this.api, this.logger, uuid);
  }
}
