import { Iterator } from "./iterator";
import { IteratorToJavascriptIteratorAdapter } from "./iteratorToJavascriptIteratorAdapter";
import { MapIterator } from "./mapIterator";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type } from "./types";

export abstract class IteratorDecorator<T> implements Iterator<T>
{
    private readonly innerIterator: Iterator<T>;
    private started: boolean;

    protected constructor(innerIterator: Iterator<T>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerIterator, "innerIterator");

        this.innerIterator = innerIterator;
        this.started = false;
    }

    public next(): boolean
    {
        if (!this.hasStarted())
        {
            this.started = true;
            this.innerIterator.start();
        }
        else
        {
            this.innerIterator.next();
        }
        return this.hasCurrent();
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.hasStarted() && this.innerIterator.hasCurrent();
    }

    public getCurrent(): T
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.innerIterator.getCurrent();
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

    public where(condition: (value: T) => boolean): Iterator<T>
    {
        return Iterator.where(this, condition);
    }

    public instanceOf<U extends T>(type: Type<U>): Iterator<U>
    {
        return Iterator.instanceOf(this, type);
    }

    public map<TOutput>(mapping: (value: T) => TOutput): MapIterator<T, TOutput>
    {
        return Iterator.map(this, mapping);
    }

    public first(): Result<T>
    {
        return Iterator.first(this);
    }

    public [Symbol.iterator](): IteratorToJavascriptIteratorAdapter<T>
    {
        return Iterator[Symbol.iterator](this);
    }
}