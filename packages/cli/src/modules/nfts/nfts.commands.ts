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
import { addPaginationOptions } from '../../lib/options';

export function createNftsCommands(cli: Command) {
  const nfts = cli
    .command('nfts')
    .description(
      'Commands for managing NFT collections and tokens on Apillon platform',
    );

  // COLLECTIONS
  const listCollectionsCommand = nfts
    .command('list-collections')
    .description('List NFT collections owned by project')
    .addOption(
      new Option(
        '--status <integer>',
        'Collection status (CollectionStatus enum)',
      ),
    )
    .action(async function () {
      await listCollections(this.optsWithGlobals());
    });
  addPaginationOptions(listCollectionsCommand);

  nfts
    .command('get-collection')
    .description('Get NFT collection details.')
    .requiredOption('--uuid <collection uuid>', 'Collection UUID')
    .action(async function () {
      await getCollection(this.optsWithGlobals());
    });

  nfts
    .command('create-collection')
    .description('Create NFT collection from JSON file')
    .argument('<file-path>', 'path to JSON data file of type ICreateCollection')
    .action(async function (filePath: string) {
      await createCollection(filePath, this.optsWithGlobals());
    });

  nfts
    .command('mint-nft')
    .description('Mint NFT from collection')
    .requiredOption('--uuid <collection uuid>', 'Collection UUID')
    .requiredOption(
      '-a, --address <string>',
      'Address which will receive minted NFTs.',
    )
    .requiredOption('-q, --quantity <integer>', 'Number of NFTs to mint.')
    .action(async function () {
      await mintCollectionNft(this.optsWithGlobals());
    });

  nfts
    .command('nest-mint-nft')
    .description('Nest mint NFT child collection to parent NFT')
    .requiredOption('--uuid <collection uuid>', 'Child collection UUID')
    .requiredOption(
      '-c, --parent-collection-uuid <string>',
      'Parent collection UUID to which child NFTs will be minted to.',
    )
    .requiredOption(
      '-pid, --parent-nft-id <string>',
      'Parent NFT id to which child NFTs will be minted to',
    )
    .requiredOption(
      '-q, --quantity <integer>',
      'Number of child NFTs to mint',
      '1',
    )
    .action(async function () {
      await nestMintCollectionNft(this.optsWithGlobals());
    });

  nfts
    .command('burn-nft')
    .description('Burn NFT token')
    .requiredOption('--uuid <collection uuid>', 'Collection UUID')
    .requiredOption('-tid, --token-id <integer>', 'NFT ID which will be burned')
    .action(async function () {
      await burnCollectionNft(this.optsWithGlobals());
    });

  nfts
    .command('transfer-collection')
    .description('Transfer NFT collection ownership to a new wallet address')
    .requiredOption('--uuid <collection uuid>', 'Collection UUID')
    .requiredOption(
      '-a, --address <string>',
      'Address which you want to transferred collection ownership to',
    )
    .action(async function () {
      await transferCollectionOwnership(this.optsWithGlobals());
    });

  // TRANSACTIONS
  const listCollectionTransactionsCommand = nfts
    .command('list-transactions')
    .description('List NFT transactions for specific collection')
    .requiredOption('--uuid <collection uuid>', 'Collection UUID')
    .addOption(
      new Option(
        '--status <integer>',
        'Transaction status (TransactionStatus enum)',
      ),
    )
    .addOption(
      new Option(
        '-t, --type <integer>',
        'Transaction type (TransactionType enum)',
      ),
    )
    .action(async function () {
      await listCollectionTransactions(this.optsWithGlobals());
    });
  addPaginationOptions(listCollectionTransactionsCommand);
}
