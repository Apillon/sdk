import { Command } from 'commander';
import {
  listIpnsNames,
  createIpns,
  getIpns,
  publishIpns,
  deleteIpns,
} from './ipns.service';

export function createIpnsCommands(storageCli: Command) {
  const ipns = storageCli
    .command('ipns')
    .requiredOption('-b, --bucket-uuid <uuid>', 'UUID of bucket')
    .description(
      'Subcommands for manipulating IPNS records in a storage bucket',
    );

  ipns
    .command('list')
    .description('List all IPNS records for this bucket')
    .action(async function () {
      await listIpnsNames(this.optsWithGlobals());
    });

  ipns
    .command('create')
    .description('Create a new IPNS record for this bucket')
    .requiredOption('-n, --name <name>', 'Name of the IPNS record')
    .option('-d, --description <description>', 'Description of the IPNS record')
    .option('-c, --cid <cid>', 'CID to which this IPNS name will point')
    .action(async function () {
      await createIpns(this.optsWithGlobals());
    });

  ipns
    .command('get')
    .description('Get IPNS details')
    .requiredOption('-i, --ipns-uuid <uuid>', 'UUID of the IPNS record')
    .action(async function () {
      await getIpns(this.optsWithGlobals());
    });

  ipns
    .command('publish')
    .description('Publish an IPNS record to IPFS and link it to a CID')
    .requiredOption('-i, --ipns-uuid <uuid>', 'UUID of the IPNS record')
    .requiredOption(
      '-c, --cid <string>',
      'CID to which this IPNS name will point',
    )
    .action(async function () {
      await publishIpns(this.optsWithGlobals());
    });

  ipns
    .command('delete')
    .description('Delete an IPNS record from the bucket')
    .requiredOption('-i, --ipns-uuid <uuid>', 'UUID of the IPNS record')
    .action(async function () {
      await deleteIpns(this.optsWithGlobals());
    });
}
