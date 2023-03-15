/* eslint-disable security/detect-non-literal-fs-filename */
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

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
