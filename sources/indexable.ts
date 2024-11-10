import { EmptyError } from "./emptyError";
import { IndexableIterator } from "./indexableIterator";
import { Iterable } from "./iterable";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { MutableIndexable } from "./mutableIndexable";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type } from "./types";

/**
 * An object that can access its elements by index.
 */
export abstract class Indexable<T> implements Iterable<T>
{
    public static create<T>(values?: JavascriptIterable<T>): Indexable<T>
    {
        return MutableIndexable.create(values);
    }

    public abstract iterate(): IndexableIterator<T>;

    public abstract toArray(): T[];

    public abstract any(): boolean;

    public abstract getCount(): number;

    public abstract equals(right: Iterable<T>): boolean;

    public abstract toString(): string;

    public abstract map<TOutput>(mapping: (value: T) => TOutput): MapIterable<T, TOutput>;

    public abstract where(condition: (value: T) => boolean): Iterable<T>;

    public abstract instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>;

    public abstract [Symbol.iterator](): JavascriptIterator<T>;

    /**
     * Get the value at the provided index.
     * @param index The index of the value to return.
     */
    public abstract get(index: number): T;

    /**
     * Get the first value in this {@link Indexable}.
     */
    public first(): Result<T>
    {
        return Indexable.first(this);
    }

    /**
     * Get the first value in the provided {@link Indexable}.
     */
    public static first<T>(indexable: Indexable<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(indexable, "indexable");

        return indexable.any()
            ? Result.value(indexable.get(0))
            : Result.error(new EmptyError());
    }

    /**
     * Get the last value in this {@link Indexable}.
     */
    public last(): Result<T>
    {
        return Indexable.first(this);
    }

    /**
     * Get the last value in the provided {@link Indexable}.
     */
    public static last<T>(indexable: Indexable<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(indexable, "indexable");

        return indexable.any()
            ? Result.value(indexable.get(indexable.getCount() - 1))
            : Result.error(new EmptyError());
    }
}

