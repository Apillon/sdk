import { Command } from 'commander';
import {
  createCloudFunction,
  listCloudFunctions,
  getCloudFunction,
  createCloudFunctionJob,
  setCloudFunctionEnvironment,
  listCloudFunctionJobs,
  deleteCloudFunctionJob,
} from './cloud-functions.service';
import { addPaginationOptions } from '../../lib/options';

export function createCloudFunctionsCommands(cli: Command) {
  const cloudFunctions = cli
    .command('cloud-functions')
    .description('Commands for managing cloud functions on Apillon platform');

  // CLOUD FUNCTIONS
  const listCloudFunctionsCommand = cloudFunctions
    .command('list')
    .description('List all cloud functions')
    .action(async function () {
      await listCloudFunctions(this.optsWithGlobals());
    });
  addPaginationOptions(listCloudFunctionsCommand);

  cloudFunctions
    .command('get')
    .description('Get details of a specific cloud function')
    .requiredOption('--uuid <cloud-function-uuid>', 'Cloud Function UUID')
    .action(async function () {
      await getCloudFunction(this.optsWithGlobals());
    });

  cloudFunctions
    .command('create')
    .description('Create a new cloud function')
    .requiredOption('--name <name>', 'Name of the cloud function')
    .option('--description <description>', 'Description of the cloud function')
    .action(async function () {
      await createCloudFunction(this.optsWithGlobals());
    });

  // JOBS
  cloudFunctions
    .command('create-job')
    .description('Create a job for a cloud function from a script file')
    .requiredOption('--uuid <cloud-function-uuid>', 'Cloud Function UUID')
    .requiredOption('--name <job-name>', 'Name of the job')
    .requiredOption('--script <path>', 'Path to the script file')
    .action(async function () {
      await createCloudFunctionJob(this.optsWithGlobals());
    });

  cloudFunctions
    .command('set-environment')
    .description('Set environment variables for a cloud function')
    .requiredOption('--uuid <cloud-function-uuid>', 'Cloud Function UUID')
    .requiredOption(
      '--variables <variables>',
      'Environment variables in key=value format, separated by commas',
    )
    .action(async function () {
      await setCloudFunctionEnvironment(this.optsWithGlobals());
    });

  cloudFunctions
    .command('list-jobs')
    .description('List all jobs for a specific cloud function')
    .requiredOption('--uuid <cloud-function-uuid>', 'Cloud Function UUID')
    .action(async function () {
      await listCloudFunctionJobs(this.optsWithGlobals());
    });

  cloudFunctions
    .command('delete-job')
    .description('Delete a job from a cloud function')
    .requiredOption('-j, --job-uuid <job-uuid>', 'Job UUID to delete')
    .action(async function () {
      await deleteCloudFunctionJob(this.optsWithGlobals());
    });
}
