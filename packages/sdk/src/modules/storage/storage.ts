import { ApillonModule } from '../../lib/apillon';
import { StorageBucket } from './storage-bucket';

export class Storage extends ApillonModule {
  /**
   * @dev Returns an website instance.
   * @param uuid Unique website identifier.
   * @returns An instance of Website.∂
   */
  public bucket(uuid: string): StorageBucket {
    return new StorageBucket(uuid, this.api);
  }
}
