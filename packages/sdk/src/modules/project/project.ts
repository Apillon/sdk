import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';

export class Project extends ApillonModule {
  /**
   * Base API url for project.
   */
  private API_PREFIX = '/project';

  /**
   * Get credit balance for your project
   * @returns {Promise<number>} The credit balance of your project
   */
  public async getCreditBalance(): Promise<number> {
    const { balance } = await ApillonApi.get<{ balance: number }>(
      `${this.API_PREFIX}/credit`,
    );
    return balance;
  }
}
