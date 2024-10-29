import { Indexing } from '../modules/indexing/indexing';
import { getConfig, getIndexerUUID } from './helpers/helper';

describe('Indexing tests', () => {
  let indexing: Indexing;
  let indexer_uuid: string;

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
    await expect(
      indexing.indexer(getIndexerUUID()).deployIndexer('some invalid path'),
    ).rejects.toThrow('Path does not exist');
  });

  test('Deploy a indexer with valid path but invalid content, should return error', async () => {
    await expect(
      indexing.indexer(getIndexerUUID()).deployIndexer('D:\\Sqd'),
    ).rejects.toThrow('squid.yaml not found in directory');
  });
});
