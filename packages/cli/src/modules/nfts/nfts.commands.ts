import { Command } from 'commander';

export function createNftsCommands(cli: Command) {
  const nfts = cli.command('nfts');

  const nftsDeploy = nfts
    .command('deploy-contract')
    .argument('[configuration]', 'path to JSON configuration file', '.')
    .requiredOption('-d <string>, --dir <string>', 'folder with NFT images')
    .option('-p, --preview', 'deploys to staging environment')
    .action(deployContract);

  const mintNft = nfts
    .command('mint')
    .requiredOption('-id <string>, --collection-id <string>', 'collection ID')
    .requiredOption(
      '-a <string>, --address <string>',
      'receiver wallet address',
    )
    .option('-n <number>, --number <number>', 'number of tokens to mint', '1')
    .action(mintNfts);
}

function deployContract(path: string) {
  console.log(path);
  console.log(this.opts().preview);
}

function mintNfts() {
  console.log(this.opts().preview);
}
