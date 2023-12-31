import { Iterator } from "./iterator";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { JavascriptIterable, JavascriptIterator, JavascriptIteratorResult } from "./javascript";
import { MapIterator } from "./mapIterator";
import { Pre } from "./pre";
import { isJavascriptIterable } from "./types";

export class JavascriptIteratorToIteratorAdapter<T> implements Iterator<T>
{
    private readonly javascriptIterator: JavascriptIterator<T>;
    private javascriptIteratorResult?: JavascriptIteratorResult<T>;

    private constructor(javascriptIterator: JavascriptIterator<T>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(javascriptIterator, "javascriptIterator");

        this.javascriptIterator = javascriptIterator;
    }

    public static create<T>(javascriptIterator: JavascriptIterator<T> | JavascriptIterable<T>): JavascriptIteratorToIteratorAdapter<T>
    {
        if (isJavascriptIterable<T>(javascriptIterator))
        {
            javascriptIterator = javascriptIterator[Symbol.iterator]();
        }
        return new JavascriptIteratorToIteratorAdapter(javascriptIterator);
    }

    public next(): boolean
    {
        this.javascriptIteratorResult = this.javascriptIterator.next();
        return this.hasCurrent();
    }
    public hasStarted(): boolean
    {
        return this.javascriptIteratorResult !== undefined;
    }

    public hasCurrent(): boolean
    {
        return this.javascriptIteratorResult?.done === false;
    }

    public getCurrent(): T
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.javascriptIteratorResult!.value;
    }

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

    public [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<T>
    {
        return Iterator[Symbol.iterator](this);
    }
}