import _ from 'lodash';
import { readFile, parse, getFormat } from './parsers.js';
import getFormatter from './formatters/index.js';

const buildTree = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2));
  const sortedKeys = _.sortBy(keys);

  return sortedKeys.map((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (!_.has(obj2, key)) {
      return { key, type: 'removed', value: value1 };
    }

    if (!_.has(obj1, key)) {
      return { key, type: 'added', value: value2 };
    }

    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return {
        key,
        type: 'nested',
        children: buildTree(value1, value2),
      };
    }

    if (!_.isEqual(value1, value2)) {
      return {
        key,
        type: 'changed',
        value: value1,
        newValue: value2,
      };
    }

    return { key, type: 'unchanged', value: value1 };
  });
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const content1 = readFile(filepath1);
  const content2 = readFile(filepath2);

  const format1 = getFormat(filepath1);
  const format2 = getFormat(filepath2);

  const obj1 = parse(content1, format1);
  const obj2 = parse(content2, format2);

  const diffTree = buildTree(obj1, obj2);
  const formatter = getFormatter(format); 

  return formatter(diffTree); 
};

export default genDiff;