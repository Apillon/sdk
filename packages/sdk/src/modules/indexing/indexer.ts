import axios from 'axios';
import fs from 'fs';
import { ApillonModel } from '../../lib/apillon';
import { ApillonApi } from '../../lib/apillon-api';
import { ApillonLogger } from '../../lib/apillon-logger';
import { IDeployIndexer } from '../../types/indexer';
import { compressIndexerSourceCode } from '../../util/indexer-utils';
import { LogLevel } from '../../docs-index';

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
    this.API_PREFIX = `/indexing/indexers/${uuid}`;
    this.populate(data);
  }

  override async get(): Promise<this> {
    throw new Error('Method not supported.');
  }

  /**
   * Prepare indexer source code, upload it to s3 and deploy the indexer.
   * @param path Path to the indexer source code directory.
   */
  public async deployIndexer(path: string): Promise<any> {
    //Check directory and if squid.yaml exists in it
    if (!fs.existsSync(path)) {
      return console.error('Invalid path');
    }
    if (!fs.existsSync(`${path}/squid.yaml`)) {
      return console.error('squid.yaml not found in directory');
    }

    //Create tar.gz file
    const numOfFiles = await compressIndexerSourceCode(
      path,
      `${path}/builds/${this.uuid}.tar.gz`,
    );

    if (numOfFiles === 0) {
      return console.error('Source directory is empty');
    }
    ApillonLogger.log(`Compressed ${numOfFiles} files. Uploading to s3...`);

    //Get s3 URL for upload
    const url = await ApillonApi.get<string>(`${this.API_PREFIX}/upload-url`);

    //Upload tar.gz to s3
    const content = fs.readFileSync(`${path}/builds/${this.uuid}.tar.gz`);
    await axios.put(url, content, {
      headers: { 'Content-Type': 'application/gzip' },
    });

    ApillonLogger.log(`'Upload complete. Deploying indexer...'`);

    //Call deploy API
    const deployResponse = await ApillonApi.post<IDeployIndexer>(
      `${this.API_PREFIX}/deploy`,
    );
    if (deployResponse.deployment.failed != 'NO') {
      ApillonLogger.log(deployResponse.deployment, LogLevel.ERROR);
      return console.error('Indexer deployment failed!');
    }

    return deployResponse;
  }
}
