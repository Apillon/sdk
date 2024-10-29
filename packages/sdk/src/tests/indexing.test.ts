import { Indexing } from '../modules/indexing/indexing';
import { getConfig, getIndexerUUID } from './helpers/helper';

describe('Indexing tests', () => {
  let indexing: Indexing = undefined;
  let indexer_uuid: string = undefined;

  beforeAll(async () => {
    indexing = new Indexing(getConfig());
    indexer_uuid = getIndexerUUID();
  });

  test('Deploy a indexer', async () => {
    const response = await indexing
      .indexer(indexer_uuid)
      .deployIndexer('D:\\Sqd\\moonbeam-squid');

    expect(response).toBeDefined();
    expect(response.lastDeploymentId).toBeTruthy();
    expect(response.status).toBe(5);
    expect(response.deployment).toBeDefined();
  });

  test('Deploy a indexer with invalid path, should return error', async () => {
    const logSpy = jest.spyOn(global.console, 'error');
    await indexing.indexer(indexer_uuid).deployIndexer('some invalid path');
    expect(logSpy).toHaveBeenCalled();
  });

  test('Deploy a indexer with valid path but invalid content, should return error', async () => {
    const logSpy = jest.spyOn(global.console, 'error');
    await indexing.indexer(indexer_uuid).deployIndexer('D:\\Sqd');
    expect(logSpy).toHaveBeenCalled();
  });
});
