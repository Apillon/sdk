import { Command } from 'commander';
import {
  burnCollectionNft,
  createCollection,
  getCollection,
  listCollections,
  listCollectionTransactions,
  mintCollectionNft,
  transferCollectionOwnership,
} from './nft.service';
import * as COMMON_OPTIONS from '../common/options';

export function createNftsCommands(cli: Command) {
  const nfts = cli.command('nfts');

  // COLLECTIONS
  const collections = nfts
    .command('collections')
    .description('NFT collections resource.');

  collections
    .command('list')
    .description('List NFT collections owned by project related to API key.')
    .addOption(COMMON_OPTIONS.page)
    .addOption(COMMON_OPTIONS.limit)
    .addOption(COMMON_OPTIONS.orderBy)
    .addOption(COMMON_OPTIONS.descending)
    .action(async function (options: Params) {
      await listCollections(options, this.optsWithGlobals());
    });

  collections
    .command('get')
    .description('Get NFT collection for specific UUID.')
    .argument('<collection-uuid>', 'Collection UUID')
    .action(async function (uuid: string) {
      await getCollection(uuid, this.optsWithGlobals());
    });

  collections
    .command('create')
    .argument('<file-path>', 'path to JSON data file')
    .action(async function (filePath: string) {
      await createCollection(filePath, this.optsWithGlobals());
    });

  collections
    .command('mint-nft')
    .description('Mint NFT for collection with UUID.')
    .argument('<collection-uuid>', 'Collection UUID')
    .requiredOption(
      '-a, --address <string>',
      'Address which will receive minted NFTs.',
    )
    .requiredOption('-q, --quantity <integer>', 'Number of NFTs to mint.')
    .action(async function (uuid: string, options: Params) {
      await mintCollectionNft(uuid, options, this.optsWithGlobals());
    });

  collections
    .command('burn-nft')
    .description('Burn NFT for collection with UUID.')
    .argument('<collection-uuid>', 'Collection UUID')
    .requiredOption('-t, --token-id <integer>', 'NFT id which will be burned.')
    .action(async function (uuid: string, options: Params) {
      await burnCollectionNft(uuid, options, this.optsWithGlobals());
    });

  collections
    .command('transfer')
    .description('Transfer NFT collection ownership to a new wallet address.')
    .argument('<collection-uuid>', 'Collection UUID')
    .requiredOption(
      '-a, --address <string>',
      'Address which you want to transferred collection ownership to.',
    )
    .action(async function (uuid: string, options: Params) {
      await transferCollectionOwnership(uuid, options, this.optsWithGlobals());
    });

  // TRANSACTIONS
  const collectionTransactions = collections
    .command('transactions')
    .description('NFT collection transactions resource.');

  collectionTransactions
    .command('list')
    .description('List NFT transactions for specific collection UUID.')
    .argument('<collection-uuid>', 'Collection UUID')
    .addOption(COMMON_OPTIONS.page)
    .addOption(COMMON_OPTIONS.limit)
    .addOption(COMMON_OPTIONS.orderBy)
    .addOption(COMMON_OPTIONS.descending)
    .action(async function (uuid: string, options: Params) {
      await listCollectionTransactions(uuid, options, this.optsWithGlobals());
    });
}
