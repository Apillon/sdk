import { IpfsClusterInfo, StorageInfo } from '../../docs-index';
import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList, IApillonPagination } from '../../types/apillon';
import { StorageBucket } from './storage-bucket';

export class Storage extends ApillonModule {
  /**
   * API url for storage.
   */
  private API_PREFIX = '/storage';

  /**
   * Lists all buckets.
   * @param {IApillonPagination} params Filter for listing collections.
   * @returns Array of StorageBucket objects.
   */
  public async listBuckets(
    params?: IApillonPagination,
  ): Promise<IApillonList<StorageBucket>> {
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/buckets`,
      params,
    );

    const data = await ApillonApi.get<
      IApillonList<StorageBucket & { bucketUuid: string }>
    >(url);

    return {
      ...data,
      items: data.items.map(
        (bucket) => new StorageBucket(bucket.bucketUuid, bucket),
      ),
    };
  }

  /**
   * @param uuid Unique bucket identifier.
   * @returns An empty instance of StorageBucket.
   */
  public bucket(uuid: string): StorageBucket {
    return new StorageBucket(uuid);
  }

  /**
   * Gets overall storage info for a project - available and used storage and bandwidth
   * @returns {Promise<StorageInfo>}
   */
  public async getInfo(): Promise<StorageInfo> {
    return await ApillonApi.get<StorageInfo>(`${this.API_PREFIX}/info`);
  }

  /**
   * Gets basic data of an IPFS cluster used by the project.
   *
   * IPFS clusters contain multiple IPFS nodes but expose a single gateway for accessing content via CID or IPNS.
   *
   * Apillon clusters (gateways) are not publicly accessible
   * @note Each project has its own secret for generating tokens to access content on the IPFS gateway.
   * @returns {Promise<IpfsClusterInfo>}
   */
  public async getIpfsClusterInfo(): Promise<IpfsClusterInfo> {
    return await ApillonApi.get<IpfsClusterInfo>(
      `${this.API_PREFIX}/ipfs-cluster-info`,
    );
  }

  /**
   * Apillon IPFS gateways are private and can only be accessible with a token.
   * @docs [Generate an IPFS link](https://wiki.apillon.io/build/2-storage-api.html#get-or-generate-link-for-ipfs)
   * @param {string} cid The CID or IPNS address of the fie
   * @param {string} type The type of the link to generate based on the gateway. Can be 'ipfs' or 'ipns'.
   * @returns {Promise<string>} The IPFS link where the requested content can be accessed.
   */
  public async generateIpfsLink(
    cid: string,
    type: 'ipfs' | 'ipns' = 'ipfs',
  ): Promise<string> {
    const { link } = await ApillonApi.get<{ link: string }>(
      `${this.API_PREFIX}/link-on-ipfs/${cid}?type=${type}`,
    );
    return link;
  }
}
