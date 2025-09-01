import fs from 'fs';
import path from 'path';
import { parse as parseYAML } from 'yaml';

const readFile = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const content = fs.readFileSync(absolutePath, 'utf-8');
  return content;
};

const parse = (content, format) => {
  if (format === 'json') {
    return JSON.parse(content);
  }
  if (format === 'yml' || format === 'yaml') {
    return parseYAML(content);
  }
  throw new Error(`Unsupported format: ${format}`);
};

const getFormat = (filename) => {
  const filepath = String(filename);
  const ext = path.extname(filepath).toLowerCase();
  if (ext === '.json') return 'json';
  if (ext === '.yml' || ext === '.yaml') return 'yml';
  throw new Error(`Unsupported file extension: ${ext}`);
};

export { readFile, parse, getFormat };