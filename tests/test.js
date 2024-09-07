const utils = require('../index');

describe('Utility Functions', () => {
    
    describe('isInBrowser', () => {
        it('should return true if window is defined', () => {
            global.window = { document: {}, sessionStorage: {}, crypto: { subtle: {}} };
            expect(utils.isInBrowser()).toBe(true);
        });

        it('should return false if window is not defined', () => {
            delete global.window;
            expect(utils.isInBrowser()).toBe(false);
        });
    });

    describe('isPlainObject', () => {
        test('returns true for a plain object with valid values', () => {
          expect(utils.isPlainObject({ a: 1, b: 'string', c: true, d: undefined, e: null })).toBe(true);
        });
      
        test('returns true for an empty object', () => {
          expect(utils.isPlainObject({})).toBe(true);
        });
      
        test('returns true for an array of plain objects', () => {
          expect(utils.isPlainObject([{ a: 1 }, { b: 'string' }])).toBe(true);
        });
      
        test('returns false for an object with nested objects', () => {
          expect(utils.isPlainObject({ a: 1, b: { c: 2 } })).toBe(false);
        });
      
        test('returns false for an array with non-object elements', () => {
          expect(utils.isPlainObject([1, 2, 3])).toBe(false);
        });
      
        test('returns false for null', () => {
          expect(utils.isPlainObject(null)).toBe(false);
        });
      
        test('returns false for undefined', () => {
          expect(utils.isPlainObject(undefined)).toBe(false);
        });
      
        test('returns false for primitive types', () => {
          expect(utils.isPlainObject(42)).toBe(false);
          expect(utils.isPlainObject('string')).toBe(false);
          expect(utils.isPlainObject(true)).toBe(false);
        });
      
        test('returns false for functions', () => {
          expect(utils.isPlainObject(() => {})).toBe(false);
        });
      
        test('returns true for an array of empty objects', () => {
          expect(utils.isPlainObject([{}, {}])).toBe(true);
        });
      
        test('returns false for an array with mixed valid and invalid objects', () => {
          expect(utils.isPlainObject([{ a: 1 }, { b: { c: 2 } }])).toBe(false);
        });
    });

    describe('secondsToHumanReadable', () => {
        it('should return "10 years and more" for seconds greater than 10 years', () => {
            const seconds = 10 * 365 * 24 * 60 * 60 + 1;
            expect(utils.secondsToHumanReadable(seconds)).toBe('10 years and more');
        });

        it('should return "3 years and more" for seconds greater than 3 years but less than 10 years', () => {
            const seconds = 4 * 365 * 24 * 60 * 60;
            expect(utils.secondsToHumanReadable(seconds)).toBe('3 years and more');
        });

        it('should return "1 year" for exactly 1 year', () => {
            const seconds = 365 * 24 * 60 * 60;
            expect(utils.secondsToHumanReadable(seconds)).toBe('1 year');
        });

        it('should return "365 days" for exactly 1 year in days', () => {
            const seconds = 365 * 24 * 60 * 60;
            expect(utils.secondsToHumanReadable(seconds)).toBe('1 year');
        });

        it('should return "1 day" for exactly 1 day', () => {
            const seconds = 24 * 60 * 60;
            expect(utils.secondsToHumanReadable(seconds)).toBe('1 day');
        });

        it('should return "1 hour" for exactly 1 hour', () => {
            const seconds = 60 * 60;
            expect(utils.secondsToHumanReadable(seconds)).toBe('1 hour');
        });

        it('should return "1 minute" for exactly 1 minute', () => {
            const seconds = 60;
            expect(utils.secondsToHumanReadable(seconds)).toBe('1 minute');
        });

        it('should return "1 second" for exactly 1 second', () => {
            const seconds = 1;
            expect(utils.secondsToHumanReadable(seconds)).toBe('1 second');
        });

        it('should return correct human-readable format for random values', () => {
            const seconds = 2 * 365 * 24 * 60 * 60 + 3 * 24 * 60 * 60 + 4 * 60 * 60 + 5 * 60 + 6;
            expect(utils.secondsToHumanReadable(seconds)).toBe('2 years and 3 days');
        });
    });
    
    describe('toSnakeCase', () => {
        it('should convert camelCase to snake_case', () => {
            expect(utils.toSnakeCase('camelCaseString')).toBe('camel_case_string');
        });

        it('should handle strings with no uppercase letters', () => {
            expect(utils.toSnakeCase('lowercasestring')).toBe('lowercasestring');
        });
    });

    describe('camelToSnake', () => {
        it('should convert object keys from camelCase to snake_case', () => {
            const obj = { camelCaseKey: 'value' };
            expect(utils.camelToSnake(obj)).toEqual({ camel_case_key: 'value' });
        });

        it('should handle nested objects', () => {
            const obj = { outerKey: { innerKey: 'value' } };
            expect(utils.camelToSnake(obj)).toEqual({ outer_key: { inner_key: 'value' } });
        });

        it('should handle arrays of objects', () => {
            const obj = [{ camelCaseKey: 'value' }];
            expect(utils.camelToSnake(obj)).toEqual([{ camel_case_key: 'value' }]);
        });

        it('should convert date strings ending with "_at" to Date objects', () => {
            const obj = { createdAt: '2023-08-10T00:00:00Z' };
            const result = utils.camelToSnake(obj);
            expect(result.created_at).toBeInstanceOf(Date);
        });
    });

    describe('toCamelCase', () => {
        it('should convert snake_case to camelCase', () => {
            expect(utils.toCamelCase('snake_case_string')).toBe('snakeCaseString');
        });

        it('should handle strings with no underscores', () => {
            expect(utils.toCamelCase('lowercasestring')).toBe('lowercasestring');
        });
    });

    describe('snakeToCamel', () => {
        it('should convert object keys from snake_case to camelCase', () => {
            const obj = { snake_case_key: 'value' };
            expect(utils.snakeToCamel(obj)).toEqual({ snakeCaseKey: 'value' });
        });

        it('should handle nested objects', () => {
            const obj = { outer_key: { inner_key: 'value' } };
            expect(utils.snakeToCamel(obj)).toEqual({ outerKey: { innerKey: 'value' } });
        });

        it('should handle arrays of objects', () => {
            const obj = [{ snake_case_key: 'value' }];
            expect(utils.snakeToCamel(obj)).toEqual([{ snakeCaseKey: 'value' }]);
        });

        it('should convert date strings ending with "_at" to Date objects', () => {
            const obj = { created_at: '2023-08-10T00:00:00Z' };
            const result = utils.snakeToCamel(obj);
            expect(result.createdAt).toBeInstanceOf(Date);
        });
    });
});
