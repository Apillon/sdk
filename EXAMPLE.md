# Structure example

```ts
import { Hosting } from '@apillon/sdk';
import { Storage } from '@apillon/sdk';
import { Nft } from '@apillon/sdk';

export async function test() {

  const hosting = new Hosting({ apillonConfig });
  await hosting.listWebsites();
  await hosting.createWebsite();
  const webpage1 = hosting.website('uuid');
  await webpage1.getInfo();
  await webpage1.update({});
  await webpage1.getDeployment(id);
  await webpage1.getDeployments();
  await webpage1.deployFromFolder('path', 'environment'); // can go directly to production
  await webpage1.updateDeployment(from stg -> production); // tu me moti še na api levelu, kr lahko dobiš in pogledaš detajle specifičnega deploymenta, ampak deploy klic pa dela samo na zadnjem

  // or
  await hosting.website('uuid').getInfo();


  //Naming hosting -> webpage?

  const storage = new Storage({ apillonConfig });
  await storage.listBuckets();
  await storage.createBucket();

  const bucket = storage.bucket('uuid');
  await bucket.upload('path to files');
  await bucket.getContent({ directory, search, limit });
  await bucket.getFile(id);
  await bucket.deleteFile(id);

  const nft = new Nft({ apillonConfig });
  await nft.listCollections();

  const collection = nft.collection('uuid');
  const info = collection.getInfo(); //.info?
  await collection.mint();
  await collection.burn();
  await collection.transferOwnership();
  await collection.getTransactions();


}
```
