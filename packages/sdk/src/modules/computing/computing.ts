import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList } from '../../types/apillon';
import { IContractFilters } from '../../types/computing';
import { ComputingContract } from './computing-contract';

export class Computing extends ApillonModule {
  /**
   * API url for computing.
   */
  private API_PREFIX = '/computing/contracts';

  /**
   * Lists all computing contracts.
   * @param {IContractFilters} params Filter for listing collections.
   * @returns Array of ComputingContract objects.
   */
  public async listContracts(
    params?: IContractFilters,
  ): Promise<IApillonList<ComputingContract>> {
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const data = await ApillonApi.get<
      IApillonList<ComputingContract & { contractUuid: string }>
    >(url);

    return {
      ...data,
      items: data.items.map(
        (contract) => new ComputingContract(contract.contractUuid, contract),
      ),
    };
  }

  /**
   * @param uuid Unique contract identifier.
   * @returns An instance of ComputingContract.
   */
  public contract(uuid: string): ComputingContract {
    return new ComputingContract(uuid);
  }
}
