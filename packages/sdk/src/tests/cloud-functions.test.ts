import { CloudFunctions } from '../modules/cloud-functions/cloud-functions';
import { CloudFunction } from '../modules/cloud-functions/cloud-function';
import { CloudFunctionJob } from '../modules/cloud-functions/cloud-function-job';
import { getConfig } from './helpers/helper';

describe('Cloud Functions tests', () => {
  let cloudFunctions: CloudFunctions;
  let cloudFunctionUuid: string;

  const name = 'SDK Cloud Function Test';
  const description = 'SDK Cloud Function Test description';

  beforeAll(() => {
    cloudFunctions = new CloudFunctions(getConfig());
  });

  test('Create new cloud function', async () => {
    const cloudFunction = await cloudFunctions.createCloudFunction({
      name,
      description,
    });
    expect(cloudFunction).toBeInstanceOf(CloudFunction);
    expect(cloudFunction.name).toEqual(name);
    expect(cloudFunction.description).toEqual(description);
    expect(cloudFunction.uuid).toBeTruthy();

    cloudFunctionUuid = cloudFunction.uuid;
  });

  test('List cloud functions', async () => {
    const { items } = await cloudFunctions.listCloudFunctions({
      limit: 10,
    });

    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach((cloudFunction) => {
      expect(cloudFunction instanceof CloudFunction).toBeTruthy();
      expect(cloudFunction.name).toBeTruthy();
    });
    expect(
      items.find((cloudFunction) => cloudFunction.uuid === cloudFunctionUuid),
    ).toBeTruthy();
  });

  test('Get specific cloud function', async () => {
    const cloudFunction = await cloudFunctions
      .cloudFunction(cloudFunctionUuid)
      .get();

    expect(cloudFunction).toBeInstanceOf(CloudFunction);
    expect(cloudFunction.name).toEqual(name);
    expect(cloudFunction.description).toEqual(description);
    expect(cloudFunction.uuid).toEqual(cloudFunctionUuid);
  });

  test('Create a job for a cloud function', async () => {
    const job = await cloudFunctions
      .cloudFunction(cloudFunctionUuid)
      .createJob({
        name: 'Job 1',
        scriptCid: 'QmYtHkLrtGEybxXg53swTHuKPYMXQCbHGeBqpYjYbaVyFV',
      });

    expect(job).toBeInstanceOf(CloudFunctionJob);
    expect(job.name).toEqual('Job 1');
    expect(job.scriptCid).toEqual(
      'QmYtHkLrtGEybxXg53swTHuKPYMXQCbHGeBqpYjYbaVyFV',
    );
  });

  test('Set environment variables for a cloud function', async () => {
    const environmentVariables = [
      { key: 'VAR1', value: 'value1' },
      { key: 'VAR2', value: 'value2' },
    ];

    await cloudFunctions
      .cloudFunction(cloudFunctionUuid)
      .setEnvironment({ variables: environmentVariables });

    const cloudFunction = await cloudFunctions
      .cloudFunction(cloudFunctionUuid)
      .get();

    expect(cloudFunction).toBeInstanceOf(CloudFunction);
    expect(cloudFunction.uuid).toEqual(cloudFunctionUuid);
  });

  test('List jobs for a cloud function', async () => {
    const { jobs } = await cloudFunctions
      .cloudFunction(cloudFunctionUuid)
      .get();

    expect(jobs.length).toBeGreaterThanOrEqual(0);
    jobs.forEach((job) => {
      expect(job instanceof CloudFunctionJob).toBeTruthy();
      expect(job.name).toBeTruthy();
    });
  });

  test('Delete a job for a cloud function', async () => {
    const { jobs } = await cloudFunctions
      .cloudFunction(cloudFunctionUuid)
      .get();

    await jobs[0].delete();
    const { jobs: updatedJobs } = await cloudFunctions.cloudFunction(
      cloudFunctionUuid,
    );
    expect(updatedJobs.find((j) => j.uuid === jobs[0].uuid)).toBeUndefined();
  });
});
