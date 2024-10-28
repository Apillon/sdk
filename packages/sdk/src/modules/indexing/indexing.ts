import { ApillonModule } from '../../lib/apillon';
import { Indexer } from './indexer';

export class Indexing extends ApillonModule {
  /**
   * @param uuid Unique indexer identifier.
   * @returns An instance of Indexer class.
   */
  public indexer(uuid: string): Indexer {
    return new Indexer(uuid);
  }
}
