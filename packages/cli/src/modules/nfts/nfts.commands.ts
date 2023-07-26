import { Command } from 'commander';
import {
  burnCollectionNft,
  createCollection,
  getCollection,
  listCollections,
  listCollectionTransactions,
  mintCollectionNft,
  nestMintCollectionNft,
  transferCollectionOwnership,
} from './nft.service';
import * as COMMON_OPTIONS from '../../lib/options';
import { Params } from '../../lib/types';

export function createNftsCommands(cli: Command) {
  const nfts = cli.command('nfts');

  // COLLECTIONS
  nfts
    .command('list-collections')
    .description('List NFT collections owned by project related to API key.')
    .addOption(COMMON_OPTIONS.page)
    .addOption(COMMON_OPTIONS.limit)
    .addOption(COMMON_OPTIONS.orderBy)
    .addOption(COMMON_OPTIONS.descending)
    .action(async function (options: Params) {
      await listCollections(options, this.optsWithGlobals());
    });

  nfts
    .command('get-collection')
    .description('Get NFT collection for specific UUID.')
    .argument('<collection-uuid>', 'Collection UUID')
    .action(async function (uuid: string) {
      await getCollection(uuid, this.optsWithGlobals());
    });

  nfts
    .command('create-collection')
    .argument('<file-path>', 'path to JSON data file')
    .action(async function (filePath: string) {
      await createCollection(filePath, this.optsWithGlobals());
    });

  nfts
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

  nfts
    .command('nest-mint-nft')
    .description(
      'Nest mint NFT child collection to parent collection with UUID and NFT with id.',
    )
    .argument('<collection-uuid>', 'Child collection UUID')
    .requiredOption(
      '-c, --parent-collection-uuid <string>',
      'Parent collection UUID to which child NFTs will be minted to.',
    )
    .requiredOption(
      '-n, --parent-nft-id <string>',
      'Parent collection NFT id to which child NFTs will be minted to.',
    )
    .requiredOption('-q, --quantity <integer>', 'Number of child NFTs to mint.')
    .action(async function (uuid: string, options: Params) {
      await nestMintCollectionNft(uuid, options, this.optsWithGlobals());
    });

  nfts
    .command('burn-nft')
    .description('Burn NFT for collection with UUID.')
    .argument('<collection-uuid>', 'Collection UUID')
    .requiredOption('-t, --token-id <integer>', 'NFT id which will be burned.')
    .action(async function (uuid: string, options: Params) {
      await burnCollectionNft(uuid, options, this.optsWithGlobals());
    });

  nfts
    .command('transfer-collection')
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
  nfts
    .command('list-transactions')
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
