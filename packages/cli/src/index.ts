#!/usr/bin/env node

import chalk from 'chalk';
import { Command, Option } from 'commander';
import config from './config';
import { createHostingCommands } from './modules/hosting/hosting.commands';
import { createNftsCommands } from './modules/nfts/nfts.commands';
import { createStorageCommands } from './modules/storage/storage.commands';
import { createCloudFunctionsCommands } from './modules/cloud-functions/cloud-functions.commands';

const cli = new Command('apillon').version(config.VERSION);
cli.addHelpText(
  'beforeAll',
  chalk.black.bgYellow(`
 ▶◀ Apillon CLI v${config.VERSION} ▶◀
`),
);
cli.addHelpText(
  'afterAll',
  chalk.yellow(`
Find more help at wiki.apillon.io/build/6-apillon-cli.html
`),
);

cli.addOption(
  new Option('--key <api key>', 'Apillon API key')
    .env('APILLON_API_KEY')
    .makeOptionMandatory(),
);
cli.addOption(
  new Option('--secret <api secret>', 'Apillon API secret')
    .env('APILLON_API_SECRET')
    .makeOptionMandatory(),
);

cli.addOption(
  new Option('--debug', 'Output debug messages').env('APILLON_DEBUG'),
);

cli.configureHelp({
  showGlobalOptions: true,
  sortOptions: true,
  sortSubcommands: true,
});

cli.showHelpAfterError('Run with --help for additional information!');

createStorageCommands(cli);
createHostingCommands(cli);
createNftsCommands(cli);
createCloudFunctionsCommands(cli);

cli.parse();
