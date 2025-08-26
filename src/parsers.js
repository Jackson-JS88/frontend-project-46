import fs from 'fs';
import path from 'path';

const readFile = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const content = fs.readFileSync(absolutePath, 'utf-8');
  return content;
};

const parse = (content, format) => {
  if (format === 'json') {
    return JSON.parse(content);
  }
  return content;
};

export { readFile, parse };

