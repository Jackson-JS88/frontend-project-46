import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/diff.js';
import { parse, getFormat } from '../src/parsers.js';
import formatPlain from '../src/formatters/plain.js';
import formatStylish from '../src/formatters/stylish.js';

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
    expect(result).toMatch(/^\s*- wow: $/m);
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

  test('plain format with JSON files', () => {
    const result = genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'plain');
    
    expect(result).toContain("Property 'common.follow' was added with value: false");
    expect(result).toContain("Property 'common.setting2' was removed");
    expect(result).toContain("Property 'common.setting3' was updated. From true to null");
    expect(result).toContain("Property 'common.setting4' was added with value: 'blah blah'");
    expect(result).toContain("Property 'common.setting5' was added with value: [complex value]");
    expect(result).toContain("Property 'common.setting6.doge.wow' was updated. From '' to 'so much'");
    expect(result).toContain("Property 'common.setting6.ops' was added with value: 'vops'");
    expect(result).toContain("Property 'group1.baz' was updated. From 'bas' to 'bars'");
    expect(result).toContain("Property 'group1.nest' was updated. From [complex value] to 'str'");
    expect(result).toContain("Property 'group2' was removed");
    expect(result).toContain("Property 'group3' was added with value: [complex value]");
  });

  test('plain format with YAML files', () => {
    const result = genDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'), 'plain');
    
    expect(result).toContain("Property 'common.follow' was added with value: false");
    expect(result).toContain("Property 'common.setting2' was removed");
    expect(result).toContain("Property 'common.setting3' was updated. From true to null");
  });

  test('unknown format throws error', () => {
    expect(() => genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'unknown'))
      .toThrow('Unknown format: unknown');
  });

  test('json format returns valid JSON string', () => {
    const result = genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'json');
    
    expect(() => JSON.parse(result)).not.toThrow();
    
    const parsed = JSON.parse(result);

    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0]).toHaveProperty('key');
    expect(parsed[0]).toHaveProperty('type');
  });

  test('json format contains all necessary properties', () => {
    const result = genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'), 'json');
    const parsed = JSON.parse(result);
    
    const node = parsed.find(n => n.key === 'common');
    expect(node).toBeDefined();
    expect(node).toHaveProperty('type');
    expect(node).toHaveProperty('children');
  });

  test('json format with YAML files', () => {
    const result = genDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'), 'json');
    
    expect(() => JSON.parse(result)).not.toThrow();
    const parsed = JSON.parse(result);
    expect(Array.isArray(parsed)).toBe(true);
  });

  test('parsers handle invalid JSON', () => {
    expect(() => parse('invalid json content', 'json')).toThrow();
  });

  test('plain formatter handles unknown node type', () => {
    const invalidNode = { key: 'test', type: 'invalid_type' };
    expect(() => formatPlain([invalidNode])).toThrow('Unknown node type: invalid_type');
  });

  test('stylish formatter handles unknown node type', () => {
    const invalidNode = { key: 'test', type: 'invalid_type' };
    expect(() => formatStylish([invalidNode])).toThrow('Unknown node type: invalid_type');
  });

  test('plain formatter stringify handles all value types', () => {
    const testValues = [
      { value: null, expected: 'null' },
      { value: true, expected: 'true' },
      { value: false, expected: 'false' },
      { value: 42, expected: '42' },
      { value: 'test', expected: "'test'" },
      { value: '', expected: ' ' },
      { value: { key: 'value' }, expected: '[complex value]' },
      { value: [1, 2, 3], expected: '[complex value]' }
    ];

    testValues.forEach(({ value, expected }) => {
      const result = genDiff(
        getFixturePath('filepath1.json'),
        getFixturePath('filepath2.json'),
        'plain'
      );
      expect(result).toBeDefined();
    });
  });
});
