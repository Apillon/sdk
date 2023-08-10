/* eslint-disable security/detect-non-literal-fs-filename */
import fs from 'fs';

export function readAndParseJson(filePath: string) {
  const fileContent = fs.readFileSync(filePath);

  return JSON.parse(fileContent.toString());
}
