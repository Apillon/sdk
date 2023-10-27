import { Command } from 'commander';
import { addPaginationOptions } from '../../lib/options';
import {
  listBuckets,
  getObjects,
  getFiles,
  uploadFromFolder,
  file,
  deleteFile,
} from './storage.service';

export function createStorageCommands(cli: Command) {
  const storage = cli.command('storage');

  storage.command('list-buckets').action(async function () {
    await listBuckets(this.optsWithGlobals());
  });
  addPaginationOptions(storage);

  storage
    .command('get-objects')
    .requiredOption(
      '--uuid <bucket uuid>',
      'UUID of bucket to get objects from',
    )
    .action(async function () {
      await getObjects(this.optsWithGlobals());
    });

  storage
    .command('get-files')
    .requiredOption('--uuid <bucket uuid>', 'UUID of bucket to get files from')
    .action(async function () {
      await getFiles(this.optsWithGlobals());
    });

  storage
    .command('upload')
    .argument('<path>', 'path to folder with files')
    .requiredOption('--uuid <bucket uuid>', 'UUID of bucket to upload files to')
    .action(async function (path: string) {
      await uploadFromFolder(path, this.optsWithGlobals());
    });

  storage
    .command('file')
    .requiredOption('--uuid <bucket uuid>', 'UUID of bucket')
    .requiredOption('--file-uuid <file uuid>', 'UUID of file to get')
    .action(async function () {
      await file(this.optsWithGlobals());
    });

  storage
    .command('delete-file')
    .requiredOption('--uuid <bucket uuid>', 'UUID of bucket')
    .requiredOption('--file-uuid <file uuid>', 'UUID of file to delete')
    .action(async function () {
      await deleteFile(this.optsWithGlobals());
    });
}
