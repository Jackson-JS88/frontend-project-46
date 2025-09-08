import fs from 'fs';
import path from 'path';
import { parse as parseYAML } from 'yaml';

const readFile = (filepath) => {
  const possiblePaths = [
    path.resolve(process.cwd(), filepath),
    path.resolve(process.cwd(), '__fixtures__', filepath),
    path.resolve(process.cwd(), '..', '__fixtures__', filepath),
    path.resolve(process.cwd(), '..', '..', '__fixtures__', filepath),
  ];

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return fs.readFileSync(possiblePath, 'utf-8');
    }
  }

  throw new Error(`File not found: ${filepath}. Tried: ${possiblePaths.join(', ')}`);
};

const parse = (content, format) => {
  try {
    if (format === 'json') return JSON.parse(content);
    if (format === 'yml' || format === 'yaml') return parseYAML(content);
    throw new Error(`Unsupported format: ${format}`);
  } catch (error) {
    throw new Error(`Parse error: ${error.message}`);
  }
};

const getFormat = (filename) => {
  const ext = path.extname(String(filename)).toLowerCase();
  if (ext === '.json') return 'json';
  if (ext === '.yml' || ext === '.yaml') return 'yml';
  throw new Error(`Unsupported file extension: ${ext}`);
};

export { readFile, parse, getFormat };