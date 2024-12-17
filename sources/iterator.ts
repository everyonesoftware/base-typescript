import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { MapIterator } from "./mapIterator";
import { Pre } from "./pre";
import { Post } from "./post";
import { JavascriptIteratorToIteratorAdapter } from "./javascriptIteratorToIteratorAdapter";
import { Result } from "./result";
import { EmptyError } from "./emptyError";
import { WhereIterator } from "./whereIterator";
import { Type, instanceOfType, isJavascriptIterator, isUndefinedOrNull } from "./types";
import { Comparable } from "./comparable";
import { TakeIterator } from "./takeIterator";
import { NotFoundError } from "./notFoundError";
import { SkipIterator } from "./skipIterator";

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
    public takeCurrent(): T
    {
        return Iterator.takeCurrent(this);
    }

    public static takeCurrent<T>(iterator: Iterator<T>): T
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");
        Pre.condition.assertTrue(iterator.hasCurrent(), "iterator.hasCurrent()");

        const result: T = iterator.getCurrent();
        iterator.next();

        return result;
    }

    public [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<T>
    {
        return Iterator[Symbol.iterator](this);
    }

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
     * Get whether this {@link Iterator} contains any values.
     * Note: This may advance the {@link Iterator} to the first value if it hasn't been
     * started yet.
     */
    public any(): boolean
    {
        return Iterator.any(this);
    }

    /**
     * Get whether this {@link Iterator} contains any values.
     * Note: This may advance the {@link Iterator} to the first value if it hasn't been
     * started yet.
     */
    public static any<T>(iterator: Iterator<T>): boolean
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        iterator.start();
        return iterator.hasCurrent();
    }

    /**
     * Get the number of values in this {@link Iterator}.
     * Note: This will consume all of the values in this {@link Iterator}.
     */
    public getCount(): number
    {
        return Iterator.getCount(this);
    }

    /**
     * Get the number of values in the provided {@link Iterator}.
     * Note: This will consume all of the values in the provided {@link Iterator}.
     */
    public static getCount<T>(iterator: Iterator<T>): number
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        let result: number = 0;
        if (iterator.hasCurrent())
        {
            result++;
        }
        while (iterator.next())
        {
            result++;
        }

        Post.condition.assertGreaterThanOrEqualTo(result, 0, "result");

        return result;
    }

    /**
     * Get all of the remaining values in this {@link Iterator} in a {@link T} {@link Array}.
     */
    public toArray(): T[]
    {
        return Iterator.toArray(this);
    }

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
    public where(condition: (value: T) => boolean) : Iterator<T>
    {
        return Iterator.where(this, condition);
    }

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
    public map<TOutput>(mapping: (value: T) => TOutput): MapIterator<T,TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public static map<T,TOutput>(iterator: Iterator<T>, mapping: (value: T) => TOutput): MapIterator<T,TOutput>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");
        Pre.condition.assertNotUndefinedAndNotNull(mapping, "mapping");

        return MapIterator.create(iterator, mapping);
    }

    /**
     * Get an {@link Iterator} that will filter this {@link Iterator} to only the values that are
     * instances of {@link U} based on the provided type check {@link Function}.
     * @param typeCheck The {@link Function} that will be used to determine if values are of type
     * {@link U}.
     */
    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public static whereInstanceOf<T,U extends T>(iterator: Iterator<T>, typeCheck: (value: T) => value is U): Iterator<U>
    {
        Pre.condition.assertNotUndefinedAndNotNull(typeCheck, "typeCheck");

        return iterator.where(typeCheck)
            .map((value: T) => value as U);
    }

    /**
     * Get an {@link Iterator} that will filter this {@link Iterator} to only the values that are
     * instances of the provided {@link Type}.
     * @param type The type of values to return from the new {@link Iterator}.
     */
    public whereInstanceOfType<U extends T>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public static whereInstanceOfType<T,U extends T>(iterator: Iterator<T>, type: Type<U>): Iterator<U>
    {
        Pre.condition.assertNotUndefinedAndNotNull(type, "type");

        return iterator.whereInstanceOf((value: T) => instanceOfType(value, type));
    }

    /**
     * Get the first value in this {@link Iterator}. If the condition function is undefined, then
     * this function will return the first value in this {@link Iterator}. If this condition
     * function is provided, then this function will return the first value that matches the
     * provided condition.
     * @param condition The condition that the returned value must satisfy.
     */
    public first(condition?: (value: T) => boolean): Result<T>
    {
        return Iterator.first(this, condition);
    }

    /**
     * Get the first value from the provided {@link Iterator}.
     * @param iterator The {@link Iterator} to get the first value from.
     */
    public static first<T>(iterator: Iterator<T>, condition?: (value: T) => boolean): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return Result.create(() =>
        {
            iterator.start();
            if (isUndefinedOrNull(condition))
            {
                if (!iterator.hasCurrent())
                {
                    throw new NotFoundError("No value was found in the Iterator.");
                }
            }
            else
            {
                while (iterator.hasCurrent() && !condition(iterator.getCurrent()))
                {
                    iterator.next();
                }

                if (!iterator.hasCurrent())
                {
                    throw new NotFoundError("No value was found in the Iterator that matched the provided condition.");
                }
            }
            return iterator.getCurrent();
        });
    }

    /**
     * Get the last value in this {@link Iterator}.
     */
    public last(): Result<T>
    {
        return Iterator.first(this);
    }

    /**
     * Get the last value from the provided {@link Iterator}.
     * @param iterator The {@link Iterator} to get the last value from.
     */
    public static last<T>(iterator: Iterator<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        return Result.create(() =>
        {
            if (!iterator.start().hasCurrent())
            {
                throw new EmptyError();
            }

            let result: T;
            do
            {
                result = iterator.takeCurrent();
            }
            while (iterator.hasCurrent());

            return result;
        });
    }

    /**
     * Find the maximum value in the provided {@link Iterator}.
     * @param iterator The values to find the maximum of.
     */
    public static findMaximum<T extends Comparable<T>>(iterator: JavascriptIterator<T> | Iterator<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterable");

        return Result.create(() =>
        {
            if (isJavascriptIterator(iterator))
            {
                iterator = Iterator.create(iterator);
            }

            let result: T = iterator.first()
                .convertError(EmptyError, () => new EmptyError("Can't find the maximum of an empty Iterator."))
                .await();
            while (iterator.next())
            {
                const currentValue: T = iterator.getCurrent();
                if (result.lessThan(currentValue))
                {
                    result = currentValue;
                }
            }
            
            return result;
        });
    }

    /**
     * Get a new {@link Iterator} that wraps around this {@link Iterator} and only
     * returns a maximum number of values from this {@link Iterator}.
     * @param maximumToTake The maximum number of values to take from this {@link Iterator}.
     */
    public take(maximumToTake: number): Iterator<T>
    {
        return Iterator.take(this, maximumToTake);
    }

    public static take<T>(iterator: Iterator<T>, maximumToTake: number): Iterator<T>
    {
        return TakeIterator.create(iterator, maximumToTake);
    }

    /**
     * Get a new {@link Iterator} that wraps around this {@link Iterator} and will skip the initial
     * provided number of values before beginning to return values.
     * @param maximumToSkip The maximum number of values to skip from this {@link Iterator}.
     */
    public skip(maximumToSkip: number): Iterator<T>
    {
        return Iterator.skip(this, maximumToSkip);
    }

    public static skip<T>(iterator: Iterator<T>, maximumToSkip: number): Iterator<T>
    {
        return SkipIterator.create(iterator, maximumToSkip);
    }
}