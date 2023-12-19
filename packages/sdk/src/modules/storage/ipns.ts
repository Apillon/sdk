import { ApillonModel } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { ApillonLogger } from '../../lib/apillon-logger';

export class Ipns extends ApillonModel {
  /**
   * Informational IPNS name, which is set by user to easily organize their IPNS records.
   */
  public name: string = null;

  /**
   * IPNS record description.
   */
  public description: string = null;

  /**
   * IPNS name that is used to access IPNS content on IPFS gateway.
   */
  public ipnsName: string = null;

  /**
   * IPFS value (CID), to which this IPNS points.
   */
  public ipnsValue: string = null;

  /**
   * IPNS link to Apillon IPFS gateway, where it is possible to see content to which this IPNS points.
   */
  public link: string = null;

  /**
   * Unique identifier of the IPNS record's bucket.
   */
  public bucketUuid: string = null;

  /**
   * Constructor which should only be called via StorageBucket class.
   * @param bucketUuid Unique identifier of the file's bucket.
   * @param ipnsUuid Unique identifier of the IPNS record.
   * @param data Data to populate the IPNS record with.
   */
  constructor(bucketUuid: string, ipnsUuid: string, data?: Partial<Ipns>) {
    super(ipnsUuid);
    this.bucketUuid = bucketUuid;
    this.API_PREFIX = `/storage/buckets/${bucketUuid}/ipns/${ipnsUuid}`;
    this.populate(data);
  }

  /**
   * Gets IPNS details.
   */
  async get(): Promise<Ipns> {
    const data = await ApillonApi.get<Ipns>(this.API_PREFIX);
    return this.populate(data);
  }

  /**
   * Publish an IPNS record to IPFS and link it to a CID.
   * @param {string} cid - CID to which this ipns name will point.
   * @returns {Promise<Ipns>}
   */
  async publish(cid: string): Promise<Ipns> {
    const data = await ApillonApi.post<Ipns>(`${this.API_PREFIX}/publish`, {
      cid,
    });
    ApillonLogger.log('IPNS record published successfully');
    return this.populate(data);
  }

  /**
   * Delete an IPNS record from the bucket.
   * @returns {Promise<Ipns>}
   */
  async delete(): Promise<Ipns> {
    const data = await ApillonApi.delete<Ipns>(this.API_PREFIX);
    ApillonLogger.log('IPNS record deleted successfully');
    return this.populate(data);
  }
}
