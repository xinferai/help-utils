
declare module '@xinferai/help-utils' {
    export function isInBrowser(): boolean;
    export function isPlainObject(obj: any): boolean;
    export function secondsToHumanReadable(seconds: number): string;
    export function toSnakeCase(str: string): string;
    export function camelToSnake(obj: any): any;
    export function toCamelCase(str: string): string;
    export function snakeToCamel(obj: any): any;
}