import { IndexableIteratorDecorator } from "./indexableIteratorDecorator";
import { Iterator } from "./iterator";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterator } from "./mapIterator";
import { Result } from "./result";
import { Type } from "./types";

/**
 * An {@link Iterator} that maintains the current index of the value being pointed at in the
 * collection.
 */
export abstract class IndexableIterator<T> implements Iterator<T>
{
    /**
     * Create a new {@link IndexableIterator} that contains the provided values.
     * @param values The values that the new {@link IndexableIterator} will iterate over.
     */
    public static create<T>(values: JavascriptIterator<T> | JavascriptIterable<T>): IndexableIterator<T>
    {
        return IndexableIteratorDecorator.create(Iterator.create(values));
    }

    public abstract next(): boolean;

    public abstract hasStarted(): boolean;

    public abstract hasCurrent(): boolean;

    public abstract getCurrent(): T;

    public abstract start(): this;

    public abstract takeCurrent(): T;

    public abstract any(): boolean;

    public abstract getCount(): number;

    public abstract toArray(): T[];

    public abstract map<TOutput>(mapping: (value: T) => TOutput): MapIterator<T, TOutput>;

    public abstract [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<T>;

    /**
     * Get the current index of the value this {@link IndexableIterator} points to.
     */
    public abstract getCurrentIndex(): number;

    public abstract first(): Result<T>;

    public abstract last(): Result<T>;

    public abstract where(condition: (value: T) => boolean): Iterator<T>;

    public abstract whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): Iterator<U>;

    public abstract whereInstanceOfType<U extends T>(type: Type<U>): Iterator<U>;

    public abstract take(maximumToTake: number): Iterator<T>;

    public abstract skip(maximumToSkip: number): Iterator<T>;
}