import { Iterable } from "./iterable";
import { JavascriptIterable, JavascriptIterator } from "./javascript";

/**
 * A {@link Type} type that can be used to pass class types as parameters.
 */
export type Type<T> = new (...args: any[]) => T;

/**
 * Get whether the provided value is a {@link boolean}.
 * @param value The value to check.
 */
export function isBoolean(value: unknown): value is boolean
{
    return typeof value === "boolean";
}

/**
 * Get whether the provided value is a {@link number}.
 * @param value The value to check.
 */
export function isNumber(value: unknown): value is number
{
    return typeof value === "number";
}

/**
 * Get whether the provided value is a {@link string}.
 * @param value The value to check.
 */
export function isString(value: unknown): value is string
{
    return typeof value === "string";
}

/**
 * Get whether the provided value is a {@link function}.
 * @param value The value to check.
 */
export function isFunction(value: unknown): value is Function
{
    return typeof value === "function";
}

/**
 * Get whether the provided value is an {@link Array}.
 * @param value The value to check.
 */
export function isArray(value: unknown): value is unknown[]
{
    return Array.isArray(value);
}

/**
 * Get whether the provided value is an {@link Object} or is null.
 * @param value The value to check.
 */
export function isObjectOrArrayOrNull(value: unknown): value is {} | unknown[] | null
{
    return typeof value === "object";
}

/**
 * Get whether the provided value is an {@link Object}.
 * @param value The value to check.
 * @returns 
 */
export function isObject(value: unknown): value is {}
{
    return isObjectOrArrayOrNull(value) && !!value && !isArray(value);
}

/**
 * Get whether the provided value has a property with the provided key.
 * @param value The value to check.
 * @param propertyKey The key of the property to look for.
 */
export function hasProperty<TValue, TPropertyKey extends PropertyKey>(value: TValue, propertyKey: TPropertyKey): value is TValue & Record<TPropertyKey, unknown>
{
    return value !== undefined && value !== null && (value as any)[propertyKey] !== undefined;
}

/**
 * Get whether the value has a function with the provided name.
 * @param value The value to check.
 * @param functionName The name of the function to look for.
 */
export function hasFunction<TValue, TPropertyKey extends PropertyKey>(value: TValue, functionName: TPropertyKey): value is TValue & Record<TPropertyKey,Function>
{
    return value !== undefined && value !== null && isFunction((value as any)[functionName]);
}

/**
 * Get whether the provided value is a {@link JavascriptIterator}.
 * @param value The value to check.
 */
export function isJavascriptIterator<T>(value: unknown): value is JavascriptIterator<T>
{
    return hasFunction(value, "next");
}

/**
 * Get whether the provided value is a {@link JavascriptIterable}.
 * @param value The value to check.
 */
export function isJavascriptIterable<T>(value: unknown): value is JavascriptIterable<T>
{
    return hasFunction(value, Symbol.iterator);
}

export function isIterable<T>(value: unknown): value is Iterable<T>
{
    return isJavascriptIterable(value) &&
        hasFunction(value, "iterate");
}

/**
 * Get the name of the provided {@link Type}.
 * @param type The {@link Type} to get the name of.
 */
export function getName(type: Type<unknown>): string
{
    return type.name;
}