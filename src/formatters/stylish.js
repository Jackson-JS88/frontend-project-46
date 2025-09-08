const getIndent = (depth, withSign = false) => {
  const spaces = depth * 4
  return withSign ? ' '.repeat(spaces - 2) : ' '.repeat(spaces)
}

const stringify = (value, depth) => {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) return '[complex value]'
  if (typeof value !== 'object') return String(value)

  const entries = Object.entries(value)
  const lines = entries.map(([key, val]) => {
    return `${getIndent(depth + 1)}${key}: ${stringify(val, depth + 1)}`
  })

  return `{\n${lines.join('\n')}\n${getIndent(depth)}}`
}

const formatStylish = (diff, depth = 0) => {
  const lines = diff.map(node => {
    const { key, type } = node

    switch (type) {
      case 'added':
        return `${getIndent(depth + 1, true)}+ ${key}: ${stringify(node.value, depth + 1)}`
      case 'removed':
        return `${getIndent(depth + 1, true)}- ${key}: ${stringify(node.value, depth + 1)}`
      case 'unchanged':
        return `${getIndent(depth + 1)}${key}: ${stringify(node.value, depth + 1)}`
      case 'changed':
        return [
          `${getIndent(depth + 1, true)}- ${key}: ${stringify(node.oldValue, depth + 1)}`,
          `${getIndent(depth + 1, true)}+ ${key}: ${stringify(node.newValue, depth + 1)}`,
        ].join('\n')
      case 'nested':
        return `${getIndent(depth + 1)}${key}: ${formatStylish(node.children, depth + 1)}`
      default:
        throw new Error(`Unknown node type: ${type}`)
    }
  })

  return `{\n${lines.join('\n')}\n${getIndent(depth)}}`
}

export default formatStylish
