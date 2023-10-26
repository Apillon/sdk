import { Command, Option } from 'commander';
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
import { Options } from '../../lib/types';
import { addPaginationOptions } from '../../lib/options';

export function createNftsCommands(cli: Command) {
  const nfts = cli.command('nfts');

  // COLLECTIONS
  const listCollectionsCommand = nfts
    .command('list-collections')
    .description('List NFT collections owned by project related to API key.')
    .addOption(new Option('-s, --status <integer>', 'Collection status'))
    .action(async function (options: Options) {
      await listCollections(options, this.optsWithGlobals());
    });
  addPaginationOptions(listCollectionsCommand);

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
    .requiredOption('-n, --number <integer>', 'Number of NFTs to mint.')
    .action(async function (uuid: string, options: Options) {
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
      '-i, --parent-nft-id <string>',
      'Parent collection NFT id to which child NFTs will be minted to.',
    )
    .requiredOption('-n, --number <integer>', 'Number of child NFTs to mint.')
    .action(async function (uuid: string, options: Options) {
      await nestMintCollectionNft(uuid, options, this.optsWithGlobals());
    });

  nfts
    .command('burn-nft')
    .description('Burn NFT for collection with UUID.')
    .argument('<collection-uuid>', 'Collection UUID')
    .requiredOption('-t, --token-id <integer>', 'NFT id which will be burned.')
    .action(async function (uuid: string, options: Options) {
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
    .action(async function (uuid: string, options: Options) {
      await transferCollectionOwnership(uuid, options, this.optsWithGlobals());
    });

  // TRANSACTIONS
  const listCollectionTransactionsCommand = nfts
    .command('list-transactions')
    .description('List NFT transactions for specific collection UUID.')
    .argument('<collection-uuid>', 'Collection UUID')
    .addOption(new Option('-s, --status <integer>', 'Transaction status'))
    .addOption(new Option('-t, --type <integer>', 'Transaction type'))
    .action(async function (uuid: string, options: Options) {
      await listCollectionTransactions(uuid, options, this.optsWithGlobals());
    });
  addPaginationOptions(listCollectionTransactionsCommand);
}
