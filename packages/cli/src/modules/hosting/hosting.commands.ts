import { Command, Option } from 'commander';
import { addPaginationOptions } from '../../lib/options';
import {
  deployToEnvironment,
  getDeployment,
  getWebsite,
  listDeployments,
  listWebsites,
  uploadWebsiteFiles,
  deployWebsite,
} from './hosting.service';
import { DeployToEnvironment, DeploymentStatus } from '@apillon/sdk';

export function createHostingCommands(cli: Command) {
  const hosting = cli
    .command('hosting')
    .description('Commands for managing websites on Apillon hosting');

  hosting
    .command('deploy-website')
    .description(
      'Deploys website directly from local folder to Apillon hosting production environment',
    )
    .argument('<path>', 'path to folder with website files')
    .requiredOption('--uuid <website uuid>', 'UUID of website to deploy')
    .option('-p, --preview', 'deploys to staging environment')
    .action(async function (path) {
      await deployWebsite(path, this.optsWithGlobals());
    });

  const hostingList = hosting
    .command('list-websites')
    .description('List websites on Apillon hosting')
    .action(async function () {
      await listWebsites(this.optsWithGlobals());
    });
  addPaginationOptions(hostingList);

  hosting
    .command('get-website')
    .description('Returns website data')
    .requiredOption('--uuid <website uuid>', 'UUID of website to get')
    .action(async function () {
      await getWebsite(this.optsWithGlobals());
    });

  hosting
    .command('upload-files')
    .description('Uploads files from local folder to deployment bucket')
    .argument('<path>', 'path to folder with website files')
    .requiredOption(
      '--uuid <website uuid>',
      'UUID of website to upload files to',
    )
    .action(async function (path: string) {
      await uploadWebsiteFiles(path, this.optsWithGlobals());
    });

  hosting
    .command('start-deployment')
    .description(
      'Starts deployment of website from uploaded files in deployment bucket',
    )
    .requiredOption('--uuid <website uuid>', 'UUID of website to deploy')
    .addOption(
      new Option(
        '--env <environment>',
        'Sets the environment to deploy the files to. Choose from:\n' +
          `  ${DeployToEnvironment.TO_STAGING}: To Staging\n` +
          `  ${DeployToEnvironment.STAGING_TO_PRODUCTION}: Staging to Production\n` +
          `  ${DeployToEnvironment.DIRECTLY_TO_PRODUCTION}: Directly to Production`,
      )
        .choices(['1', '2', '3'])
        .makeOptionMandatory(true),
    )
    .action(async function () {
      await deployToEnvironment(this.optsWithGlobals());
    });

  const hostingListDeployments = hosting
    .command('list-deployments')
    .description('Returns list of started deployments')
    .requiredOption(
      '--uuid <website uuid>',
      'UUID of website to list deployments for',
    )
    .addOption(
      new Option(
        '--env <environment>',
        'Sets the environment to deploy the files to. Choose from:\n' +
          `  ${DeployToEnvironment.TO_STAGING}: To Staging\n` +
          `  ${DeployToEnvironment.STAGING_TO_PRODUCTION}: Staging to Production\n` +
          `  ${DeployToEnvironment.DIRECTLY_TO_PRODUCTION}: Directly to Production`,
      ).choices(Object.values(DeployToEnvironment).map((x) => `${x}`)),
    )
    .addOption(
      new Option(
        '--status <deployment-status>',
        'Status of the deployment (optional) Choose from:\n' +
          `  ${DeploymentStatus.INITIATED}: Initiated\n` +
          `  ${DeploymentStatus.IN_PROCESS}: In process\n` +
          `  ${DeploymentStatus.SUCCESSFUL}: Successful\n` +
          `  ${DeploymentStatus.FAILED}: Failed`,
      ).choices(Object.values(DeploymentStatus).map((x) => `${x}`)),
    )
    .action(async function () {
      await listDeployments(this.optsWithGlobals());
    });
  addPaginationOptions(hostingListDeployments);

  hosting
    .command('get-deployment')
    .description('Returns deployment data')
    .requiredOption('-w, --website-uuid <website uuid>', 'UUID of website')
    .requiredOption(
      '-d, --deployment-uuid <deployment uuid>',
      'UUID of deployment to get',
    )
    .action(async function () {
      await getDeployment(this.optsWithGlobals());
    });
}
