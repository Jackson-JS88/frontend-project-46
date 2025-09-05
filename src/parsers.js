import fs from 'fs';
import path from 'path';
import { parse as parseYAML } from 'yaml';

const readFile = (filepath) => {
  let absolutePath = path.resolve(process.cwd(), filepath);

  if (!fs.existsSync(absolutePath)) {
    absolutePath = path.resolve(process.cwd(), '__fixtures__', filepath);
  }

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${filepath}`);
  }

  return fs.readFileSync(absolutePath, 'utf-8');
};

const parse = (content, format) => {
  if (format === 'json') return JSON.parse(content);
  if (format === 'yml' || format === 'yaml') return parseYAML(content);
  throw new Error(`Unsupported format: ${format}`);
};

const getFormat = (filename) => {
  const ext = path.extname(String(filename)).toLowerCase();
  if (ext === '.json') return 'json';
  if (ext === '.yml' || ext === '.yaml') return 'yml';
  throw new Error(`Unsupported file extension: ${ext}`);
};

export { readFile, parse, getFormat };