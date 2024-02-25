import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { MapIterator } from "./mapIterator";
import { Pre } from "./pre";
import { JavascriptIteratorToIteratorAdapter } from "./javascriptIteratorToIteratorAdapter";
import { Result } from "./result";
import { EmptyError } from "./emptyError";
import { WhereIterator } from "./whereIterator";

/**
 * A type that can be used to iterate over a collection.
 */
export abstract class Iterator<T> implements JavascriptIterable<T>
{
    /**
     * Create a new {@link Iterator} that contains the provided values.
     * @param values The values that the new {@link Iterator} will iterate over.
     */
    public static create<T>(values: JavascriptIterator<T> | JavascriptIterable<T>): Iterator<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(values, "values");

        return JavascriptIteratorToIteratorAdapter.create(values);
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

    public abstract [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<T>;

    /**
     * Convert the provided {@link Iterator} to a {@link IteratorToJavascriptIteratorAdapter}.
     * @param iterator The {@link Iterator} to convert.
     */
    public static [Symbol.iterator]<T>(iterator: Iterator<T>): IteratorToJavascriptIteratorAdapter<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return IteratorToJavascriptIteratorAdapter.create(iterator);
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
     * Get an {@link Iterator} that will only return values that match the provided condition.
     * @param condition The condition to run against each of the values in this {@link Iterator}.
     */
    public abstract where(condition: (value: T) => boolean) : Iterator<T>;

    public static where<T>(iterator: Iterator<T>, condition: (value: T) => boolean): Iterator<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");
        Pre.condition.assertNotUndefinedAndNotNull(condition, "condition");

        return WhereIterator.create(iterator, condition);
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

    /**
     * Get the first value in this {@link Iterator}.
     */
    public abstract first(): Result<T>;

    /**
     * Get the first value from the provided {@link Iterator}.
     * @param iterator The {@link Iterator} to get the first value from.
     */
    public static first<T>(iterator: Iterator<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return Result.create(() =>
        {
            iterator.start();
            if (!iterator.hasCurrent())
            {
                throw new EmptyError();
            }
            return iterator.getCurrent();
        });
    }
}