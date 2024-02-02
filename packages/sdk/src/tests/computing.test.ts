import { Computing } from '../modules/computing/computing';
import { ComputingContract } from '../modules/computing/computing-contract';
import { getComputingContractUUID, getConfig } from './helpers/helper';

describe('Computing tests', () => {
  let computing: Computing;
  let contractUuid: string;

  beforeAll(() => {
    computing = new Computing(getConfig());
    contractUuid = getComputingContractUUID();
  });

  test('List contracts', async () => {
    const { items } = await computing.listContracts();
    expect(items.length).toBeGreaterThanOrEqual(0);
    items.forEach((contract) => {
      expect(contract instanceof ComputingContract).toBeTruthy();
      expect(contract.name).toBeTruthy();
    });
  });

  test('Get specific contract', async () => {
    const contract = computing.contract(contractUuid);
    expect(contract).toBeInstanceOf(ComputingContract);
    expect(contract.uuid).toEqual(contractUuid);
  });
});
