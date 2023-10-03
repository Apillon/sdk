import * as dotenv from 'dotenv';
import { ApillonConfig } from '../../lib/apillon';

export function getConfig(): ApillonConfig {
  dotenv.config({ path: '../../.env' });
  return {
    apiUrl: process.env['APILLON_API_URL'],
    secret: process.env['APILLON_API_SECRET'],
    key: process.env['APILLON_API_KEY'],
  } as ApillonConfig;
}
