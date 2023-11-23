/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';

dotenv.config();

function getVersion(rollback: string) {
  try {
    return require('./package.json').version;
  } catch (err) {
    try {
      return require('../package.json').version;
    } catch (e) {}
  }

  return rollback;
}

export default {
  VERSION: getVersion('1.0.0'),
  APILLON_API_KEY: process.env.APILLON_API_KEY,
  APILLON_API_SECRET: process.env.APILLON_API_SECRET,
  APILLON_API_URL: process.env.APILLON_API_URL || 'https://api.apillon.io',
};
