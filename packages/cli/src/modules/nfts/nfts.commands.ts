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
import {
  CollectionStatus,
  TransactionStatus,
  TransactionType,
} from '@apillon/sdk';
import { enumValues } from '../../lib/utils';

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
        '--status <collection-status>',
        'Status of the collection (optional) Choose from:\n' +
          `  ${CollectionStatus.CREATED}: Created\n` +
          `  ${CollectionStatus.DEPLOY_INITIATED}: Deploy Initiated\n` +
          `  ${CollectionStatus.DEPLOYING}: Deploying\n` +
          `  ${CollectionStatus.DEPLOYED}: Deployed\n` +
          `  ${CollectionStatus.TRANSFERRED}: Transferred\n` +
          `  ${CollectionStatus.FAILED}: Failed\n`,
      ).choices(enumValues(CollectionStatus)),
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
    .requiredOption('-q, --quantity <integer>', 'Number of NFTs to mint.', '1')
    .action(async function () {
      await mintCollectionNft(this.optsWithGlobals());
    });

  nfts
    .command('nest-mint-nft')
    .description('Nest mint NFT child collection to parent NFT')
    .requiredOption('--uuid <collection uuid>', 'Child collection UUID')
    .requiredOption(
      '-c, --parent-collection <string>',
      'Parent collection UUID to which child NFTs will be minted to.',
    )
    .requiredOption(
      '-p, --parent-nft <string>',
      'Parent NFT ID to which child NFTs will be minted to',
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
    .requiredOption('-t, --token-id <integer>', 'NFT ID which will be burned')
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
        '--status <transaction-status>',
        'Status of the transaction (optional) Choose from:\n' +
          `  ${TransactionStatus.PENDING}: Pending\n` +
          `  ${TransactionStatus.CONFIRMED}: Confirmed\n` +
          `  ${TransactionStatus.FAILED}: Failed\n` +
          `  ${TransactionStatus.ERROR}: Error\n`,
      ).choices(enumValues(TransactionStatus)),
    )
    .addOption(
      new Option(
        '-t, --type <transaction-type>',
        'Transaction type (optional) Choose from:\n' +
          `  ${TransactionType.DEPLOY_CONTRACT}: Deploy Contract\n` +
          `  ${TransactionType.TRANSFER_CONTRACT_OWNERSHIP}: Transfer Contract Ownership\n` +
          `  ${TransactionType.MINT_NFT}: Mint NFT\n` +
          `  ${TransactionType.SET_COLLECTION_BASE_URI}: Set Collection Base URI\n` +
          `  ${TransactionType.BURN_NFT}: Burn NFT\n` +
          `  ${TransactionType.NEST_MINT_NFT}: Nest Mint NFT\n`,
      ).choices(enumValues(TransactionType)),
    )
    .action(async function () {
      await listCollectionTransactions(this.optsWithGlobals());
    });
  addPaginationOptions(listCollectionTransactionsCommand);
}
