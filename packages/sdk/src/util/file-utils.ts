/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { ApillonLogger } from '../lib/apillon-logger';
import { ApillonApi } from '../lib/apillon-api';
import {
  FileMetadata,
  IFileUploadRequest,
  IFileUploadResponse,
} from '../types/storage';
import { LogLevel } from '../types/apillon';
import { randomBytes } from 'crypto';

function listFilesRecursive(
  folderPath: string,
  fileList = [],
  relativePath = '',
) {
  const gitignorePath = path.join(folderPath, '.gitignore');
  const gitignorePatterns = fs.existsSync(gitignorePath)
    ? fs.readFileSync(gitignorePath, 'utf-8').split('\n')
    : [];
  gitignorePatterns.push('.git'); // Always ignore .git folder.

  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const relativeFilePath = path.join(relativePath, file);

    // Skip file if it matches .gitignore patterns
    if (
      gitignorePatterns.some((pattern) =>
        new RegExp(pattern).test(relativeFilePath),
      )
    ) {
      continue;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      listFilesRecursive(fullPath, fileList, `${relativeFilePath}/`);
    } else {
      fileList.push({ fileName: file, path: relativePath, index: fullPath });
    }
  }
  return fileList.sort((a, b) => a.fileName.localeCompare(b.fileName));
}

async function uploadFilesToS3(
  uploadLinks: (FileMetadata & { url?: string })[],
  files: (FileMetadata & { index?: string })[],
) {
  const s3Api = axios.create();
  const uploadWorkers = [];

  for (const link of uploadLinks) {
    // console.log(link.url);
    const file = files.find(
      (x) => x.fileName === link.fileName && (!x.path || x.path === link.path),
    );
    if (!file) {
      throw new Error(`Can't find file ${link.path}${link.fileName}!`);
    }
    uploadWorkers.push(
      new Promise<void>(async (resolve, _reject) => {
        // If uploading from local folder then read file, otherwise directly upload content
        const content = file.index ? fs.readFileSync(file.index) : file.content;
        await s3Api.put(link.url, content);
        ApillonLogger.log(`File uploaded: ${file.fileName}`);
        resolve();
      }),
    );
  }

  await Promise.all(uploadWorkers);
}

export async function uploadFiles(uploadParams: {
  apiPrefix: string;
  folderPath?: string;
  files?: FileMetadata[];
  params?: IFileUploadRequest;
}): Promise<{ sessionUuid: string; files: FileMetadata[] }> {
  const { folderPath, apiPrefix, params } = uploadParams;
  let files = uploadParams.files;

  if (folderPath) {
    ApillonLogger.log(`Preparing to upload files from ${folderPath}...`);
  } else if (files?.length) {
    ApillonLogger.log(`Preparing to upload ${files.length} files...`);
  } else {
    throw new Error('Invalid upload parameters received');
  }
  // If folderPath param passed, read files from local storage
  if (folderPath && !files?.length) {
    try {
      files = listFilesRecursive(folderPath);
    } catch (err) {
      ApillonLogger.log(err.message, LogLevel.ERROR);
      throw new Error(`Error reading files in ${folderPath}`);
    }
  }

  ApillonLogger.log(`Total files to upload: ${files.length}`);

  // Split files into chunks for parallel uploading
  const fileChunkSize = 200;
  const sessionUuid = uuidv4();
  const uploadedFiles = [];

  for (const fileGroup of chunkify(files, fileChunkSize)) {
    const { files } = await ApillonApi.post<IFileUploadResponse>(
      `${apiPrefix}/upload`,
      { files: fileGroup, sessionUuid },
    );

    await uploadFilesToS3(files, fileGroup);
    uploadedFiles.push(files);
  }

  ApillonLogger.logWithTime('File upload complete.');

  ApillonLogger.log('Closing upload session...');
  await ApillonApi.post(`${apiPrefix}/upload/${sessionUuid}/end`, params);
  ApillonLogger.logWithTime('Upload session ended.');

  return { sessionUuid, files: uploadedFiles.flatMap((f) => f) };
}

function chunkify(files: FileMetadata[], chunkSize = 10): FileMetadata[][] {
  // Divide files into chunks for parallel processing and uploading
  const fileChunks: FileMetadata[][] = [];
  for (let i = 0; i < files.length; i += chunkSize) {
    fileChunks.push(files.slice(i, i + chunkSize));
  }

  return fileChunks;
}

function uuidv4() {
  const bytes = randomBytes(16);

  // Set the version (4) and variant (8, 9, A, or B) bits
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant (8, 9, A, or B)

  // Convert bytes to hexadecimal and format the UUID
  const uuid = bytes.toString('hex');

  return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(
    12,
    16,
  )}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;
}
