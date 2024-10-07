import { ApillonModule } from '../../lib/apillon';
import { Indexer } from './indexer';

export class Indexing extends ApillonModule {
  /**
   * @param uuid Unique bucket identifier.
   * @returns An instance of StorageBucket.
   */
  public indexer(uuid: string): Indexer {
    return new Indexer(uuid);
  }
}
