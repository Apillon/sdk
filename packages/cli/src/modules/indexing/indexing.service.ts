import { Indexing } from '@apillon/sdk';
import { GlobalOptions } from '../../lib/types';
import { withErrorHandler } from '../../lib/utils';

export async function deployIndexer(
  path: string,
  optsWithGlobals: GlobalOptions,
) {
  await withErrorHandler(async () => {
    console.log(`Deploying indexer: ${path}`);
    await new Indexing(optsWithGlobals)
      .indexer(optsWithGlobals.indexerUuid)
      .deployIndexer(path);

    console.log(
      `Indexer deployment successfully started! Check Apillon console for status.`,
    );
  });
}
