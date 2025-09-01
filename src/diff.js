import _ from 'lodash';
import { readFile, parse, getFormat } from './parsers.js';

const genDiff = (filepath1, filepath2) => {
  const format1 = getFormat(filepath1);
  const format2 = getFormat(filepath2);
  
  const content1 = readFile(filepath1);
  const content2 = readFile(filepath2);
  
  const obj1 = parse(content1, format1);
  const obj2 = parse(content2, format2);

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = _.sortBy(_.union(keys1, keys2));

  const difference = allKeys.map((key) => {
    if (!_.has(obj2, key)) {
      return `  - ${key}: ${obj1[key]}`;
    }
    if (!_.has(obj1, key)) {
      return `  + ${key}: ${obj2[key]}`;
    }
    if (obj1[key] !== obj2[key]) {
      return `  - ${key}: ${obj1[key]}\n  + ${key}: ${obj2[key]}`;
    }
    return `    ${key}: ${obj1[key]}`;
  });
  
  return `{\n${difference.join('\n')}\n}`;
};

export default genDiff;