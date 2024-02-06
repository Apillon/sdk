import { ApillonApi } from '../../lib/apillon-api';
import { ApillonConfig, ApillonModel } from '../../lib/apillon';
import {
  ComputingContractData,
  ComputingContractStatus,
  ComputingContractType,
  ComputingTransactionType,
  IComputingTransaction,
  IEncryptData,
} from '../../types/computing';
import { IApillonList, IApillonPagination } from '../../types/apillon';
import { constructUrlWithQueryParams } from '../../lib/common';
import { ApillonLogger } from '../../lib/apillon-logger';
import { Storage } from '../storage/storage';
import { FileMetadata } from '../../docs-index';

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
   * The bucket where files encrypted by this contract are stored
   */
  public bucketUuid: string = null;

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
   * Apillon config used to initialize a storage module
   * for saving encrypted files
   */
  private config: ApillonConfig;

  /**
   * Constructor which should only be called via Computing class.
   * @param uuid Unique identifier of the contract.
   * @param data Data to populate computing contract with.
   */
  constructor(
    uuid: string,
    data?: Partial<ComputingContract>,
    config?: ApillonConfig,
  ) {
    super(uuid);
    this.API_PREFIX = `/computing/contracts/${uuid}`;
    this.populate(data);
    this.config = config;
  }

  /**
   * Gets a computing contract's details.
   * @returns ComputingContract instance
   */
  async get(): Promise<ComputingContract> {
    const data = await ApillonApi.get<
      ComputingContract & { contractUuid: string }
    >(this.API_PREFIX);

    return this.populate(data);
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
   * - Calls the encrypt method on the computing contract
   * - Uploads the encrypted file to the bucket
   * - Assigns the encrypted file's CID to the NFT used for decryption authentication
   * @param {IEncryptData} data The data to use for encryption.
   * @returns The encrypted data in the form of a string.
   */
  async encryptFile(data: IEncryptData): Promise<FileMetadata[]> {
    ApillonLogger.log(`Encrypting file...`);
    const { encryptedContent } = await ApillonApi.post<any>(
      `${this.API_PREFIX}/encrypt`,
      {
        ...data,
        content: data.content.toString('base64'),
      },
    );
    if (!encryptedContent) {
      throw new Error('Failed to encrypt file');
    }
    if (!this.bucketUuid) {
      await this.get();
    }

    ApillonLogger.log(`Uploading encrypted file to bucket...`);
    const files = await new Storage(this.config)
      .bucket(this.bucketUuid)
      .uploadFiles(
        [
          {
            fileName: data.fileName,
            content: Buffer.from(encryptedContent, 'utf-8'),
            contentType: 'multipart/form-data',
          },
        ],
        { awaitCid: true },
      );
    ApillonLogger.log(`Assigning file CID to NFT ID...`);
    await this.assignCidToNft({ cid: files[0].CID, nftId: data.nftId });

    return files;
  }

  /**
   * Assigns a CID to an NFT on the contract.
   * @param data The payload for assigning a CID to an NFT
   * @returns Success status
   */
  private async assignCidToNft(data: {
    cid: string;
    nftId: number;
  }): Promise<boolean> {
    const { success } = await ApillonApi.post<{ success: boolean }>(
      `${this.API_PREFIX}/assign-cid-to-nft`,
      data,
    );
    if (success) {
      ApillonLogger.log(
        `Encrypted file CID assigned successfully to NFT with ID=${data.nftId}`,
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
