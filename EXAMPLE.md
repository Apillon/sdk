# Structure example

```ts
import { Hosting, Storage, Nft, DeployToEnvironment, FileStatus } from '@apillon/sdk';

export async function test() {
  // Hosting example
  const hosting = new Hosting({ apillonConfig });
  await hosting.listWebsites();
  const webpage1 = hosting.website('uuid');
  await webpage1.get();

  await webpage1.uploadFromFolder('folder_path');
  await webpage1.deploy(DeployToEnvironment.STAGING_TO_PRODUCTION);
  await webpage1.listDeployments();
  const deployment = await webpage1.deployment(deployment_uuid).get();
  if (deployment.deploymentStatus === DeploymentStatus.SUCCESSFUL) {
    // done
  }

  // Storage example
  const storage = new Storage({ apillonConfig });
  await storage.listBuckets();
  const bucket = storage.bucket('uuid');
  await bucket.uploadFromFolder('folder_path');
  await bucket.getObjects({
    directoryUuid,
    markedForDeletion: false,
    limit: 5,
  });
  await bucket.getFiles({ fileStatus: FileStatus.UPLOADED });
  const file = await bucket.file(file_uuid).get();
  await bucket.deleteFile(file_uuid);

  // NFT example
  const nft = new Nft({ apillonConfig });
  await nft.listCollections();
  const collection = await nft.collection('uuid').get();
  await collection.mint(receiver, quantity);
  await collection.nestMint(collection.uuid, 1, quantity);
  await collection.burn(quantity);
  await collection.listTransactions();
  await collection.transferOwnership(to_address);
}
```
