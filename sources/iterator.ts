import { Pre } from "./condition";
import { JavascriptIterable } from "./iterable";

/**
 * The interface that is returned by a {@link JavascriptIterator}.
 */
export interface JavascriptIteratorResult<T>
{
    /**
     * Whether the {@link JavascriptIterator} is done.
     */
    done: boolean;
    /**
     * The current value the {@link JavascriptIterator} points at.
     */
    value: T;
}

/**
 * A JavaScript/TypeScript object that is used to iterate over a collection of values.
 */
export interface JavascriptIterator<T>
{
    /**
     * Move to the next value in the collection.
     */
    next(): JavascriptIteratorResult<T>;
}

export class JavascriptIteratorAdapter<T> implements JavascriptIterator<T>
{
    private readonly iterator: Iterator<T>;

    private constructor(iterator: Iterator<T>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");

        this.iterator = iterator;
    }

    public static create<T>(iterator: Iterator<T>): JavascriptIteratorAdapter<T>
    {
        return new JavascriptIteratorAdapter<T>(iterator);
    }
    
    public next(): JavascriptIteratorResult<T>
    {
        const result: JavascriptIteratorResult<T> = {
            done: !this.iterator.next(),
            value: undefined!,
        };
        if (!result.done)
        {
            result.value = this.iterator.getCurrent();
        }
        return result;
    }
}

/**
 * A type that can be used to iterate over a collection.
 */
export abstract class Iterator<T> implements JavascriptIterable<T>
{
    /**
     * Move to the next value in the collection. Return whether this {@link Iterator} points to a
     * value after the move.
     */
    public abstract next(): boolean;

    /**
     * Get whether this {@link Iterator} has started iterating over the values in the collection.
     */
    public abstract hasStarted(): boolean;

    /**
     * Get whether this {@link Iterator} currently points at a value in the collection.
     */
    public abstract hasCurrent(): boolean;

    /**
     * Get the value that this {@link Iterator} points to.
     */
    public abstract getCurrent(): T;

    /**
     * Move to the first value if this {@link Iterator} hasn't started yet.
     * @returns This object for method chaining.
     */
    public start(): this
    {
        if (!this.hasStarted())
        {
            this.next();
        }
        return this;
    }

    /**
     * Get the current value from this {@link Iterator} and advance this {@link Iterator} to the
     * next value.
     */
    public takeCurrent(): T
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        const result: T = this.getCurrent();
        this.next();

        return result;
    }

    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return JavascriptIteratorAdapter.create(this);
    }
    
}