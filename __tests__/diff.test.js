import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import buildDiff from '../src/diff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => JSON.parse(readFileSync(getFixturePath(filename), 'utf-8'));

test('compare JSON files from fixtures', () => {
  const data1 = readFixture('filepath1.json');
  const data2 = readFixture('filepath2.json');
  
  const result = buildDiff(data1, data2);
  
  expect(result).toContain('- follow: false');
  expect(result).toContain('- proxy: 123.234.53.22');
  expect(result).toContain('- timeout: 50');
  expect(result).toContain('+ timeout: 20');
  expect(result).toContain('+ verbose: true');
  expect(result).toContain('  host: hexlet.io');
});

test('compare user files from fixtures', () => {
  const data1 = readFixture('user1.json');
  const data2 = readFixture('user2.json');
  
  const result = buildDiff(data1, data2);
  
  expect(result).toContain('  name: Evgenii');
  expect(result).toContain('  age: 37');
  expect(result).toContain('- city: Volgograd');
  expect(result).toContain('+ country: Russia');
});

test('compare with numeric values', () => {
  const obj1 = { a: 1, b: 2, c: 3 };
  const obj2 = { a: 1, b: 20, d: 4 };
  
  const result = buildDiff(obj1, obj2);
  
  expect(result).toContain('  a: 1');
  expect(result).toContain('- b: 2');
  expect(result).toContain('+ b: 20');
  expect(result).toContain('- c: 3');
  expect(result).toContain('+ d: 4');
});

test('compare with boolean values', () => {
  const obj1 = { active: true, verified: false };
  const obj2 = { active: false, registered: true };
  
  const result = buildDiff(obj1, obj2);
  
  expect(result).toContain('- active: true');
  expect(result).toContain('+ active: false');
  expect(result).toContain('- verified: false');
  expect(result).toContain('+ registered: true');
});

test('compare empty objects', () => {
  const obj1 = {};
  const obj2 = {};
  
  const result = buildDiff(obj1, obj2);
  
  console.log('Result for empty objects:', JSON.stringify(result));
  expect(result).toContain('{');
  expect(result).toContain('}');
});

test('compare with null values', () => {
  const obj1 = { value: null, data: 'test' };
  const obj2 = { value: 'not null', data: 'test' };
  
  const result = buildDiff(obj1, obj2);
  
  expect(result).toContain('- value: null');
  expect(result).toContain('+ value: not null');
  expect(result).toContain('  data: test');
});