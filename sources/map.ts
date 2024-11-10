import { Comparer } from "./comparer";
import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterator } from "./javascript";
import { JavascriptMapMap } from "./javascriptMapMap";
import { MapIterable } from "./mapIterable";
import { NotFoundError } from "./notFoundError";
import { Pre } from "./pre";
import { Result } from "./result";
import { join } from "./strings";
import { ToStringFunctions } from "./toStringFunctions";
import { hasFunction, isUndefinedOrNull, Type } from "./types";

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

export interface MapEntry<TKey,TValue>
{
    key: TKey,
    value: TValue,
}

/**
 * A type that maps {@link TKey} values to {@link TValue} values.
 */
export abstract class Map<TKey,TValue> implements Iterable<MapEntry<TKey,TValue>>
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
    public abstract iterate(): Iterator<MapEntry<TKey,TValue>>;

    public abstract any(): boolean;

    public abstract toArray(): MapEntry<TKey,TValue>[];

    public abstract equals(right: Iterable<MapEntry<TKey,TValue>>, equalFunctions?: EqualFunctions): boolean;

    public static equals<TKey,TValue>(left: Map<TKey,TValue>, right: Iterable<MapEntry<TKey,TValue>>, equalFunctions?: EqualFunctions): boolean
    {
        if (isUndefinedOrNull(equalFunctions))
        {
            equalFunctions = EqualFunctions.create();
        }

        let result: boolean | undefined = Comparer.equalSameUndefinedNull(left, right);
        if (result === undefined)
        {
            result = true;
            for (const entry of right)
            {
                result = left.get(entry.key)
                    .then((value: TValue) => equalFunctions.areEqual(value, entry.value))
                    .catch(() => false)
                    .await();
                if (result === false)
                {
                    break;
                }
            }
        }
        return result;
    }

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
        return `{${join(",", map.map((entry: MapEntry<unknown,unknown>) => `${toStringFunctions.toString(entry.key)}:${toStringFunctions.toString(entry.value)}`))}}`;
    }

    public abstract map<TOutput>(mapping: (value: MapEntry<TKey,TValue>) => TOutput): MapIterable<MapEntry<TKey,TValue>, TOutput>;

    public abstract where(condition: (value: MapEntry<TKey,TValue>) => boolean): Iterable<MapEntry<TKey,TValue>>;

    public abstract instanceOf<T extends MapEntry<TKey,TValue>>(typeOrTypeCheck: Type<T> | ((value: MapEntry<TKey,TValue>) => value is T)): Iterable<T>;

    public abstract [Symbol.iterator](): JavascriptIterator<MapEntry<TKey,TValue>>;

    /**
     * Get the number of entries in this {@link Map}.
     */
    public abstract getCount(): number;

    public abstract first(): Result<MapEntry<TKey,TValue>>;

    public abstract last(): Result<MapEntry<TKey,TValue>>;

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
     * Get the {@link TValue} associated with the provided {@link TKey}. If the provided
     * {@link TKey} doesn't exist in this {@link Map}, then invoke the provided {@link valueCreator}
     * and associate the returned {@link TValue} with the provided {@link TKey}. Then return the new
     * {@link TValue}.
     * @param key The {@link TKey} of the {@link TValue} to get.
     * @param valueCreator The {@link Function} that will be invoked if the {@link TKey} doesn't
     * exist in this {@link Map}.
     */
    public getOrSet(key: TKey, valueCreator: () => TValue): Result<TValue>
    {
        return Map.getOrSet(this, key, valueCreator);
    }

    /**
     * Get the {@link TValue} associated with the provided {@link TKey}. If the provided
     * {@link TKey} doesn't exist in the {@link Map}, then invoke the provided {@link valueCreator}
     * and associate the returned {@link TValue} with the provided {@link TKey}. Then return the new
     * {@link TValue}.
     * @param key The {@link TKey} of the {@link TValue} to get.
     * @param valueCreator The {@link Function} that will be invoked if the {@link TKey} doesn't
     * exist in this {@link Map}.
     */
    public static getOrSet<TKey,TValue>(map: Map<TKey,TValue>, key: TKey, valueCreator: () => TValue): Result<TValue>
    {
        Pre.condition.assertNotUndefinedAndNotNull(map, "map");
        Pre.condition.assertNotUndefinedAndNotNull(valueCreator, "valueCreator");

        return map.get(key)
            .catch(NotFoundError, () =>
            {
                const value: TValue = valueCreator();
                map.set(key, value);
                return value;
            });
    }

    /**
     * Remove the provided {@link TKey} from this {@link Map}. If the {@link TKey} doesn't exist in
     * this {@link Map}, then return a {@link NotFoundError}. If the {@link TKey} does exist, then
     * return the {@link TValue} that was associated with it.
     * @param key The {@link TKey} to remove from this {@link Map}.
     */
    public abstract remove(key: TKey): Result<TValue>;

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

        return map.iterate().map((entry: MapEntry<TKey,TValue>) => entry.key);
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

        return map.iterate().map((entry: MapEntry<TKey,TValue>) => entry.value);
    }
}