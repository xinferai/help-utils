// src/index.ts

import { parseISO, isValid } from 'date-fns';

export {
    isPlainValue,
    isPlainObject,
    base64Decode,
    secondsToHumanReadable,
    isInBrowser,
    convertCase,
    parseDate,
    convertObject, 
    camelToSnake,
    snakeToCamel,
    endsWithAtToDate
};

export default {
    isPlainValue,
    isPlainObject,
    base64Decode,
    secondsToHumanReadable,
    isInBrowser,
    convertCase,
    parseDate,
    convertObject,
    camelToSnake,
    snakeToCamel,
    endsWithAtToDate
};

function isInBrowser(): boolean {
    if (typeof window === 'undefined') return false;
    if (typeof window.document === 'undefined') return false;
    return true;
}

type PlainValue = null | undefined | number | string | boolean | Date;
type PlainObject = { [key: string]: PlainValue | PlainObject } | (PlainValue | PlainObject)[];

function isPlainValue(value: unknown): value is PlainValue {
    if (value === null || value === undefined) return true;

    const type = typeof value;
    
    if (type === 'number') {
        return Number.isFinite(value);
    }
    
    if (type === 'string' || type === 'boolean') return true;

    if (value instanceof Date && !isNaN(value.getTime())) return true;

    return false;
}

function isPlainObject(input: unknown, seen = new WeakSet()): input is PlainObject {
    if (input === null || typeof input !== 'object') {
        return false;
    }

    if (seen.has(input)) {
        return false; // Circular reference detected
    }

    seen.add(input);

    if (Array.isArray(input)) {
        return input.every(
            (item) => isPlainValue(item) || isPlainObject(item, seen)
        );
    }

    for (const key in input as Record<string, unknown>) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
            const value = (input as Record<string, unknown>)[key];
            if (!isPlainValue(value) && !isPlainObject(value, seen)) {
                return false;
            }
        }
    }

    return true;
}

// Universal base64 decoding
function base64Decode(str: string): string {
    if (typeof Buffer !== 'undefined') {
        // Node.js environment
        return Buffer.from(str, 'base64').toString('utf8');
    } else if (typeof atob === 'function') {
        // Browser environment with atob
        return decodeURIComponent(
            atob(str).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join('')
        );
    } else {
        // Fallback for environments without Buffer or atob
        throw new Error('Base64 decoding is not supported in this environment');
    }
};

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_YEAR = 365;

const TIME_UNITS = [
  { unit: 'year', seconds: SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_YEAR },
  { unit: 'day', seconds: SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY },
  { unit: 'hour', seconds: SECONDS_PER_MINUTE * MINUTES_PER_HOUR },
  { unit: 'minute', seconds: SECONDS_PER_MINUTE },
  { unit: 'second', seconds: 1 },
];

function pluralize(count: number, unit: string): string {
  return `${count} ${unit}${count !== 1 ? 's' : ''}`;
}

function secondsToHumanReadable(seconds: number): string {
  if (seconds < 0) {
    throw new Error('Input must be a non-negative number');
  }

  if (seconds >= 10 * TIME_UNITS[0].seconds) {
    return '10 years and more';
  }

  if (seconds >= 3 * TIME_UNITS[0].seconds) {
    return '3 years and more';
  }

  const result: string[] = [];
  let remainingSeconds = seconds;

  for (const { unit, seconds: unitSeconds } of TIME_UNITS) {
    if (remainingSeconds >= unitSeconds) {
      const count = Math.floor(remainingSeconds / unitSeconds);
      result.push(pluralize(count, unit));
      remainingSeconds %= unitSeconds;

      if (unit === 'year' && remainingSeconds > 0) {
        const days = Math.floor(remainingSeconds / TIME_UNITS[1].seconds);
        if (days > 0) {
          result.push(pluralize(days, 'day'));
        }
        break;
      }

      if (result.length === 1) break;
    }
  }

  return result.join(' and ') || '0 seconds';
}

type CaseStyle = 'snake' | 'camel' | 'none';

function convertCase(str: string, to: CaseStyle): string {
    if (to === 'snake') {
        return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    } else if (to === 'camel') {
        return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    }
    return str; // 'none' case, return as is
}

function parseDate(value: string): Date | null {
    if (!value) return null;
    const date = parseISO(value);
    return isValid(date) ? date : null;
}

function convertObject<T extends object>(
    obj: T,
    toCaseStyle: CaseStyle,
    convertDates: boolean = false
): any {
    if (typeof obj !== 'object' || obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => convertObject(item, toCaseStyle, convertDates));
    }

    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
        let newKey = convertCase(key, toCaseStyle);
        let newValue = value;

        if (typeof value === 'object' && value !== null) {
            newValue = convertObject(value, toCaseStyle, convertDates);
        } else if (convertDates && typeof value === 'string' && 
                   (key.endsWith('_at') || key.endsWith('At'))) {
            newValue = parseDate(value);
        }

        result[newKey] = newValue;
    }

    return result;
}

function snakeToCamel<T extends object>(obj: T): any {
    return convertObject(obj, 'camel');
}

function camelToSnake<T extends object>(obj: T): any {
    return convertObject(obj, 'snake');
}

function endsWithAtToDate<T extends object>(obj: T): any {
    return convertObject(obj, 'none', true);
}