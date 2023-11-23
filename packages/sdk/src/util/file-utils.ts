/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { ApillonLogger } from '../lib/apillon-logger';
import { LogLevel } from '../types/apillon';
import { ApillonApi } from '../lib/apillon-api';
import { FileMetadata, IFileUploadRequest } from '../docs-index';

export function listFilesRecursive(
  folderPath: string,
  fileList = [],
  relativePath = '',
) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      listFilesRecursive(fullPath, fileList, `${relativePath + file}/`);
    } else {
      fileList.push({ fileName: file, path: relativePath, index: fullPath });
    }
  }
  return fileList.sort((a, b) => a.fileName.localeCompare(b.fileName));
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
      new Promise<void>(async (resolve, reject) => {
        // If uploading from local folder read file, otherwise directly upload content
        if (file.index) {
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
        } else if (file.content) {
          await s3Api.put(link.url, file.content);
          console.log(`File uploaded: ${file.fileName} `);
          resolve();
        }
      }),
    );
  }

  await Promise.all(uploadWorkers);
}

export async function uploadFiles(
  folderPath: string,
  apiPrefix: string,
  params?: IFileUploadRequest,
  files?: FileMetadata[],
): Promise<void> {
  if (folderPath) {
    ApillonLogger.log(
      `Preparing to upload files from ${folderPath}...`,
      LogLevel.VERBOSE,
    );
  } else if (files?.length) {
    ApillonLogger.log(
      `Preparing to upload ${files.length} files...`,
      LogLevel.VERBOSE,
    );
  } else {
    throw new Error('Invalid upload parameters received');
  }
  // If folderPath param passed, read files from local storage
  if (folderPath && !files?.length) {
    try {
      files = listFilesRecursive(folderPath);
    } catch (err) {
      console.error(err);
      throw new Error(`Error reading files in ${folderPath}`);
    }
  }

  ApillonLogger.log(`Files to upload: ${files.length}`, LogLevel.VERBOSE);

  const { data } = await ApillonApi.post<any>(`${apiPrefix}/upload`, {
    files,
  });

  const fileChunks = chunkify(
    files,
    data.files.sort((a, b) => a.fileName.localeCompare(b.fileName)),
  );

  await Promise.all(
    fileChunks.map(({ chunkFiles, chunkLinks }) =>
      uploadFilesToS3(chunkLinks, chunkFiles),
    ),
  );
  ApillonLogger.logWithTime('File upload complete', LogLevel.VERBOSE);

  ApillonLogger.log('Closing upload session...', LogLevel.VERBOSE);
  const { data: endSession } = await ApillonApi.post<any>(
    `${apiPrefix}/upload/${data.sessionUuid}/end`,
    params,
  );
  ApillonLogger.logWithTime('Session ended.', LogLevel.VERBOSE);

  if (!endSession) {
    throw new Error('Failure when trying to end file upload session');
  }
}

function chunkify(files: any[], links: any[], chunkSize = 10) {
  // Divide files into chunks for parallel processing and uploading
  const fileChunks = [];
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunkFiles = files.slice(i, i + chunkSize);
    const chunkLinks = links.slice(i, i + chunkSize);
    fileChunks.push({ chunkFiles, chunkLinks });
  }

  return fileChunks;
}
