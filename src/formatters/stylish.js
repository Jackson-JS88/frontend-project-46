import _ from 'lodash';

const getIndent = (depth, withSign = false) => {
  if (withSign) {
    return ' '.repeat((depth - 1) * 4 + 2);
  }
  return ' '.repeat(depth * 4);
};

const stringify = (value, depth) => {
  if (!_.isObject(value) || value === null) {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return String(value);
    if (value === '') return ' ';
    return String(value);
  }

  const entries = Object.entries(value);
  const lines = entries.map(([key, val]) => {
    return `${getIndent(depth + 1)}${key}: ${stringify(val, depth + 1)}`;
  });

  return `{\n${lines.join('\n')}\n${getIndent(depth)}}`;
};

const formatStylish = (diff, depth = 1) => {
  const lines = diff.map((node) => {
    const { key, type } = node;

    switch (type) {
      case 'added':
        return `${getIndent(depth, true)}+ ${key}: ${stringify(node.value, depth)}`;
      case 'removed':
        return `${getIndent(depth, true)}- ${key}: ${stringify(node.value, depth)}`;
      case 'unchanged':
        return `${getIndent(depth)}${key}: ${stringify(node.value, depth)}`;
      case 'changed':
        return [
          `${getIndent(depth, true)}- ${key}: ${stringify(node.value, depth)}`,
          `${getIndent(depth, true)}+ ${key}: ${stringify(node.newValue, depth)}`
        ].join('\n');
      case 'nested':
        return `${getIndent(depth)}${key}: ${formatStylish(node.children, depth + 1)}`;
      default:
        throw new Error(`Unknown node type: ${type}`);
    }
  });

  return `{\n${lines.join('\n')}\n${getIndent(depth - 1)}}`;
};

export default formatStylish;