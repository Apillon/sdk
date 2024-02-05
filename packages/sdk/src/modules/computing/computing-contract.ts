import { ApillonApi } from '../../lib/apillon-api';
import { ApillonModel } from '../../lib/apillon';
import {
  ComputingContractData,
  ComputingContractStatus,
  ComputingContractType,
  ComputingTransactionType,
  IAssignCidToNftData,
  IComputingTransaction,
  IEncryptData,
} from '../../types/computing';
import { IApillonList, IApillonPagination } from '../../types/apillon';
import { constructUrlWithQueryParams } from '../../lib/common';
import { ApillonLogger } from '../../lib/apillon-logger';

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
   * Gets a computing contract's details.
   * @returns ComputingContract instance
   */
  async get(): Promise<ComputingContract> {
    const data = await ApillonApi.get<
      ComputingContract & { contractUuid: string }
    >(this.API_PREFIX);

    return new ComputingContract(data.contractUuid, data);
  }

  /**
   * Gets list of transactions for this computing contract.
   * @param {IApillonPagination} params Pagination filters.
   * @returns List of transactions.
   */
  public async listTransactions(
    params?: IApillonPagination,
  ): Promise<IApillonList<IComputingTransaction>> {
    const url = constructUrlWithQueryParams(
      `${this.API_PREFIX}/transactions`,
      params,
    );
    return await ApillonApi.get<IApillonList<IComputingTransaction>>(url);
  }

  /**
   * Transfers ownership of the computing contract.
   * @param {string} accountAddress The address of the new owner.
   * @returns Success status
   */
  async transferOwnership(accountAddress: string): Promise<boolean> {
    const { success } = await ApillonApi.post<{ success: boolean }>(
      `${this.API_PREFIX}/transfer-ownership`,
      { accountAddress },
    );
    if (success) {
      ApillonLogger.log(
        `Ownership transferred successfully to ${accountAddress}`,
      );
    }
    return success;
  }

  /**
   * Calls the encrypt method on the computing contract.
   * @param {IEncryptData} data The data to use for encryption.
   * @returns The encrypted data in the form of a string.
   */
  async encrypt(data: IEncryptData): Promise<any> {
    return ApillonApi.post<{ encryptedContent: string }>(
      `${this.API_PREFIX}/encrypt`,
      data,
    );
  }

  /**
   * Assigns a CID to an NFT on the contract.
   * @param {IAssignCidToNftData} data The payload for assigning a CID to an NFT
   * @returns Success status
   */
  async assignCidToNft(data: IAssignCidToNftData): Promise<boolean> {
    const { success } = await ApillonApi.post<{ success: boolean }>(
      `${this.API_PREFIX}/assign-cid-to-nft`,
      data,
    );
    if (success) {
      ApillonLogger.log(
        `CID assigned successfully to NFT with ID=${data.nftId}`,
      );
    }
    return success;
  }

  protected override serializeFilter(key: string, value: any) {
    const serialized = super.serializeFilter(key, value);
    const enums = {
      contractType: ComputingContractType[serialized],
      contractStatus: ComputingContractStatus[serialized],
      transactionType: ComputingTransactionType[serialized],
      transactionStatus: ComputingContractStatus[serialized],
    };
    return Object.keys(enums).includes(key) ? enums[key] : serialized;
  }
}
