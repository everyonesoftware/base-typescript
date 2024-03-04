import { Iterator } from "./iterator";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { Pre } from "./pre";
import { Result } from "./result";

/**
 * An {@link Iterator} that maps {@link TInput} values to {@link TOutput} values.
 */
export class MapIterator<TInput,TOutput> implements Iterator<TOutput>
{
    private readonly inputIterator: Iterator<TInput>;
    private readonly mapping: (value: TInput) => TOutput;

    protected constructor(inputIterator: Iterator<TInput>, mapping: (value: TInput) => TOutput)
    {
        Pre.condition.assertNotUndefinedAndNotNull(inputIterator, "inputIterator");
        Pre.condition.assertNotUndefinedAndNotNull(mapping, "mapping");

        this.inputIterator = inputIterator;
        this.mapping = mapping;
    }

    public static create<TInput,TOutput>(inputIterator: Iterator<TInput>, mapping: (value: TInput) => TOutput): MapIterator<TInput,TOutput>
    {
        return new MapIterator(inputIterator, mapping);
    }

    public next(): boolean
    {
        return this.inputIterator.next();
    }

    public hasStarted(): boolean
    {
        return this.inputIterator.hasStarted();
    }

    public hasCurrent(): boolean
    {
        return this.inputIterator.hasCurrent();
    }

    public getCurrent(): TOutput
    {
        return this.mapping(this.inputIterator.getCurrent());
    }

    public start(): this
    {
        return Iterator.start<TOutput,this>(this);
    }

    public takeCurrent(): TOutput
    {
        return Iterator.takeCurrent(this);
    }

    public toArray(): TOutput[]
    {
        return Iterator.toArray(this);
    }

    public map<TOutput2>(mapping: (value: TOutput) => TOutput2): MapIterator<TOutput, TOutput2>
    {
        return Iterator.map(this, mapping);
    }

    public [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<TOutput>
    {
        return Iterator[Symbol.iterator](this);
    }

    public first(): Result<TOutput>
    {
        return Iterator.first(this);
    }

    public where(condition: (value: TOutput) => boolean): Iterator<TOutput>
    {
        return Iterator.where(this, condition);
    }
}