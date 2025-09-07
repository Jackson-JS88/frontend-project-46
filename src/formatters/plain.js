const stringify = (value) => {
  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  if (typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'object') {
    return '[complex value]';
  }

  return String(value);
};

const buildPath = (currentPath, key) => {
  return currentPath ? `${currentPath}.${key}` : key;
};

const formatNode = (node, path) => {
  const { key, type } = node;
  const currentPath = buildPath(path, key);
  
  switch (type) {
    case 'added':
      return `Property '${currentPath}' was added with value: ${stringify(node.value)}`;
    
    case 'removed':
      return `Property '${currentPath}' was removed`;
    
    case 'changed':
      return `Property '${currentPath}' was updated. From ${stringify(node.value)} to ${stringify(node.newValue)}`;
    
    case 'nested':
      return formatPlain(node.children, currentPath);
    
    case 'unchanged':
      return null;
    
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
};

const formatPlain = (diff, path = '') => {
  const lines = diff
    .map((node) => formatNode(node, path))
    .filter((line) => line !== null);
  
  return lines.join('\n');
};

export default formatPlain;
