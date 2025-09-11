import { readFile, parse, getFormat } from './parsers.js'
import buildTree from './diff.js'
import getFormatter from './formatters/getFormatter.js'

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const content1 = readFile(filepath1)
  const content2 = readFile(filepath2)

  const format1 = getFormat(filepath1)
  const format2 = getFormat(filepath2)

  const obj1 = parse(content1, format1)
  const obj2 = parse(content2, format2)

  const diffTree = buildTree(obj1, obj2)
  const formatter = getFormatter(format)

  return formatter(diffTree)
}

export default genDiff
