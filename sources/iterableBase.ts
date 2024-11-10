import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { Result } from "./result";
import { Type } from "./types";

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

    public where(condition: (value: T) => boolean): Iterable<T>
    {
        return Iterable.where(this, condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return Iterable.instanceOf(this, typeOrTypeCheck);
    }


    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return Iterable[Symbol.iterator](this);
    }

    public any(): boolean
    {
        return Iterable.any(this);
    }

    public getCount(): number
    {
        return Iterable.getCount(this);
    }

    public first(): Result<T>
    {
        return Iterable.first(this);
    }

    public last(): Result<T>
    {
        return Iterable.last(this);
    }
}