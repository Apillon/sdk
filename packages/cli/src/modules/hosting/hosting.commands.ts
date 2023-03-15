import { Command } from 'commander';
import { deployWebsite } from './hosting.service';

export function createHostingCommands(cli: Command) {
  const hosting = cli.command('hosting');

  const hostingDeploy = hosting
    .command('deploy-website')
    .argument('<path>', 'path to folder with website files')
    .requiredOption('--uuid <website uuid>', 'UUID of website to deploy')
    .option('-p, --preview', 'deploys to staging environment')
    .action(async function (path) {
      await deployWebsite(path, this.optsWithGlobals());
    });
}
