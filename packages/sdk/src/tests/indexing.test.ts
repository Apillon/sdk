import { Indexing } from '../modules/indexing/indexing';
import { getConfig } from './helpers/helper';

describe('Indexing tests', () => {
  let indexing: Indexing = undefined;

  beforeAll(async () => {
    indexing = new Indexing(getConfig());
  });

  test('Deploy a indexer', async () => {
    await indexing
      .indexer('5286ad99-9447-4f7f-8f29-2c8a3aef7a9f')
      .deployIndexer({ indexerDir: 'D:\\Sqd\\moonbeam-squid' });
  });
});
