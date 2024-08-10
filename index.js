'use strict';

module.exports = {
    isInBrowser,
    isPlainObject,
    secondsToHumanReadable,
    toSnakeCase,
    camelToSnake,
    toCamelCase,
    snakeToCamel
};

function isInBrowser() {
    return typeof window !== 'undefined' && !!window.document;
}

function isPlainObject(val) {
    return !!val && typeof val === 'object' && val.constructor === Object;
}

function secondsToHumanReadable(seconds) {
    // Constants to help convert seconds
    const SECONDS_PER_MINUTE = 60;
    const MINUTES_PER_HOUR = 60;
    const HOURS_PER_DAY = 24;
  
    // Calculate the total number of days, hours, and minutes
    const days = Math.floor(seconds / (SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY));
    if (days > 365) {
        const years = Math.floor(days / 365);
        if (years > 10) {
            return "10 years and more";
        }
        if (years > 3) {
            return "3 years and more";
        }
        return years + " year" + (years > 1 ? "s" : "");
    }
    if (days > 0) {
        return days + " day" + (days > 1 ? "s" : "");
    }
    const hours = Math.floor((seconds % (SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY)) / (SECONDS_PER_MINUTE * MINUTES_PER_HOUR));
    if (hours > 0) { 
        return hours + " hour" + (hours > 1 ? "s" : "");
    }
    const minutes = Math.floor((seconds % (SECONDS_PER_MINUTE * MINUTES_PER_HOUR)) / SECONDS_PER_MINUTE);
    if (minutes > 0) {
        return minutes + " minute" + (minutes > 1 ? "s" : "");
    }
    return seconds + " second" + (seconds > 1 ? "s" : "");
}

function toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
  
function camelToSnake(obj) {
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

function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

function snakeToCamel(obj) {
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