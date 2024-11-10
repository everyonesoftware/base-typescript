import { Comparable } from "./comparable";
import { Comparer } from "./comparer";
import { EqualFunctions } from "./equalFunctions";
import { Indexable } from "./indexable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { Pre } from "./pre";
import { Result } from "./result";
import { ToStringFunctions } from "./toStringFunctions";
import { isUndefinedOrNull, Type } from "./types";
import * as types from "./types";
import { WhereIterable } from "./whereIterable";

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

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterable[Symbol.iterator](this);
    }

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
     * Get whether the provided {@link JavascriptIterable} contains any values.
     */
    public static any<T>(iterable: JavascriptIterable<T>): boolean
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return Iterator.create(iterable).any();
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
     * Get whether this {@link Iterable} is equal to the provided {@link Iterable}.
     * @param right The {@link Iterable} to compare against this {@link Iterable}.
     * @param equalFunctions The optional {@link EqualFunctions} to use to determine if the two
     * {@link Iterable}s are equal.
     */
    public abstract equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): boolean;

    public static equals<T>(left: JavascriptIterable<T>, right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): boolean
    {
        if (isUndefinedOrNull(equalFunctions))
        {
            equalFunctions = EqualFunctions.create();
        }

        let result: boolean | undefined = Comparer.equalSameUndefinedNull(left, right);
        if (result === undefined)
        {
            result = true;

            const leftIterator: Iterator<T> = Iterator.create(left).start();
            const rightIterator: Iterator<T> = Iterator.create(right).start();
            while (leftIterator.hasCurrent() && rightIterator.hasCurrent())
            {
                result = equalFunctions.areEqual(leftIterator.getCurrent(), rightIterator.getCurrent());
                if (result === false)
                {
                    break;
                }
                else
                {
                    leftIterator.next();
                    rightIterator.next();
                }
            }
            if (result)
            {
                result = (leftIterator.hasCurrent() === rightIterator.hasCurrent());
            }
        }
        return result;
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

        if (isUndefinedOrNull(toStringFunctions))
        {
            toStringFunctions = ToStringFunctions.create();
        }
        return toStringFunctions.toString(iterable);
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
     * Get an {@link Iterable} that contains values from this {@link Iterable} that match the
     * provided condition.
     * @param condition The condition to run against each of the values in this {@link Iterable}.
     */
    public abstract where(condition: (value: T) => boolean): Iterable<T>;

    /**
     * Get an {@link Iterable} that contains values from the provided {@link Iterable} that match
     * the provided condition.
     * @param iterable The {@link Iterable} to get values from.
     * @param condition The condition that the values must match to be contained in the new
     * {@link Iterable}.
     */
    public static where<T>(iterable: JavascriptIterable<T>, condition: (value: T) => boolean): Iterable<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");
        Pre.condition.assertNotUndefinedAndNotNull(condition, "condition");

        if (!types.isIterable(iterable))
        {
            iterable = Iterable.create(iterable);
        }
        return WhereIterable.create(iterable as Iterable<T>, condition);
    }

    /**
     * Get an {@link Iterable} that contains values from this {@link Iterable} that match the
     * provided {@link Type} or type check function.
     * @param typeOrTypeCheck The {@link Type} or type check function that returned values must
     * match.
     */
    public abstract instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>;

    /**
     * Get an {@link Iterable} that contains values from the provided {@link Iterable} that match
     * the provided {@link Type} or type check function.
     * @param iterable The {@link Iterable} to get values from.
     * @param typeOrTypeCheck The {@link Type} or type check function that returned values must
     * match.
     */
    public static instanceOf<TInput,TOutput extends TInput>(iterable: JavascriptIterable<TInput>, typeOrTypeCheck: Type<TOutput> | ((value: TInput) => value is TOutput)): Iterable<TOutput>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");
        Pre.condition.assertNotUndefinedAndNotNull(typeOrTypeCheck, "typeOrTypeCheck");

        return Iterable.where(iterable, (value: TInput) => types.instanceOf(value, typeOrTypeCheck))
            .map((value: TInput) => (value as unknown) as TOutput);
    }

    /**
     * Get the first value in this {@link Iterable}.
     */
    public first(): Result<T>
    {
        return Iterable.first(this);
    }

    /**
     * Get the first value from the provided {@link JavascriptIterable}.
     * @param iterable The {@link JavascriptIterable} to get the first value from.
     */
    public static first<T>(iterable: JavascriptIterable<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return Iterator.create(iterable).first();
    }

    /**
     * Get the last value in this {@link Iterable}.
     */
    public last(): Result<T>
    {
        return Iterable.last(this);
    }

    /**
     * Get the last value from the provided {@link JavascriptIterable}.
     * @param iterable The {@link JavascriptIterable} to get the last value from.
     */
    public static last<T>(iterable: JavascriptIterable<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterable, "iterable");

        return Iterator.create(iterable).last();
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