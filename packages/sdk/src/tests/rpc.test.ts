import { Rpc } from '../modules/rpc/rpc';
import { RpcApiKey } from '../modules/rpc/rpc-api-key';
import { getConfig } from './helpers/helper';

describe('Rpc Module tests', () => {
  let rpc: Rpc;
  let apiKeyId: number;

  beforeAll(() => {
    rpc = new Rpc(getConfig());
  });

  test('Create new API key', async () => {
    const apiKeyData = {
      name: 'Test API Key',
      description: 'Test Description',
    };
    const apiKey = await rpc.createApiKey(apiKeyData);

    expect(apiKey).toBeInstanceOf(RpcApiKey);
    expect(apiKey.name).toEqual(apiKeyData.name);
    expect(apiKey.description).toEqual(apiKeyData.description);
    expect(apiKey.uuid).toBeTruthy();
    expect(apiKey.id).toBeTruthy();

    apiKeyId = apiKey.id;
  });

  test('List API keys', async () => {
    const { items } = await rpc.listApiKeys();

    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach((apiKey) => {
      expect(apiKey).toBeInstanceOf(RpcApiKey);
      expect(apiKey.name).toBeTruthy();
      expect(apiKey.uuid).toBeTruthy();
      expect(apiKey.id).toBeTruthy();
    });
  });

  test('Get specific API key', async () => {
    const apiKey = await rpc.apiKey(apiKeyId).get();

    expect(apiKey).toBeInstanceOf(RpcApiKey);
    expect(apiKey.id).toEqual(apiKeyId);
    expect(apiKey.urls.length).toBeGreaterThan(0);
  });

  test('List endpoints', async () => {
    const endpoints = await rpc.listEndpoints();

    expect(Array.isArray(endpoints)).toBeTruthy();
    expect(endpoints.length).toBeGreaterThanOrEqual(0);

    endpoints.forEach((endpoint) => {
      expect(endpoint).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        imageUrl: expect.any(String),
        type: expect.any(String),
        version: expect.any(String),
        networkName: expect.any(String),
        networkId: expect.any(Number),
      });
    });
  });
});
