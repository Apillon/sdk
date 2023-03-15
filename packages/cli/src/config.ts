/* eslint-disable @typescript-eslint/no-var-requires */
import * as dotenv from 'dotenv';

dotenv.config();

function getVersion(rollback: string) {
  let ver = rollback;
  try {
    ver = require('./package.json').version;
  } catch (err) {
    try {
      ver = require('../package.json').version;
    } catch (e) {}
  }

  return ver;
}

export default {
  VERSION: getVersion('0.0.1'),
  APILLON_KEY: process.env.APILLON_KEY,
  APILLON_SECRET: process.env.APILLON_SECRET,
  APILLON_API_URL: process.env.APILLON_API_URL || 'https://api.apillon.io',
};
