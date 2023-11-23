import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import {
  IApillonList,
  IApillonListResponse,
  IApillonPagination,
} from '../../types/apillon';
import { StorageBucket } from './storage-bucket';

export class Storage extends ApillonModule {
  /**
   * API url for storage.
   */
  private API_PREFIX = '/storage/buckets';

  /**
   * Lists all buckets.
   * @param {ICollectionFilters} params Filter for listing collections.
   * @returns Array of NftCollection.
   */
  public async listBuckets(
    params?: IApillonPagination,
  ): Promise<IApillonList<StorageBucket>> {
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const { data } = await ApillonApi.get<IApillonListResponse<any>>(url);

    return {
      ...data,
      items: data.items.map(
        (bucket) => new StorageBucket(bucket.bucketUuid, bucket),
      ),
    };
  }

  /**
   * @param uuid Unique bucket identifier.
   * @returns An instance of StorageBucket.
   */
  public bucket(uuid: string): StorageBucket {
    return new StorageBucket(uuid);
  }
}
