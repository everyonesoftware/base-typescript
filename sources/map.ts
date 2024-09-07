import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterator } from "./javascript";
import { JavascriptMapMap } from "./javascriptMapMap";
import { MapIterable } from "./mapIterable";
import { Pre } from "./pre";
import { Result } from "./result";
import { join } from "./strings";
import { ToStringFunctions } from "./toStringFunctions";
import { hasFunction } from "./types";

export function isMap(value: unknown): value is Map<unknown,unknown>
{
    return value instanceof Map ||
        (
            hasFunction(value, "containsKey", 1) &&
            hasFunction(value, "get", 1) &&
            hasFunction(value, "set", 2) &&
            hasFunction(value, "iterateKeys", 0) &&
            hasFunction(value, "iterateValues", 0)
        );
}

/**
 * A type that maps TKey values to TValue values.
 */
export abstract class Map<TKey,TValue> implements Iterable<[TKey,TValue]>
{
    /**
     * Create a new instance of the default {@link Map} implementation.
     */
    public static create<TKey,TValue>(): Map<TKey,TValue>
    {
        return JavascriptMapMap.create();
    }

    /**
     * Iterate over the entries in this {@link Map}.
     */
    public abstract iterate(): Iterator<[TKey, TValue]>;

    public abstract any(): boolean;

    public abstract toArray(): [TKey, TValue][];

    /**
     * Get the {@link String} representation of this {@link Map}.
     */
    public abstract toString(toStringFunctions?: ToStringFunctions): string;

    /**
     * Get the {@link String} representation of the provided {@link Map}.
     */
    public static toString<TKey,TValue>(map: Map<TKey,TValue>, toStringFunctions?: ToStringFunctions): string
    {
        Pre.condition.assertNotUndefinedAndNotNull(map, "iterable");

        if (!toStringFunctions)
        {
            toStringFunctions = ToStringFunctions.create();
        }
        return `{${join(",", map.map((entry: [unknown,unknown]) => `${toStringFunctions.toString(entry[0])}:${toStringFunctions.toString(entry[1])}`))}}`;
    }

    public abstract map<TOutput>(mapping: (value: [TKey, TValue]) => TOutput): MapIterable<[TKey, TValue], TOutput>;

    public abstract [Symbol.iterator](): JavascriptIterator<[TKey, TValue]>;

    /**
     * Get the number of entries in this {@link Map}.
     */
    public abstract getCount(): number;

    public abstract first(): Result<[TKey, TValue]>;

    /**
     * Get whether this {@link Map} contains the provided key.
     * @param key The key to look for.
     */
    public abstract containsKey(key: TKey): boolean;

    /**
     * Get the value associated with the provided key.
     * @param key The key of the value to get.
     */
    public abstract get(key: TKey): Result<TValue>;

    /**
     * Set the key/value association in this {@link Map}.
     * @param key The key associated with the value.
     * @param value The value associated with the key.
     */
    public abstract set(key: TKey, value: TValue): this;

    /**
     * Iterate over the keys in this {@link Map}.
     */
    public abstract iterateKeys(): Iterator<TKey>;

    /**
     * Iterate over the keys in the {@link Map}.
     * @param map The map to iterate over.
     */
    public static iterateKeys<TKey,TValue>(map: Map<TKey,TValue>): Iterator<TKey>
    {
        Pre.condition.assertNotUndefinedAndNotNull(map, "map");

        return map.iterate().map((entry: [TKey, TValue]) => entry[0]);
    }

    /**
     * Iterate over the values in this {@link Map}.
     */
    public abstract iterateValues(): Iterator<TValue>;

    /**
     * Iterate over the keys in the {@link Map}.
     * @param map The map to iterate over.
     */
    public static iterateValues<TKey,TValue>(map: Map<TKey,TValue>): Iterator<TValue>
    {
        Pre.condition.assertNotUndefinedAndNotNull(map, "map");

        return map.iterate().map((entry: [TKey, TValue]) => entry[1]);
    }
}