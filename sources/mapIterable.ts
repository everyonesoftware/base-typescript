import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterator } from "./javascript";
import { Pre } from "./pre";

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

    public toString(): string
    {
        return Iterable.toString(this);
    }

    public map<TOutput2>(mapping: (value: TOutput) => TOutput2): MapIterable<TOutput, TOutput2>
    {
        return Iterable.map(this, mapping);
    }

    public [Symbol.iterator](): JavascriptIterator<TOutput>
    {
        return Iterable[Symbol.iterator](this);
    }
}