import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { Result } from "./result";

export abstract class IterableBase<T> implements Iterable<T>
{
    public abstract iterate(): Iterator<T>;

    public toArray(): T[]
    {
        return Iterable.toArray(this);
    }

    public equals(right: Iterable<T>): boolean
    {
        return Iterable.equals(this, right);
    }

    public toString(): string
    {
        return Iterable.toString(this);
    }

    public map<TOutput>(mapping: (value: T) => TOutput): MapIterable<T, TOutput>
    {
        return Iterable.map(this, mapping);
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterable[Symbol.iterator](this);
    }

    public abstract any(): boolean;

    public abstract getCount(): number;

    public first(): Result<T>
    {
        return Iterable.first(this);
    }

    public last(): Result<T>
    {
        return Iterable.last(this);
    }
}