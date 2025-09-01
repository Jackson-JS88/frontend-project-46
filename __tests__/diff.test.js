import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/diff.js';
import { parse, getFormat } from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

test('compare JSON files from fixtures', () => {
  const result = genDiff(getFixturePath('filepath1.json'), getFixturePath('filepath2.json'));
  
  expect(result).toContain('- follow: false');
  expect(result).toContain('- proxy: 123.234.53.22');
  expect(result).toContain('- timeout: 50');
  expect(result).toContain('+ timeout: 20');
  expect(result).toContain('+ verbose: true');
  expect(result).toContain('  host: hexlet.io');
});

test('compare YAML files', () => {
  const result = genDiff(getFixturePath('filepath1.yml'), getFixturePath('filepath2.yml'));
  
  expect(result).toContain('- follow: false');
  expect(result).toContain('- proxy: 123.234.53.22');
  expect(result).toContain('- timeout: 50');
  expect(result).toContain('+ timeout: 20');
  expect(result).toContain('+ verbose: true');
  expect(result).toContain('  host: hexlet.io');
});

test('compare mixed JSON and YAML files', () => {
  const result = genDiff(getFixturePath('filepath1.json'), getFixturePath('filepath2.yml'));
  
  expect(result).toContain('- follow: false');
  expect(result).toContain('- proxy: 123.234.53.22');
  expect(result).toContain('- timeout: 50');
  expect(result).toContain('+ timeout: 20');
  expect(result).toContain('+ verbose: true');
  expect(result).toContain('  host: hexlet.io');
});

test('compare user files from fixtures', () => {
  const result = genDiff(getFixturePath('user1.json'), getFixturePath('user2.json'));
  
  expect(result).toContain('  name: Evgenii');
  expect(result).toContain('  age: 37');
  expect(result).toContain('- city: Volgograd');
  expect(result).toContain('+ country: Russia');
});

test('parse with unsupported format', () => {
  expect(() => parse('content', 'xml')).toThrow('Unsupported format: xml');
});

test('getFormat with unsupported extension', () => {
  expect(() => getFormat('file.txt')).toThrow('Unsupported file extension: .txt');
});