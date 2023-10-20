/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { ApillonApiError, ApillonNetworkError } from './apillon';

/**
 * Convert value to boolean if defined, else return undefined.
 * @param value value converted
 */
export function toBoolean(value?: string) {
  if (value === undefined) {
    return undefined;
  }
  return value === 'true' || value === '1' || !!value;
}

/**
 * Convert value to integer if defined, else return undefined.
 * @param value value converted
 */
export function toInteger(value: string) {
  if (value === undefined) {
    return undefined;
  }

  return parseInt(value);
}

/**
 * Construct full URL from base URL and query parameters object.
 * @param url url without query parameters
 * @param parameters query parameters
 */
export function constructUrlWithQueryParams(url: string, parameters: any) {
  const cleanParams = {};
  for (const key in parameters) {
    const value = parameters[key];
    if (value !== undefined && value !== null && value !== '') {
      cleanParams[key] = value;
    }
  }
  const queryParams = new URLSearchParams(cleanParams).toString();

  return queryParams ? `${url}?${queryParams}` : url;
}

export function listFilesRecursive(
  folderPath,
  fileList = [],
  relativePath = '',
) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      listFilesRecursive(fullPath, fileList, relativePath + file + '/');
    } else {
      fileList.push({ fileName: file, path: relativePath, index: fullPath });
    }
  }
  return fileList;
}

export async function uploadFilesToS3(uploadLinks: any[], files: any[]) {
  const s3Api = axios.create();
  const uploadWorkers = [];

  for (const link of uploadLinks) {
    // console.log(link.url);
    const file = files.find(
      (x) => x.fileName === link.fileName && x.path === link.path,
    );
    if (!file) {
      throw new Error(`Cant find file ${link.path}${link.fileName}!`);
    }
    uploadWorkers.push(
      new Promise<void>((resolve, reject) => {
        fs.readFile(file.index, async (err, data) => {
          if (err) {
            reject(err.message);
          }
          // const respS3 =
          await s3Api.put(link.url, data);
          // console.log(respS3);

          console.log(`File uploaded: ${file.fileName} `);
          resolve();
        });
      }),
    );
  }

  await Promise.all(uploadWorkers);
}

/**
 * Exception handler for requests sent by CLI service.
 * @param e exception
 */
export function exceptionHandler(e: any) {
  if (e instanceof ApillonApiError) {
    console.error(`Apillon API error:\n${e.message}`);
  } else if (e instanceof ApillonNetworkError) {
    console.error(`Error: ${e.message}`);
  } else {
    console.error(e);
  }
}
