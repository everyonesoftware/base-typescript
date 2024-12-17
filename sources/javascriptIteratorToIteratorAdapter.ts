import { Iterator } from "./iterator";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { JavascriptIterable, JavascriptIterator, JavascriptIteratorResult } from "./javascript";
import { MapIterator } from "./mapIterator";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type, isJavascriptIterable } from "./types";

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

    public any(): boolean
    {
        return Iterator.any(this);
    }

    public getCount(): number
    {
        return Iterator.getCount(this);
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

    public first(condition?: (value: T) => boolean): Result<T>
    {
        return Iterator.first(this, condition);
    }

    public last(): Result<T>
    {
        return Iterator.last(this);
    }

    public where(condition: (value: T) => boolean): Iterator<T>
    {
        return Iterator.where(this, condition);
    }

    public whereInstanceOf<U extends T>(typeCheck: (value: T) => value is U): Iterator<U>
    {
        return Iterator.whereInstanceOf(this, typeCheck);
    }

    public whereInstanceOfType<U extends T>(type: Type<U>): Iterator<U>
    {
        return Iterator.whereInstanceOfType(this, type);
    }

    public take(maximumToTake: number): Iterator<T>
    {
        return Iterator.take(this, maximumToTake);
    }

    public skip(maximumToSkip: number): Iterator<T>
    {
        return Iterator.skip(this, maximumToSkip);
    }
}