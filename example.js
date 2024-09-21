'use strict';

const {
    secondsToHumanReadable,
    toSnakeCase,
    camelToSnake,
    toCamelCase,
    snakeToCamel
} = require('./dist/index.js');

(async () => {
    let result;
    result = secondsToHumanReadable(10);
    console.log({result});
    result = secondsToHumanReadable(60);
    console.log({result});
    result = secondsToHumanReadable(190);
    console.log({result});
    result = secondsToHumanReadable(1290);
    console.log({result});
    result = toCamelCase('hello_world');
    console.log({result});
    result = snakeToCamel({'hello_world_again': 1, 'time_at': '2024-08-04T23:12:40.398Z'});
    console.log({result});
    result = toSnakeCase('helloWorld');
    console.log({result});
    result = camelToSnake({'helloWorld': 1, 'timeAt': '2024-08-04T23:12:40.398Z'});
})();