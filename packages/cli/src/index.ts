#!/usr/bin/env node

import chalk from 'chalk';
import { Command, Option } from 'commander';
import config from './config';
import { createHostingCommands } from './modules/hosting/hosting.commands';
import { createNftsCommands } from './modules/nfts/nfts.commands';

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
Find more help at wiki.apillon.io!
`),
);

cli.addOption(
  new Option('--key <api key>', 'Apillon API key').env('APILLON_API_KEY'),
);
cli.addOption(
  new Option('--secret <api secret>', 'Apillon API secret').env(
    'APILLON_API_SECRET',
  ),
);
cli.addOption(
  new Option('--api-url <api url>', 'Apillon API secret')
    .env('APILLON_API_URL')
    .default('https://api.apillon.io', 'Production API url'),
);
cli.configureHelp({
  showGlobalOptions: true,
  sortOptions: true,
  sortSubcommands: true,
});

cli.showHelpAfterError('Run with --help for additional information!');

createHostingCommands(cli);
// const storage = createStorageCommands(cli);
createNftsCommands(cli);

cli.parse();
