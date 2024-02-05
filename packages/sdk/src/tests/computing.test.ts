import { ChainRpcUrl } from '../docs-index';
import { Computing } from '../modules/computing/computing';
import { ComputingContract } from '../modules/computing/computing-contract';
import { getComputingContractUUID, getConfig } from './helpers/helper';

describe('Computing tests', () => {
  let computing: Computing;
  let contractUuid: string;
  const name = 'Schrodinger SDK Test';
  const description = 'Schrodinger SDK Test computing contract';
  const nftContractAddress = '0xe6C61ef02729a190Bd940A3077f8464c27C2E593';

  beforeAll(() => {
    computing = new Computing(getConfig());
    contractUuid = getComputingContractUUID();
  });

  test('Create new contracts', async () => {
    const contract = await computing.createContract({
      name,
      description,
      nftContractAddress,
      nftChainRpcUrl: ChainRpcUrl.MOONBASE,
    });
    expect(contract).toBeInstanceOf(ComputingContract);
    expect(contract.name).toEqual(name);
    expect(contract.description).toEqual(description);
    expect(contract.uuid).toBeTruthy();
    expect(contract.data.nftContractAddress).toEqual(nftContractAddress);
    expect(contract.data.nftChainRpcUrl).toEqual(ChainRpcUrl.MOONBASE);

    contractUuid = contract.uuid;
  });

  test('List contracts', async () => {
    const { items } = await computing.listContracts();

    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach((contract) => {
      expect(contract instanceof ComputingContract).toBeTruthy();
      expect(contract.name).toBeTruthy();
    });
    expect(
      items.find((contract) => contract.uuid === contractUuid),
    ).toBeTruthy();
  });

  test('Get specific contract', async () => {
    const contract = await computing.contract(contractUuid).get();

    expect(contract).toBeInstanceOf(ComputingContract);
    expect(contract.name).toEqual(name);
    expect(contract.description).toEqual(description);
    expect(contract.uuid).toEqual(contractUuid);
    expect(contract.data.nftContractAddress).toEqual(nftContractAddress);
    expect(contract.data.nftChainRpcUrl).toEqual(ChainRpcUrl.MOONBASE);
  });
});
