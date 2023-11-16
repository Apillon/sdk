import { Command } from 'commander';
import { addPaginationOptions } from '../../lib/options';
import {
  listBuckets,
  listObjects,
  listFiles,
  uploadFromFolder,
  getFile,
  deleteFile,
} from './storage.service';

export function createStorageCommands(cli: Command) {
  const storage = cli
    .command('storage')
    .description(
      'Commands for manipulating buckets and files on Apillon storage.',
    );

  storage
    .command('list-buckets')
    .description('List project buckets')
    .action(async function () {
      await listBuckets(this.optsWithGlobals());
    });

  addPaginationOptions(storage);

  storage
    .command('list-objects')
    .description('List files and folders in directory')
    .requiredOption('--bucket-uuid <uuid>', 'UUID of bucket')
    .option('-d, --dir', 'Directory path', '/')
    .action(async function () {
      await listObjects(this.optsWithGlobals());
    });

  storage
    .command('list-files')
    .description('List all files from a bucket')
    .requiredOption('--bucket-uuid <uuid>', 'UUID of bucket')
    .option('-p, --path', 'Filter by file path')
    .action(async function () {
      await listFiles(this.optsWithGlobals());
    });

  storage
    .command('upload')
    .description('Upload files and folders to bucket')
    .argument('<path>', 'path to source')
    .requiredOption('--bucket-uuid <uuid>', 'UUID of destination bucket')
    .action(async function (path: string) {
      await uploadFromFolder(path, this.optsWithGlobals());
    });

  storage
    .command('get-file')
    .description('Get file info')
    .requiredOption('--bucket-uuid <uuid>', 'UUID of bucket')
    .requiredOption('--file-uuid <uuid>', 'UUID of file to get')
    .action(async function () {
      await getFile(this.optsWithGlobals());
    });

  storage
    .command('delete-file')
    .description('Mark file for removal from IPFS storage')
    .requiredOption('--bucket-uuid <bucket uuid>', 'UUID of bucket')
    .requiredOption('--file-uuid <file uuid>', 'UUID of file to delete')
    .action(async function () {
      await deleteFile(this.optsWithGlobals());
    });

  /*
    TODO: 
    - download file
    - upload folder
    - ipns methods
  */
}
