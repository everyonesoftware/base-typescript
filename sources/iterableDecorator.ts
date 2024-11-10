import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type } from "./types";

export abstract class IterableDecorator<T> implements Iterable<T>
{
    private readonly innerIterable: Iterable<T>;

    protected constructor(innerIterable: Iterable<T>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerIterable, "innerIterable");

        this.innerIterable = innerIterable;
    }

    public any(): boolean
    {
        return this.innerIterable.any();
    }

    public getCount(): number
    {
        return this.innerIterable.getCount();
    }

    public equals(right: JavascriptIterable<T>, equalFunctions?: EqualFunctions): boolean
    {
        return this.innerIterable.equals(right, equalFunctions);
    }

    public toArray(): T[]
    {
        return this.innerIterable.toArray();
    }

    public where(condition: (value: T) => boolean): Iterable<T>
    {
        return this.innerIterable.where(condition);
    }

    public instanceOf<TOutput extends T>(typeOrTypeCheck: Type<TOutput> | ((value: T) => value is TOutput)): Iterable<TOutput>
    {
        return this.innerIterable.instanceOf(typeOrTypeCheck);
    }

    public map<TOutput>(mapping: (value: T) => TOutput): MapIterable<T, TOutput>
    {
        return this.innerIterable.map(mapping);
    }

    public first(): Result<T>
    {
        return this.innerIterable.first();
    }

    public last(): Result<T>
    {
        return this.innerIterable.last();
    }

    public iterate(): Iterator<T>
    {
        return this.innerIterable.iterate();
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return this.innerIterable[Symbol.iterator]();
    }
}