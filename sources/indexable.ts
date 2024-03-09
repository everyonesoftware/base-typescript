import { EmptyError } from "./emptyError";
import { IndexableIterator } from "./indexableIterator";
import { Iterable } from "./iterable";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { MutableIndexable } from "./mutableIndexable";
import { Pre } from "./pre";
import { Result } from "./result";

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

    public abstract toString(): string;

    public abstract map<TOutput>(mapping: (value: T) => TOutput): MapIterable<T, TOutput>;

    public abstract [Symbol.iterator](): JavascriptIterator<T>;

    /**
     * Get the value at the provided index.
     * @param index The index of the value to return.
     */
    public abstract get(index: number): T;

    public abstract first(): Result<T>;

    public static first<T>(indexable: Indexable<T>): Result<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(indexable, "indexable");

        return indexable.getCount() === 0
            ? Result.error(new EmptyError())
            : Result.value(indexable.get(0));
    }
}

