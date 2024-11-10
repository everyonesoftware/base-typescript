import { Indexable } from "./indexable";
import { Iterable } from "./iterable";
import { IndexableIterator } from "./indexableIterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { List } from "./list";
import { MapIterable } from "./mapIterable";
import { Result } from "./result";
import { Type } from "./types";

/**
 * An object that can modify its elements by index.
 */
export abstract class MutableIndexable<T> implements Indexable<T>
{
    public static create<T>(values?: JavascriptIterable<T>): MutableIndexable<T>
    {
        return List.create(values);
    }

    public abstract iterate(): IndexableIterator<T>;

    public abstract toArray(): T[];

    public abstract equals(right: Iterable<T>): boolean;

    public abstract toString(): string;

    public abstract map<TOutput>(mapping: (value: T) => TOutput): MapIterable<T, TOutput>;

    public abstract where(condition: (value: T) => boolean): Iterable<T>;

    public abstract instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>;

    public abstract [Symbol.iterator](): JavascriptIterator<T>;

    public abstract any(): boolean;

    public abstract getCount(): number;

    public first(): Result<T>
    {
        return Indexable.first(this);
    }

    public last(): Result<T>
    {
        return Indexable.last(this);
    }

    public abstract get(index: number): T;

    /**
     * Set the value at the provided index.
     * @param index The index of the value to set.
     * @param value The value to set at the provided index.
     */
    public abstract set(index: number, value: T): this;
}