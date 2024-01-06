import { Iterator } from "./iterator";
import { JavascriptIteratorAdapter } from "./javascriptIteratorAdapter";
import { MapIterator } from "./mapIterator";

export abstract class IteratorBase<T> implements Iterator<T>
{
    public abstract next(): boolean;

    public abstract hasStarted(): boolean;

    public abstract hasCurrent(): boolean;

    public abstract getCurrent(): T;

    public start(): this
    {
        return Iterator.start<T,this>(this);
    }

    public takeCurrent(): T
    {
        return Iterator.takeCurrent(this);
    }

    public toArray(): T[]
    {
        return Iterator.toArray(this);
    }

    public map<TOutput>(mapping: (value: T) => TOutput): MapIterator<T, TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public [Symbol.iterator](): JavascriptIteratorAdapter<T>
    {
        return Iterator[Symbol.iterator](this);
    }
}