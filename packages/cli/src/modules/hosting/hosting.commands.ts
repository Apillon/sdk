import { Command, Option } from 'commander';
import { addPaginationOptions } from '../../lib/options';
import {
  deployToEnvironment,
  getDeployment,
  getWebsite,
  listDeployments,
  listWebsites,
  uploadWebsiteFiles,
} from './hosting.service';

export function createHostingCommands(cli: Command) {
  const hosting = cli.command('hosting');

  const hostingList = hosting
    .command('list-websites')
    .action(async function () {
      await listWebsites(this.optsWithGlobals());
    });
  addPaginationOptions(hostingList);

  hosting
    .command('get-website')
    .requiredOption('--uuid <website uuid>', 'UUID of website to get')
    .action(async function () {
      await getWebsite(this.optsWithGlobals());
    });

  hosting
    .command('upload')
    .argument('<path>', 'path to folder with website files')
    .requiredOption(
      '--uuid <website uuid>',
      'UUID of website to upload files to',
    )
    .action(async function (path: string) {
      await uploadWebsiteFiles(path, this.optsWithGlobals());
    });

  hosting
    .command('deploy')
    .requiredOption('--uuid <website uuid>', 'UUID of website to deploy')
    .addOption(
      new Option('--env <environment>', 'Environment to deploy to')
        .choices(['1', '2', '3'])
        .makeOptionMandatory(true),
    )
    .action(async function () {
      await deployToEnvironment(this.optsWithGlobals());
    });

  const hostingListDeployments = hosting
    .command('list-deployments')
    .requiredOption(
      '--uuid <website uuid>',
      'UUID of website to list deployments for',
    )
    .option('--env <environment', 'environment of the deployments')
    .option('--status <deployment-status>', 'deployment status')
    .action(async function () {
      await listDeployments(this.optsWithGlobals());
    });
  addPaginationOptions(hostingListDeployments);

  hosting
    .command('get-deployment')
    .requiredOption('--uuid <website uuid>', 'UUID of website')
    .requiredOption(
      '--deployment-uuid <deployment uuid>',
      'UUID of deployment to get',
    )
    .action(async function () {
      await getDeployment(this.optsWithGlobals());
    });
}
