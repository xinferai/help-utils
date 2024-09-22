// src/index.ts

export {
    isPlainValue,
    isPlainObject,
    base64Decode,
    secondsToHumanReadable,
    isInBrowser,
    toCamelCase,
    toSnakeCase,
    camelToSnake,
    snakeToCamel
};

export default {
    isPlainValue,
    isPlainObject,
    base64Decode,
    secondsToHumanReadable,
    isInBrowser,
    toCamelCase,
    toSnakeCase,
    camelToSnake,
    snakeToCamel
};

function isInBrowser(): boolean {
    if (typeof window === 'undefined') return false;
    if (typeof window.document === 'undefined') return false;
    return true;
}

function isPlainValue(value: any): boolean {
    if (value === null) return true;
    if (value === undefined) return false;

    const type = typeof value;
    
    if (type === 'number') {
        return isFinite(value);
    }
    
    if (['string', 'boolean'].includes(type)) return true;

    if (value instanceof Date) return true;

    return false;
}

function isPlainObject(input: any): boolean {
    if (input === null || typeof input !== 'object') {
        return false; 
    }

    if (Array.isArray(input)) {
        return input.every(
            (item) => item !== undefined && (isPlainValue(item) || isPlainObject(item))
        );
    }

    for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
            const value = input[key];
            if (value === undefined) continue;
            if (!isPlainValue(value) && !isPlainObject(value)) {
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

function secondsToHumanReadable(seconds: number): string {
    const SECONDS_PER_MINUTE = 60;
    const MINUTES_PER_HOUR = 60;
    const HOURS_PER_DAY = 24;
    const DAYS_PER_YEAR = 365;

    const days = Math.floor(seconds / (SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY));
    
    if (days >= DAYS_PER_YEAR * 10) {
        return "10 years and more";
    }
    
    if (days >= DAYS_PER_YEAR * 3) {
        return "3 years and more";
    }
    
    if (days >= DAYS_PER_YEAR) {
        const years = Math.floor(days / DAYS_PER_YEAR);
        const remainingDays = days % DAYS_PER_YEAR;
        if (remainingDays > 0) {
            return `${years} year${years > 1 ? "s" : ""} and ${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
        }
        return `${years} year${years > 1 ? "s" : ""}`;
    }
    
    if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""}`;
    }
    
    const hours = Math.floor((seconds % (SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY)) / (SECONDS_PER_MINUTE * MINUTES_PER_HOUR));
    if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    
    const minutes = Math.floor((seconds % (SECONDS_PER_MINUTE * MINUTES_PER_HOUR)) / SECONDS_PER_MINUTE);
    if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }
    
    return `${seconds} second${seconds > 1 ? "s" : ""}`;
}

function toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
  
function camelToSnake(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(camelToSnake);
    }
    const entries = Object.entries(obj);
    if (entries.length === 0) {
        return obj;
    }
    const newObj = {};
    for (let [key, value] of entries) {
        key = toSnakeCase(key);
        value = camelToSnake(value);
        if (key.endsWith('_at') && typeof value === 'string') {
            if (!value) value = null;
            else value = new Date(value);
        }
        newObj[key] = value;
    };
    return newObj;
}

function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

function snakeToCamel(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(snakeToCamel);
    }
    const entries = Object.entries(obj);
    if (entries.length === 0) {
        return obj;
    }
    const newObj = {}; 
    for (let [key, value] of entries) {
        key = toCamelCase(key);
        value = snakeToCamel(value);
        if (key.endsWith('At') && typeof value === 'string') {
            if (!value) value = null;
            else value = new Date(value);
        }
        newObj[key] = value;
    };
    return newObj;
}