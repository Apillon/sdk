import { Command } from 'commander';

export function createStorageCommands(cli: Command) {
  const storage = cli.command('storage');

  const storageUploadFolder = storage
    .command('upload-folder')
    // .requiredOption('-d <string>, --dir <string>', 'folder with website files')
    .argument('[path]', 'path to folder with website files', '.')
    .option('-p, --preview', 'deploys to staging environment')
    .action(uploadFolder);

  const storageUploadFiles = storage
    .command('upload-files')
    // .requiredOption('-d <string>, --dir <string>', 'folder with website files')
    .argument('[path]', 'path to folder with website files', '.')
    .option('-p, --preview', 'deploys to staging environment')
    .action(uploadFiles);
}

function uploadFolder(path: string) {
  console.log(path);
  console.log(this.opts().preview);
  throw Error('Command not implemented!');
}

// eslint-disable-next-line sonarjs/no-identical-functions
function uploadFiles(path: string) {
  console.log(path);
  console.log(this.opts().preview);
  throw Error('Command not implemented!');
}
