import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/diff.js';
import { parse, getFormat } from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('gendiff', () => {
  test('parse with unsupported format', () => {
    expect(() => parse('content', 'xml')).toThrow('Unsupported format: xml');
  });

  test('getFormat with unsupported extension', () => {
    expect(() => getFormat('file.txt')).toThrow('Unsupported file extension: .txt');
  });

  test('compare nested JSON structures', () => {
    const result = genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'));

    expect(result).toMatch(/^\s*\+ follow: false$/m);
    expect(result).toMatch(/^\s*  setting1: Value 1$/m);
    expect(result).toMatch(/^\s*- setting2: 200$/m);
    expect(result).toMatch(/^\s*- setting3: true$/m);
    expect(result).toMatch(/^\s*\+ setting3: null$/m);
    expect(result).toMatch(/^\s*\+ setting4: blah blah$/m);
    expect(result).toMatch(/^\s*\+ setting5: {$/m);
    expect(result).toMatch(/^\s*    key5: value5$/m);

    expect(result).toMatch(/^\s*  setting6: {$/m);
    expect(result).toMatch(/^\s*    doge: {$/m);
    expect(result).toMatch(/^\s*- wow:  $/m);
    expect(result).toMatch(/^\s*\+ wow: so much$/m);
    expect(result).toMatch(/^\s*    key: value$/m);
    expect(result).toMatch(/^\s*\+ ops: vops$/m);

    expect(result).toMatch(/^\s*- baz: bas$/m);
    expect(result).toMatch(/^\s*\+ baz: bars$/m);
    expect(result).toMatch(/^\s*  foo: bar$/m);
    expect(result).toMatch(/^\s*- nest: {$/m);
    expect(result).toMatch(/^\s*\+ nest: str$/m);

    expect(result).toMatch(/^\s*- group2: {$/m);
    expect(result).toMatch(/^\s*\+ group3: {$/m);
  });

  test('compare nested YAML structures', () => {
    const result = genDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'));

    expect(result).toMatch(/^\s*\+ follow: false$/m);
    expect(result).toMatch(/^\s*- setting2: 200$/m);
    expect(result).toMatch(/^\s*\+ setting4: blah blah$/m);
    expect(result).toMatch(/^\s*- baz: bas$/m);
    expect(result).toMatch(/^\s*\+ baz: bars$/m);
  });

  test('compare mixed JSON and YAML files', () => {
    const result = genDiff(getFixturePath('file1.json'), getFixturePath('file2.yml'));

    expect(result).toMatch(/^\s*\+ follow: false$/m);
    expect(result).toMatch(/^\s*- setting2: 200$/m);
  });
});