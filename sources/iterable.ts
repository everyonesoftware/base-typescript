import { Indexable } from "./indexable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { Pre } from "./pre";

/**
 * An object that can be iterated over.
 */
export abstract class Iterable<T> implements JavascriptIterable<T>
{
    public static create<T>(values?: T[]): Iterable<T>
    {
        return Indexable.create(values);
    }

    /**
     * Iterate over the values in this {@link Iterable}.
     */
    public abstract iterate(): Iterator<T>;

    public abstract [Symbol.iterator](): JavascriptIterator<T>;

    public static [Symbol.iterator]<T>(iterable: Iterable<T>): JavascriptIterator<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return iterable.iterate()[Symbol.iterator]();
    }

    /**
     * Get all of the values in this {@link Iterable} in an {@link Array}.
     */
    public abstract toArray(): T[];

    /**
     * Get all of the values in the provided {@link Iterable} in an {@link Array}.
     */
    public static toArray<T>(iterable: Iterable<T>): T[]
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return iterable.iterate().toArray();
    }

    /**
     * Get the {@link String} representation of this {@link Iterable}.
     */
    public abstract toString(): string;

    /**
     * Get the {@link String} representation of the provided {@link Iterable}.
     */
    public static toString<T>(iterable: Iterable<T>): string
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return JSON.stringify(iterable.toArray());
    }

    /**
     * Get a {@link MapIterable} that maps all of the {@link T} values in this {@link Iterable} to
     * {@link TOutput} values.
     * @param mapping The mapping function to use to convert values of type {@link T} to
     * {@link TOutput}.
     */
    public abstract map<TOutput>(mapping: (value: T) => TOutput): MapIterable<T,TOutput>;

    /**
     * Get a {@link MapIterable} that maps all of the {@link T} values in the provided
     * {@link Iterable} to {@link TOutput} values.
     * @param mapping The mapping function to use to convert values of type {@link T} to
     * {@link TOutput}.
     */
    public static map<TInput,TOutput>(iterable: Iterable<TInput>, mapping: (value: TInput) => TOutput): MapIterable<TInput,TOutput>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");
        Pre.condition.assertNotUndefinedAndNotNull(mapping, "mapping");

        return MapIterable.create(iterable, mapping);
    }
}