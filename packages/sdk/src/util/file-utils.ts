/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { importer, type UserImporterOptions } from 'ipfs-unixfs-importer';


import { ApillonLogger } from '../lib/apillon-logger';
import { ApillonApi } from '../lib/apillon-api';
import {
  FileMetadata,
  FileUploadResult,
  IFileUploadRequest,
  IFileUploadResponse,
} from '../types/storage';
import { LogLevel } from '../types/apillon';
import { randomBytes } from 'crypto';

export async function uploadFiles(uploadParams: {
  apiPrefix: string;
  params?: IFileUploadRequest;
  folderPath?: string;
  files?: (FileMetadata & { index?: string })[];
}): Promise<{
  sessionUuid: string;
  files: (FileMetadata & { url: string })[];
}> {
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
      files = readFilesFromFolder(folderPath, params?.ignoreFiles);
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
    if (params?.wrapWithDirectory) {
      for (const fg of fileGroup) {
        fg.content = fg.index ? fs.readFileSync(fg.index) : fg.content;
      }

      const { files } = await ApillonApi.post<IFileUploadResponse>(
        `${apiPrefix}/upload`,
        {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          files: fileGroup.map(({ content, ...rest }) => rest),
          sessionUuid,
        },
      );

      await uploadFilesToS3(files, fileGroup);
      files.forEach((file: any) => delete file.url);

      uploadedFiles.push(files);
    } else {
      const metadata = {
        files: [] as FileUploadResult[],
        urls: [] as string[],
        cids: [] as string[],
      };

      for (const fg of fileGroup) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { content, ...rest } = fg;

        metadata.files.push(rest);

        const readContent = fg.index ? fs.readFileSync(fg.index) : fg.content;

        fg.content = readContent;

        const cid = await calculateCID(readContent, {
          cidVersion: 1,
        });

        metadata.cids.push(cid);
      }

      const { links } = await ApillonApi.post<{ links: string[] }>(
        `/storage/link-on-ipfs-multiple`,
        { cids: metadata.cids },
      );

      metadata.urls = links;
      const { files } = await ApillonApi.post<IFileUploadResponse>(
        `${apiPrefix}/upload`,
        {
          files: metadata.files,
          sessionUuid,
        },
      );

      // Upload doesn't return files in the same order as sent
      const sortedFiles = metadata.files.map((metaFile) =>
        files.find((file) => file.fileName === metaFile.fileName && file.path === metaFile.path),
      );

      await uploadFilesToS3(sortedFiles, fileGroup);

      const filesWithUrl = sortedFiles.map((file, index) => ({
        ...file,
        CID: metadata.cids[index],
        url: metadata.urls[index],
      }));
      uploadedFiles.push(filesWithUrl);
    }
  }

  ApillonLogger.logWithTime('File upload complete.');

  ApillonLogger.log('Closing upload session...');
  await ApillonApi.post(`${apiPrefix}/upload/${sessionUuid}/end`, params);
  ApillonLogger.logWithTime('Upload session ended.');

  return { sessionUuid, files: uploadedFiles.flatMap((f) => f) };
}

function readFilesFromFolder(
  folderPath: string,
  ignoreFiles = true,
): FileMetadata[] {
  const gitignorePatterns = [];
  if (ignoreFiles) {
    ApillonLogger.log('Ignoring files from .gitignore during upload.');

    const gitignorePath = path.join(folderPath, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      gitignorePatterns.push(
        ...fs.readFileSync(gitignorePath, 'utf-8').split('\n'),
      );
    }
    // Ignore the following files by default when ignoreFiles = true
    gitignorePatterns.push(
      '\\.git/?$',
      '\\.gitignore$',
      'node_modules/?',
      '\\.env$',
    );
  }

  const folderFiles = listFilesRecursive(folderPath);
  return folderFiles.filter(
    (file) =>
      // Skip files that match .gitignore patterns
      !gitignorePatterns.some(
        (pattern) =>
          new RegExp(pattern).test(file.fileName) ||
          new RegExp(pattern).test(file.path),
      ),
  );
}

function listFilesRecursive(
  folderPath: string,
  fileList = [],
  relativePath = '',
): FileMetadata[] {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    const relativeFilePath = path.join(relativePath, file);

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
        await s3Api.put(link.url, file.content);
        ApillonLogger.log(`File uploaded: ${file.fileName}`);
        resolve();
      }),
    );
  }

  await Promise.all(uploadWorkers);
}

function chunkify(
  files: FileMetadata[],
  chunkSize = 10,
): (FileMetadata & {
  index?: string;
})[][] {
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

export const calculateCID = async (content: any, options: UserImporterOptions) => {
  options.onlyHash = true;
  if (typeof content === 'string') {
    content = new TextEncoder().encode(content);
  }
  let lastCid;
  for await (const { cid } of importer([{ content }], {
    get: async cid => {
      throw new Error(`unexpected block API get for ${cid}`);
    },
    put: async () => {
      throw new Error('unexpected block API put');
    },
  }, options)) {
    lastCid = cid;
  }
  return `${lastCid}`;
};
