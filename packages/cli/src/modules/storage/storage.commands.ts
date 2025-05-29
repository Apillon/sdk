import { FileStatus } from '@apillon/sdk';
import { Command, Option } from 'commander';
import { addPaginationOptions } from '../../lib/options';
import { enumValues } from '../../lib/utils';
import { createIpnsCommands } from './ipns.commands';
import {
  createBucket,
  deleteDirectory,
  deleteFile,
  getFile,
  listBuckets,
  listFiles,
  listObjects,
  uploadFromFolder,
} from './storage.service';

export function createStorageCommands(cli: Command) {
  const storage = cli
    .command('storage')
    .description(
      'Commands for manipulating buckets and files on Apillon storage.',
    );

  createIpnsCommands(storage);

  storage
    .command('create-bucket')
    .description('Create a new storage bucket')
    .requiredOption('-n, --name <name>', 'Name of the bucket')
    .option('-d, --description <description>', 'Description of the bucket')
    .action(async function () {
      await createBucket(this.optsWithGlobals());
    });

  const listBucketsCommand = storage
    .command('list-buckets')
    .description('List project buckets')
    .action(async function () {
      await listBuckets(this.optsWithGlobals());
    });
  addPaginationOptions(listBucketsCommand);

  const listObjectsCommand = storage
    .command('list-objects')
    .description('List files and folders in directory')
    .requiredOption('-b, --bucket-uuid <uuid>', 'UUID of bucket')
    .option('-d, --directory-uuid <string>', 'Directory UUID')
    .option('--deleted', 'Include deleted objects')
    .action(async function () {
      await listObjects(this.optsWithGlobals());
    });
  addPaginationOptions(listObjectsCommand);

  const listFilesCommand = storage
    .command('list-files')
    .description('List all files from a bucket')
    .requiredOption('-b, --bucket-uuid <uuid>', 'UUID of bucket')
    .addOption(
      new Option(
        '-s, --file-status <integer>',
        'Filter by file status. Choose from:\n' +
          `  ${FileStatus.UPLOAD_REQUEST_GENERATED}: Upload request generated\n` +
          `  ${FileStatus.UPLOADED}: Uploaded\n` +
          `  ${FileStatus.AVAILABLE_ON_IPFS}: Available on IPFS\n` +
          `  ${FileStatus.AVAILABLE_ON_IPFS_AND_REPLICATED}: Available on IPFS and replicated\n`,
      ).choices(enumValues(FileStatus)),
    )
    .action(async function () {
      await listFiles(this.optsWithGlobals());
    });
  addPaginationOptions(listFilesCommand);

  storage
    .command('upload')
    .description('Upload contents of a local folder to bucket')
    .argument('<path>', 'path to local folder')
    .requiredOption('-b, --bucket-uuid <uuid>', 'UUID of destination bucket')
    .option('-w, --wrap', 'Wrap uploaded files to an IPFS directory')
    .option('-p, --path <string>', 'Path to upload files to')
    .option(
      '--await',
      'await file CIDs to be resolved (DEPRECATED - CIDs are now resolved automatically)',
    )
    .option('--ignore', 'ignore files from .gitignore file')
    .action(async function (path: string) {
      await uploadFromFolder(path, this.optsWithGlobals());
    });

  storage
    .command('get-file')
    .description('Get file info')
    .requiredOption('-b, --bucket-uuid <uuid>', 'UUID of bucket')
    .requiredOption('-f, --file-uuid <uuid>', 'UUID or CID of file to get')
    .action(async function () {
      await getFile(this.optsWithGlobals());
    });

  storage
    .command('delete-file')
    .description('Mark file for removal from IPFS storage')
    .requiredOption('-b, --bucket-uuid <uuid>', 'UUID of bucket')
    .requiredOption('-f, --file-uuid <uuid>', 'UUID or CID of file to delete')
    .action(async function () {
      await deleteFile(this.optsWithGlobals());
    });

  storage
    .command('delete-directory')
    .description('Delete a directory from a storage bucket')
    .requiredOption('-b, --bucket-uuid <uuid>', 'UUID of bucket')
    .requiredOption(
      '-d, --directory-uuid <uuid>',
      'UUID of directory to delete',
    )
    .action(async function () {
      await deleteDirectory(this.optsWithGlobals());
    });
}
