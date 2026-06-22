/* global process, console */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const sourceExtensions = new Set(['.css', '.js', '.ts', '.vue']);
const ignoredDirs = new Set(['.git', 'coverage', 'dist', 'node_modules']);
const maxLines = 300;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory() && !ignoredDirs.has(entry.name)) files.push(...(await walk(path)));
    if (entry.isFile() && sourceExtensions.has(path.slice(path.lastIndexOf('.')))) files.push(path);
  }

  return files;
}

const tooLong = [];
for (const file of await walk(process.cwd())) {
  const contents = await readFile(file, 'utf8');
  const lines = contents.length === 0 ? 0 : contents.split('\n').length;
  if (lines > maxLines) tooLong.push(`${file}: ${lines}`);
}

if (tooLong.length > 0) {
  console.error(`Source files over ${maxLines} lines:\n${tooLong.join('\n')}`);
  process.exit(1);
}
