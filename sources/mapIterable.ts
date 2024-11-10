import { EqualFunctions } from "./equalFunctions";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterator } from "./javascript";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type } from "./types";

/**
 * An {@link Iterable} that converts {@link TInput} values to {@link TOutput} values.
 */
export class MapIterable<TInput,TOutput> implements Iterable<TOutput>
{
    private readonly innerIterable: Iterable<TInput>;
    private readonly mapping: (value: TInput) => TOutput;

    protected constructor(innerIterable: Iterable<TInput>, mapping: (value: TInput) => TOutput)
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerIterable, "innerIterable");
        Pre.condition.assertNotUndefinedAndNotNull(mapping, "mapping");

        this.innerIterable = innerIterable;
        this.mapping = mapping;
    }

    public static create<TInput,TOutput>(innerIterable: Iterable<TInput>, mapping: (value: TInput) => TOutput): MapIterable<TInput,TOutput>
    {
        return new MapIterable<TInput,TOutput>(innerIterable, mapping);
    }

    public iterate(): Iterator<TOutput>
    {
        return this.innerIterable.iterate().map(this.mapping);
    }

    public toArray(): TOutput[]
    {
        return Iterable.toArray(this);
    }

    public equals(right: Iterable<TOutput>, equalFunctions?: EqualFunctions): boolean
    {
        return Iterable.equals(this, right, equalFunctions);
    }

    public toString(): string
    {
        return Iterable.toString(this);
    }

    public map<TOutput2>(mapping: (value: TOutput) => TOutput2): MapIterable<TOutput, TOutput2>
    {
        return Iterable.map(this, mapping);
    }

    public where(condition: (value: TOutput) => boolean): Iterable<TOutput>
    {
        return Iterable.where(this, condition);
    }

    public instanceOf<TOutput2 extends TOutput>(typeOrTypeCheck: Type<TOutput2> | ((value: TOutput) => value is TOutput2)): Iterable<TOutput2>
    {
        return Iterable.instanceOf(this, typeOrTypeCheck);
    }

    public [Symbol.iterator](): JavascriptIterator<TOutput>
    {
        return Iterable[Symbol.iterator](this);
    }

    public any(): boolean
    {
        return this.innerIterable.any();
    }

    public getCount(): number
    {
        return this.innerIterable.getCount();
    }

    public first(): Result<TOutput>
    {
        return Iterable.first(this);
    }

    public last(): Result<TOutput>
    {
        return Iterable.last(this);
    }
}