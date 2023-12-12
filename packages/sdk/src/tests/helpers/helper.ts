import * as dotenv from 'dotenv';
import { ApillonConfig } from '../../lib/apillon';
import { resolve } from 'path';
import { LogLevel } from '../../types/apillon';

export function getConfig(): ApillonConfig {
  // Configure dotenv with the absolute path
  const envPath = resolve(__dirname, '../../.env');
  dotenv.config({ path: envPath });

  return {
    secret: process.env['APILLON_API_SECRET'],
    key: process.env['APILLON_API_KEY'],
    logLevel: LogLevel.VERBOSE,
  } as ApillonConfig;
}

export function getBucketUUID() {
  return process.env['BUCKET_UUID'];
}

export function getCollectionUUID() {
  return process.env['COLLECTION_UUID'];
}

export function getWebsiteUUID() {
  return process.env['WEBSITE_UUID'];
}

export function getMintAddress() {
  return process.env['MINT_ADDRESS'];
}
