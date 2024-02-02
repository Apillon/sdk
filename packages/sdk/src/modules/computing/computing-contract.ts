import { ApillonApi } from '../../lib/apillon-api';
import { ApillonModel } from '../../lib/apillon';
import {
  ComputingContractData,
  ComputingContractStatus,
  ComputingContractType,
} from '../../types/computing';

export class ComputingContract extends ApillonModel {
  /**
   * Name of the contract.
   */
  public name: string = null;

  /**
   * Contract description.
   */
  public description: string = null;

  /**
   * The computing contract's type
   */
  public contractType: ComputingContractType = null;

  /**
   * The computing contract's status
   */
  public contractStatus: ComputingContractStatus = null;

  /**
   * The computing contract's on-chain address
   */
  public contractAddress: string = null;

  /**
   * The computing contract's on-chain deployer address
   */
  public deployerAddress: string = null;

  /**
   * The computing contract's deployment transaction hash
   */
  public transactionHash: string = null;

  /**
   * The computing contract's additional data
   */
  public data: ComputingContractData = null;

  /**
   * Constructor which should only be called via Computing class.
   * @param uuid Unique identifier of the contract.
   * @param data Data to populate computing contract with.
   */
  constructor(uuid: string, data?: Partial<ComputingContract>) {
    super(uuid);
    this.API_PREFIX = `/computing/contracts/${uuid}`;
    this.populate(data);
  }

  /**
   * Gets a computing contract.
   * @returns ComputingContract instance
   */
  async get(): Promise<ComputingContract> {
    const data = await ApillonApi.get<
      ComputingContract & { contractUuid: string }
    >(this.API_PREFIX);

    return new ComputingContract(data.contractUuid, data);
  }
}
