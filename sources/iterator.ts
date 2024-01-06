import { IndexableIterator } from "./indexableIterator";
import { JavascriptIterable } from "./javascript";
import { JavascriptIteratorAdapter } from "./javascriptIteratorAdapter";
import { MapIterator } from "./mapIterator";
import { Pre } from "./pre";

/**
 * A type that can be used to iterate over a collection.
 */
export abstract class Iterator<T> implements JavascriptIterable<T>
{
    /**
     * Create a new {@link Iterator} that contains the provided values.
     * @param values The values that the new {@link Iterator} will iterate over.
     */
    public static create<T>(values: T[]): Iterator<T>
    {
        return IndexableIterator.create(values);
    }

    /**
     * Move to the next value in the collection. Return whether this {@link Iterator} points to a
     * value after the move.
     */
    public abstract next(): boolean;

    /**
     * Get whether this {@link Iterator} has started iterating over the values in the collection.
     */
    public abstract hasStarted(): boolean;

    /**
     * Get whether this {@link Iterator} currently points at a value in the collection.
     */
    public abstract hasCurrent(): boolean;

    /**
     * Get the value that this {@link Iterator} points to.
     */
    public abstract getCurrent(): T;

    /**
     * Move to the first value if this {@link Iterator} hasn't started yet.
     * @returns This object for method chaining.
     */
    public abstract start(): this;

    /**
     * Move the provided {@link Iterator} to its first value if it hasn't started yet.
     */
    public static start<T,TIterator extends Iterator<T>>(iterator: TIterator): TIterator
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        if (!iterator.hasStarted())
        {
            iterator.next();
        }
        return iterator;
    }

    /**
     * Get the current value from this {@link Iterator} and advance this {@link Iterator} to the
     * next value.
     */
    public abstract takeCurrent(): T;

    public static takeCurrent<T>(iterator: Iterator<T>): T
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");
        Pre.condition.assertTrue(iterator.hasCurrent(), "iterator.hasCurrent()");

        const result: T = iterator.getCurrent();
        iterator.next();

        return result;
    }

    public abstract [Symbol.iterator](): JavascriptIteratorAdapter<T>;

    /**
     * Convert the provided {@link Iterator} to a {@link JavascriptIteratorAdapter}.
     * @param iterator The {@link Iterator} to convert.
     */
    public static [Symbol.iterator]<T>(iterator: Iterator<T>): JavascriptIteratorAdapter<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return JavascriptIteratorAdapter.create(iterator);
    }

    /**
     * Get all of the remaining values in this {@link Iterator} in a {@link T} {@link Array}.
     */
    public abstract toArray(): T[];

    /**
     * Get all of the remaining values in the provided {@link Iterator} in a {@link T}
     * {@link Array}.
     */
    public static toArray<T>(iterator: Iterator<T>): T[]
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        const result: T[] = [];
        for (const value of iterator)
        {
            result.push(value);
        }
        return result;
    }

    /**
     * Get a {@link MapIterator} that will map all {@link T} values from this {@link Iterator} to
     * {@link TOutput} values.
     * @param mapping The mapping that maps {@link T} values to {@link TOutput} values.
     */
    public abstract map<TOutput>(mapping: (value: T) => TOutput): MapIterator<T,TOutput>;

    public static map<T,TOutput>(iterator: Iterator<T>, mapping: (value: T) => TOutput): MapIterator<T,TOutput>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");
        Pre.condition.assertNotUndefinedAndNotNull(mapping, "mapping");

        return MapIterator.create(iterator, mapping);
    }
}