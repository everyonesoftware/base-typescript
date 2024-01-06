import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";

export abstract class IterableBase<T> implements Iterable<T>
{
    public abstract iterate(): Iterator<T>;

    public toArray(): T[]
    {
        return Iterable.toArray(this);
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
}