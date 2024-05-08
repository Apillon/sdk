import { getConfig } from './helpers/helper';
import { Project } from '../modules/project/project';

describe('Project Module tests', () => {
  let project: Project;

  beforeAll(async () => {
    project = new Project(getConfig());
  });

  describe('Project module tests', () => {
    test('Get project credit balance', async () => {
      const balance = await project.getCreditBalance();
      expect(balance).toBeGreaterThan(0);
    });
  });
});
