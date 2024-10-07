import { Command } from 'commander';
import { deployIndexer } from './indexing.service';

export function createNftsCommands(cli: Command) {
  const indexing = cli
    .command('indexing')
    .description(
      'Commands for management & deployment of indexers on Apillon platform',
    );

  indexing
    .command('deploy-indexer')
    .description('Deploy and indexer')
    .argument('<path>', 'path to indexer root folder')
    .requiredOption('-i, --indexer-uuid <uuid>', 'UUID of indexer')
    .action(async function (path: string) {
      await deployIndexer(path, this.optsWithGlobals());
    });
}
