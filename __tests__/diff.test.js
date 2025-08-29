import buildDiff from '../src/diff.js';

test('flat JSON files comparison', () => {
  const obj1 = { host: 'hexlet.io', timeout: 50, proxy: '123.234.53.22', follow: false };
  const obj2 = { timeout: 20, verbose: true, host: 'hexlet.io' };
  
  const result = buildDiff(obj1, obj2);
  
  expect(result).toContain('- follow: false');
  expect(result).toContain('- proxy: 123.234.53.22'); 
  expect(result).toContain('- timeout: 50');
  expect(result).toContain('+ timeout: 20');
  expect(result).toContain('+ verbose: true');
  expect(result).toContain('  host: hexlet.io');
});