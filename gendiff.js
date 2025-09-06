#!/usr/bin/env node

import { Command } from 'commander';
import genDiff from './src/diff.js';

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2, options) => {
    const diff = genDiff(filepath1, filepath2, options.format);
    console.log(diff);
  });

if (process.argv.length <= 2) {
  program.outputHelp();
  process.exit(0);
} else {
  program.parse(process.argv);
};
