import { ArrayIterator } from "./arrayIterator";
import { Iterator } from "./iterator";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { MapIterator } from "./mapIterator";
import { Result } from "./result";
import { Type } from "./types";

/**
 * An {@link Iterator} that maintains the current index of the value being pointed at in the
 * collection.
 */
export abstract class IndexableIterator<T> implements Iterator<T>
{
    public static create<T>(values: T[]): IndexableIterator<T>
    {
        return ArrayIterator.create(values);
    }

    public abstract next(): boolean;

    public abstract hasStarted(): boolean;

    public abstract hasCurrent(): boolean;

    public abstract getCurrent(): T;

    public abstract start(): this;

    public abstract takeCurrent(): T;

    public abstract toArray(): T[];

    public abstract map<TOutput>(mapping: (value: T) => TOutput): MapIterator<T, TOutput>;

    public abstract [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<T>;

    /**
     * Get the current index of the value this {@link IndexableIterator} points to.
     */
    public abstract getCurrentIndex(): number;

    public abstract first(): Result<T>;

    public abstract where(condition: (value: T) => boolean): Iterator<T>;

    public abstract instanceOf<U extends T>(type: Type<U>): Iterator<U>;
}