const {
  isInBrowser,
  isPlainValue,
  isPlainObject,
  secondsToHumanReadable,
  toSnakeCase,
  camelToSnake,
  toCamelCase,
  snakeToCamel
} = require('../dist/index.js');


describe('Utility Functions', () => {
    
    describe('isInBrowser', () => {
        it('should return true if window is defined', () => {
            global.window = { document: {}, sessionStorage: {}, crypto: { subtle: {}} };
            expect(isInBrowser()).toBe(true);
        });

        it('should return false if window is not defined', () => {
            delete global.window;
            expect(isInBrowser()).toBe(false);
        });
    });

    describe('isPlainValue', () => {
      test('should return true for null', () => {
        expect(isPlainValue(null)).toBe(true);
      });
    
      test('should return false for undefined', () => {
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
    
      test('should return true for strings', () => {
        expect(isPlainValue('hello')).toBe(true);
        expect(isPlainValue('')).toBe(true);
      });
    
      test('should return true for booleans', () => {
        expect(isPlainValue(true)).toBe(true);
        expect(isPlainValue(false)).toBe(true);
      });
    
      test('should return true for Date objects', () => {
        expect(isPlainValue(new Date())).toBe(true);
      });
    
      test('should return false for objects', () => {
        expect(isPlainValue({})).toBe(false);
        expect(isPlainValue({ a: 1 })).toBe(false);
      });
    
      test('should return false for arrays', () => {
        expect(isPlainValue([])).toBe(false);
        expect(isPlainValue([1, 2, 3])).toBe(false);
      });
    
      test('should return false for functions', () => {
        expect(isPlainValue(() => {})).toBe(false);
      });
    });
    
    describe('isPlainObject', () => {
      test('should return false for null', () => {
        expect(isPlainObject(null)).toBe(false);
      });
    
      test('should return false for non-objects', () => {
        expect(isPlainObject(42)).toBe(false);
        expect(isPlainObject('string')).toBe(false);
        expect(isPlainObject(true)).toBe(false);
        expect(isPlainObject(undefined)).toBe(false);
      });
    
      test('should return true for empty objects', () => {
        expect(isPlainObject({})).toBe(true);
      });
    
      test('should return true for objects with plain values', () => {
        expect(isPlainObject({ a: 1, b: 'string', c: true, d: null })).toBe(true);
      });
    
      test('should return true for nested plain objects', () => {
        expect(isPlainObject({ a: { b: { c: 42 } } })).toBe(true);
      });
    
      test('should return true for objects with Date values', () => {
        expect(isPlainObject({ date: new Date() })).toBe(true);
      });
    
      test('should return false for objects with non-plain values', () => {
        expect(isPlainObject({ a: 1, b: () => {} })).toBe(false);
        expect(isPlainObject({ a: 1, b: Symbol() })).toBe(false);
      });
    
      test('should return true for empty arrays', () => {
        expect(isPlainObject([])).toBe(true);
      });
    
      test('should return true for arrays with plain values', () => {
        expect(isPlainObject([1, 'string', true, null])).toBe(true);
      });
    
      test('should return true for arrays with nested plain objects', () => {
        expect(isPlainObject([{ a: 1 }, { b: 2 }])).toBe(true);
      });
    
      test('should return false for arrays with non-plain values', () => {
        expect(isPlainObject([1, () => {}])).toBe(false);
      });
    
      test('should return true for objects with undefined values', () => {
        expect(isPlainObject({ a: 1, b: undefined })).toBe(true);
      });
    
      test('should return false for arrays with undefined values', () => {
        expect(isPlainObject([1, undefined, 2])).toBe(true);
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

        it('should return "1 year" for exactly 1 year', () => {
            const seconds = 365 * 24 * 60 * 60;
            expect(secondsToHumanReadable(seconds)).toBe('1 year');
        });

        it('should return "365 days" for exactly 1 year in days', () => {
            const seconds = 365 * 24 * 60 * 60;
            expect(secondsToHumanReadable(seconds)).toBe('1 year');
        });

        it('should return "1 day" for exactly 1 day', () => {
            const seconds = 24 * 60 * 60;
            expect(secondsToHumanReadable(seconds)).toBe('1 day');
        });

        it('should return "1 hour" for exactly 1 hour', () => {
            const seconds = 60 * 60;
            expect(secondsToHumanReadable(seconds)).toBe('1 hour');
        });

        it('should return "1 minute" for exactly 1 minute', () => {
            const seconds = 60;
            expect(secondsToHumanReadable(seconds)).toBe('1 minute');
        });

        it('should return "1 second" for exactly 1 second', () => {
            const seconds = 1;
            expect(secondsToHumanReadable(seconds)).toBe('1 second');
        });

        it('should return correct human-readable format for random values', () => {
            const seconds = 2 * 365 * 24 * 60 * 60 + 3 * 24 * 60 * 60 + 4 * 60 * 60 + 5 * 60 + 6;
            expect(secondsToHumanReadable(seconds)).toBe('2 years and 3 days');
        });
    });
    
    describe('toSnakeCase', () => {
        it('should convert camelCase to snake_case', () => {
            expect(toSnakeCase('camelCaseString')).toBe('camel_case_string');
        });

        it('should handle strings with no uppercase letters', () => {
            expect(toSnakeCase('lowercasestring')).toBe('lowercasestring');
        });
    });

    describe('camelToSnake', () => {
        it('should convert object keys from camelCase to snake_case', () => {
            const obj = { camelCaseKey: 'value' };
            expect(camelToSnake(obj)).toEqual({ camel_case_key: 'value' });
        });

        it('should handle nested objects', () => {
            const obj = { outerKey: { innerKey: 'value' } };
            expect(camelToSnake(obj)).toEqual({ outer_key: { inner_key: 'value' } });
        });

        it('should handle arrays of objects', () => {
            const obj = [{ camelCaseKey: 'value' }];
            expect(camelToSnake(obj)).toEqual([{ camel_case_key: 'value' }]);
        });

        it('should convert date strings ending with "_at" to Date objects', () => {
            const obj = { createdAt: '2023-08-10T00:00:00Z' };
            const result = camelToSnake(obj);
            expect(result.created_at).toBeInstanceOf(Date);
        });
    });

    describe('toCamelCase', () => {
        it('should convert snake_case to camelCase', () => {
            expect(toCamelCase('snake_case_string')).toBe('snakeCaseString');
        });

        it('should handle strings with no underscores', () => {
            expect(toCamelCase('lowercasestring')).toBe('lowercasestring');
        });
    });

    describe('snakeToCamel', () => {
        it('should convert object keys from snake_case to camelCase', () => {
            const obj = { snake_case_key: 'value' };
            expect(snakeToCamel(obj)).toEqual({ snakeCaseKey: 'value' });
        });

        it('should handle nested objects', () => {
            const obj = { outer_key: { inner_key: 'value' } };
            expect(snakeToCamel(obj)).toEqual({ outerKey: { innerKey: 'value' } });
        });

        it('should handle arrays of objects', () => {
            const obj = [{ snake_case_key: 'value' }];
            expect(snakeToCamel(obj)).toEqual([{ snakeCaseKey: 'value' }]);
        });

        it('should convert date strings ending with "_at" to Date objects', () => {
            const obj = { created_at: '2023-08-10T00:00:00Z' };
            const result = snakeToCamel(obj);
            expect(result.createdAt).toBeInstanceOf(Date);
        });
    });
});
