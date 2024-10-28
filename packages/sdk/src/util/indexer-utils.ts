import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import ignore from 'ignore';
import targz from 'targz';

export function createSquidIgnore(squidDir: string) {
  const ig = ignore().add(
    // default ignore patterns
    ['node_modules', '.git'],
  );

  const ignoreFilePaths = globSync(['.squidignore', '**/.squidignore'], {
    cwd: squidDir,
    nodir: true,
    posix: true,
  });

  if (!ignoreFilePaths.length) {
    return ig.add([
      // squid uploaded archives directory
      '/builds',
      // squid built files
      '/lib',
      // IDE files
      '.idea',
      '.vscode',
    ]);
  }

  for (const ignoreFilePath of ignoreFilePaths) {
    const raw = fs
      .readFileSync(path.resolve(squidDir, ignoreFilePath))
      .toString();

    const ignoreDir = path.dirname(ignoreFilePath);
    const patterns = getIgnorePatterns(ignoreDir, raw);

    ig.add(patterns);
  }

  return ig;
}

export function getIgnorePatterns(ignoreDir: string, raw: string) {
  const lines = raw.split('\n');

  const patterns: string[] = [];
  for (let line of lines) {
    line = line.trim();

    if (line.length === 0) continue;
    if (line.startsWith('#')) continue;

    let pattern =
      line.startsWith('/') || line.startsWith('*/') || line.startsWith('**/')
        ? line
        : `**/${line}`;
    pattern =
      ignoreDir === '.'
        ? pattern
        : `${toRootPattern(ignoreDir)}${toRootPattern(pattern)}`;

    patterns.push(pattern);
  }

  return patterns;
}

function toRootPattern(pattern: string) {
  return pattern.startsWith('/') ? pattern : `/${pattern}`;
}

export function compressIndexerSourceCode(
  srcDir: string,
  destDir: string,
): Promise<any> {
  const squidIgnore = createSquidIgnore(srcDir);
  let filesCount = 0;

  fs.mkdirSync(path.dirname(destDir), { recursive: true });

  return new Promise((resolve, reject) => {
    targz.compress(
      {
        src: srcDir,
        dest: destDir,
        tar: {
          ignore: (name) => {
            const relativePath = path.relative(
              path.resolve(srcDir),
              path.resolve(name),
            );

            if (squidIgnore.ignores(relativePath)) {
              console.log('ignoring ' + relativePath);
              return true;
            } else {
              console.log('adding ' + relativePath);
              filesCount++;
              return false;
            }
          },
        },
      },
      function (err) {
        if (err) {
          console.error(err);
          reject(
            `Compression failed. ${err.message ? 'Error: ' + err.message : ''}`,
          );
        } else {
          resolve(filesCount);
        }
      },
    );
  });
}
