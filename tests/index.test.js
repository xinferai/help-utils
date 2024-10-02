// tests/index.test.js

const {
  isPlainValue,
  isPlainObject,
  secondsToHumanReadable,
  isInBrowser,
  convertCase,
  parseDate,
  convertObject,
  camelToSnake,
  snakeToCamel,
  endsWithAtToDate
} = require('../dist/index.js');

describe('Utility Functions', () => {
  describe('isInBrowser', () => {
    it('should return true if window is defined', () => {
      const globalAny = global;
      globalAny.window = { document: {} };
      expect(isInBrowser()).toBe(true);
      delete globalAny.window;
    });

    it('should return false if window is not defined', () => {
      expect(isInBrowser()).toBe(false);
    });
  });

  describe('isPlainValue', () => {
    test('should return true for null and undefined', () => {
      expect(isPlainValue(null)).toBe(true);
      expect(isPlainValue(undefined)).toBe(true);
    });

    test('should return true for finite numbers', () => {
      expect(isPlainValue(42)).toBe(true);
      expect(isPlainValue(0)).toBe(true);
      expect(isPlainValue(-3.14)).toBe(true);
    });

    test('should return false for non-finite numbers', () => {
      expect(isPlainValue(Infinity)).toBe(false);
      expect(isPlainValue(-Infinity)).toBe(false);
      expect(isPlainValue(NaN)).toBe(false);
    });

    test('should return true for strings and booleans', () => {
      expect(isPlainValue('hello')).toBe(true);
      expect(isPlainValue('')).toBe(true);
      expect(isPlainValue(true)).toBe(true);
      expect(isPlainValue(false)).toBe(true);
    });

    test('should return true for valid Date objects', () => {
      expect(isPlainValue(new Date())).toBe(true);
    });

    test('should return false for invalid Date objects', () => {
      expect(isPlainValue(new Date('invalid'))).toBe(false);
    });

    test('should return false for objects, arrays, and functions', () => {
      expect(isPlainValue({})).toBe(false);
      expect(isPlainValue([])).toBe(false);
      expect(isPlainValue(() => {})).toBe(false);
    });
  });

  describe('isPlainObject', () => {
    test('should return false for null and non-objects', () => {
      expect(isPlainObject(null)).toBe(false);
      expect(isPlainObject(42)).toBe(false);
      expect(isPlainObject('string')).toBe(false);
      expect(isPlainObject(true)).toBe(false);
    });

    test('should return true for empty objects and arrays', () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject([])).toBe(true);
    });

    test('should return true for objects with plain values', () => {
      expect(isPlainObject({ a: 1, b: 'string', c: true, d: null })).toBe(true);
    });

    test('should return true for nested plain objects', () => {
      expect(isPlainObject({ a: { b: { c: 42 } } })).toBe(true);
    });

    test('should return true for arrays with plain values', () => {
      expect(isPlainObject([1, 'string', true, null])).toBe(true);
    });

    test('should return false for objects with non-plain values', () => {
      expect(isPlainObject({ a: 1, b: () => {} })).toBe(false);
      expect(isPlainObject({ a: 1, b: Symbol() })).toBe(false);
    });

    test('should handle circular references', () => {
      const obj = { a: 1 };
      obj.b = obj;
      expect(isPlainObject(obj)).toBe(false);
    });
  });

  describe('secondsToHumanReadable', () => {
    it('should return "10 years and more" for seconds greater than 10 years', () => {
      const seconds = 10 * 365 * 24 * 60 * 60 + 1;
      expect(secondsToHumanReadable(seconds)).toBe('10 years and more');
    });

    it('should return "3 years and more" for seconds greater than 3 years but less than 10 years', () => {
      const seconds = 4 * 365 * 24 * 60 * 60;
      expect(secondsToHumanReadable(seconds)).toBe('3 years and more');
    });

    it('should return correct human-readable format for various durations', () => {
      expect(secondsToHumanReadable(365 * 24 * 60 * 60)).toBe('1 year');
      expect(secondsToHumanReadable(24 * 60 * 60)).toBe('1 day');
      expect(secondsToHumanReadable(60 * 60)).toBe('1 hour');
      expect(secondsToHumanReadable(60)).toBe('1 minute');
      expect(secondsToHumanReadable(1)).toBe('1 second');
    });

    it('should handle complex durations', () => {
      const seconds = 2 * 365 * 24 * 60 * 60 + 3 * 24 * 60 * 60 + 4 * 60 * 60 + 5 * 60 + 6;
      expect(secondsToHumanReadable(seconds)).toBe('2 years and 3 days');
    });

    it('should throw an error for negative input', () => {
      expect(() => secondsToHumanReadable(-1)).toThrow('Input must be a non-negative number');
    });
  });

  describe('convertCase', () => {
    it('should convert camelCase to snake_case', () => {
      expect(convertCase('camelCaseString', 'snake')).toBe('camel_case_string');
    });

    it('should convert snake_case to camelCase', () => {
      expect(convertCase('snake_case_string', 'camel')).toBe('snakeCaseString');
    });

    it('should return the original string for "none" case', () => {
      expect(convertCase('originalString', 'none')).toBe('originalString');
    });
  });

  describe('parseDate', () => {
    it('should parse valid date strings', () => {
      const date = parseDate('2023-08-10T00:00:00Z');
      expect(date).toBeInstanceOf(Date);
      expect(date?.toISOString()).toBe('2023-08-10T00:00:00.000Z');
    });

    it('should return null for invalid date strings', () => {
      expect(parseDate('invalid-date')).toBeNull();
    });

    it('should return null for empty strings', () => {
      expect(parseDate('')).toBeNull();
    });
  });

  describe('convertObject', () => {
    it('should convert object keys to snake_case', () => {
      const obj = { camelCase: 'value' };
      expect(convertObject(obj, 'snake')).toEqual({ camel_case: 'value' });
    });

    it('should convert object keys to camelCase', () => {
      const obj = { snake_case: 'value' };
      expect(convertObject(obj, 'camel')).toEqual({ snakeCase: 'value' });
    });

    it('should handle nested objects and arrays', () => {
      const obj = { outerKey: { innerKey: 'value' }, arr: [{ nestedKey: 'value' }] };
      expect(convertObject(obj, 'snake')).toEqual({
        outer_key: { inner_key: 'value' },
        arr: [{ nested_key: 'value' }]
      });
    });

    it('should convert date strings to Date objects when convertDates is true', () => {
      const obj = { createdAt: '2023-08-10T00:00:00Z' };
      const result = convertObject(obj, 'snake', true);
      expect(result.created_at).toBeInstanceOf(Date);
    });
  });

  describe('camelToSnake', () => {
    it('should convert object keys from camelCase to snake_case', () => {
      const obj = { camelCaseKey: 'value', updatedAt: '2023-08-11T00:00:00Z', createdAt: new Date() };
      const result = camelToSnake(obj);
      expect(result.camel_case_key).toBe('value');
      expect(result.updated_at).toBeInstanceOf(Date);
      expect(result.created_at).toBeInstanceOf(Date);
    });
  });

  describe('snakeToCamel', () => {
    it('should convert object keys from snake_case to camelCase', () => {
      const obj = { snake_case_key: 'value', created_at: '2023-08-10T00:00:00Z', updatedAt: new Date() };
      const result = snakeToCamel(obj);
      expect(result.snakeCaseKey).toBe('value');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('endsWithAtToDate', () => {
    it('should convert date strings ending with "_at" or "At" to Date objects', () => {
      const obj = { created_at: '2023-08-10T00:00:00Z', updatedAt: '2023-08-11T00:00:00Z', datedAt: new Date() };
      const result = endsWithAtToDate(obj);
      //console.log(result);
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.datedAt).toBeInstanceOf(Date);
    });

    it('should not convert non-date strings', () => {
      const obj = { name: 'John', age: '30' };
      const result = endsWithAtToDate(obj);
      expect(result).toEqual(obj);
    });
  });
});