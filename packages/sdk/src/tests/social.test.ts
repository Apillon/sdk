import { Social } from '../modules/social/social';
import { getConfig } from './helpers/helper';

describe('Social tests', () => {
  let social: Social;
  let hubUuid: string;
  let channelUuid: string;

  const hubData = {
    name: 'Test Hub',
    about: 'This is a test hub',
    tags: 'sdk,test,hub',
  };
  const channelData = {
    title: 'Test Channel',
    body: 'This is a test channel',
    tags: 'sdk,test,channel',
  };

  beforeAll(async () => {
    social = new Social(getConfig());
  });

  test('Create a new Hub', async () => {
    const hub = await social.createHub(hubData);
    expect(hub.uuid).toBeDefined();
    expect(hub.name).toEqual(hubData.name);
    expect(hub.about).toEqual(hubData.about);
    expect(hub.tags).toEqual(hubData.tags);
    hubUuid = hub.uuid;
  });

  test('Get Hub', async () => {
    const hub = await social.hub(hubUuid).get();
    expect(hub.uuid).toEqual(hubUuid);
    expect(hub.name).toEqual(hubData.name);
    expect(hub.about).toEqual(hubData.about);
    expect(hub.tags).toEqual(hubData.tags);
  });

  test('List Hubs', async () => {
    const response = await social.listHubs();
    expect(response.items.length).toBeGreaterThanOrEqual(1);
    expect(response.items.every((h) => !!h.uuid));
    expect(response.items.some((h) => h.uuid === hubUuid));
  });

  test('Create a new Channel', async () => {
    const channel = await social.createChannel({
      ...channelData,
      // hubUuid,
    });
    expect(channel.uuid).toBeDefined();
    expect(channel.title).toEqual(channelData.title);
    expect(channel.body).toEqual(channelData.body);
    expect(channel.tags).toEqual(channelData.tags);
    channelUuid = channel.uuid;
  });

  test('Get Channel', async () => {
    const channel = await social.channel(channelUuid).get();
    expect(channel.uuid).toEqual(channelUuid);
    expect(channel.title).toEqual(channelData.title);
    expect(channel.body).toEqual(channelData.body);
    expect(channel.tags).toEqual(channelData.tags);
  });

  test('List Channels', async () => {
    const response = await social.listChannels();
    expect(response.items.length).toBeGreaterThanOrEqual(1);
    expect(response.items.every((c) => !!c.uuid));
    expect(response.items.some((c) => c.uuid === channelUuid));
  });
});
