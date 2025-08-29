#!/usr/bin/env node

import { Command } from 'commander';
import { readFile, parse } from './src/parsers.js';
import path from 'path';
import genDiff from './src/diff.js';

const getFormat = (filepath) => {
  const ext = path.extname(filepath);
  return ext ? ext.slice(1) : 'unknown';
}

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2, options) => {
    const content1 = readFile(filepath1);
    const content2 = readFile(filepath2);

    const format1 = getFormat(filepath1);
    const format2 = getFormat(filepath2);

    const data1 = parse(content1, format1);
    const data2 = parse(content2, format2);

    const diff = genDiff(data1, data2);
    console.log(diff);
  });

program.parse(process.argv);