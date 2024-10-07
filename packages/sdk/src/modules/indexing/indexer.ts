import axios from 'axios';
import fs from 'fs';
import { ApillonModel } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { compressIndexerSourceCode } from '../../util/indexer-utils';

export class Indexer extends ApillonModel {
  /**
   * User assigned name of the indexer.
   */
  public name: string = null;

  /**
   * User assigned description of the indexer.
   */
  public description: string = null;

  /**
   * Constructor which should only be called via Indexing class.
   * @param uuid Unique identifier of the indexer.
   * @param data Data to populate the indexer with.
   */
  constructor(uuid: string, data?: Partial<Indexer>) {
    super(uuid);
    this.API_PREFIX = `/indexing/indexer/${uuid}`;
    this.populate(data);
  }

  public async deployIndexer(data: { indexerDir: string }): Promise<any> {
    //Get s3 URL for upload
    const url = await ApillonApi.get<string>(
      `${this.API_PREFIX}/url-for-source-code-upload`,
    );

    //Create tar.gz file
    const numOfFiles = await compressIndexerSourceCode(
      data.indexerDir,
      `${data.indexerDir}/builds/${this.uuid}.tar.gz`,
    );

    if (numOfFiles === 0) {
      throw new Error('Source directory is empty');
    }

    //Upload tar.gz to s3
    const s3Api = axios.create();
    const content = fs.readFileSync(
      `${data.indexerDir}/builds/${this.uuid}.tar.gz`,
    );
    await s3Api.put(url, content, {
      headers: { 'Content-Type': 'application/gzip' },
    });

    //Call deploy API
    await ApillonApi.post<string>(`${this.API_PREFIX}/deploy`);
  }
}
