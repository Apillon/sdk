import { ApillonModule } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { constructUrlWithQueryParams } from '../../lib/common';
import { IApillonList } from '../../types/apillon';
import {
  IContractListFilters,
  ICreateComputingContract,
} from '../../types/computing';
import { ComputingContract } from './computing-contract';

export class Computing extends ApillonModule {
  /**
   * API url for computing.
   */
  private API_PREFIX = '/computing/contracts';

  /**
   * Lists all computing contracts.
   * @param {IContractListFilters} params Filter for listing collections.
   * @returns Array of ComputingContract objects.
   */
  public async listContracts(
    params?: IContractListFilters,
  ): Promise<IApillonList<ComputingContract>> {
    const url = constructUrlWithQueryParams(this.API_PREFIX, params);

    const data = await ApillonApi.get<
      IApillonList<ComputingContract & { contractUuid: string }>
    >(url);

    return {
      ...data,
      items: data.items.map(
        (contract) =>
          new ComputingContract(contract.contractUuid, contract, this.config),
      ),
    };
  }

  /**
   * Creates a new computing contract based on the provided data.
   * @param {ICreateComputingContract} data Data for creating the contract.
   * @returns {ComputingContract} Newly created computing contract.
   */
  public async createContract(
    data: ICreateComputingContract,
  ): Promise<ComputingContract> {
    const contract = await ApillonApi.post<
      ComputingContract & { contractUuid: string }
    >(this.API_PREFIX, {
      ...data,
      restrictToOwner: data.restrictToOwner || false,
      contractType: 1, // Hardcoded until new type is added
    });
    return new ComputingContract(contract.contractUuid, contract, this.config);
  }

  /**
   * @param uuid Unique contract identifier.
   * @returns An instance of ComputingContract.
   */
  public contract(uuid: string): ComputingContract {
    return new ComputingContract(uuid, null, this.config);
  }
}
