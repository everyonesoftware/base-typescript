import { Comparable } from "./comparable";
import { Indexable } from "./indexable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { Pre } from "./pre";
import { Result } from "./result";
import { ToStringFunctions } from "./toStringFunctions";

/**
 * An object that can be iterated over.
 */
export abstract class Iterable<T> implements JavascriptIterable<T>
{
    public static create<T>(values?: JavascriptIterable<T>): Iterable<T>
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
     * Get whether this {@link Iterable} contains any values.
     */
    public abstract any(): boolean;

    /**
     * Get whether the provided {@link Iterable} contains any values.
     */
    public static any<T>(iterable: Iterable<T>): boolean
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return iterable.iterate().any();
    }

    /**
     * Get the number of values in this {@link Iterable}.
     */
    public abstract getCount(): number;

    /**
     * Get the number of values in the provided {@link Iterable}.
     */
    public static getCount<T>(iterable: Iterable<T>): number
    {
        return iterable.iterate().getCount();
    }

    /**
     * Get the {@link String} representation of this {@link Iterable}.
     */
    public abstract toString(toStringFunctions?: ToStringFunctions): string;

    /**
     * Get the {@link String} representation of the provided {@link Iterable}.
     */
    public static toString<T>(iterable: Iterable<T>, toStringFunctions?: ToStringFunctions): string
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");

        const iterableArray: T[] = iterable.toArray();
        return toStringFunctions
            ? toStringFunctions.toString(iterableArray)
            : JSON.stringify(iterableArray);
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

    /**
     * Get the first value in this {@link Iterable}.
     */
    public abstract first(): Result<T>;

    /**
     * Get the first value from the provided {@link Iterable}.
     * @param iterable The {@link Iterable} to get the first value from.
     */
    public static first<T>(iterable: Iterable<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return iterable.iterate().first();
    }

    /**
     * Find the maximum value in the provided {@link Iterable}.
     * @param iterable The values to find the maximum of.
     */
    public static findMaximum<T extends Comparable<T>>(iterable: JavascriptIterable<T> | Iterable<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return Iterator.findMaximum(Iterator.create(iterable));
    }
}