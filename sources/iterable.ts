import { Iterator, JavascriptIterator, JavascriptIteratorAdapter } from "./iterator";

/**
 * The JavaScript/TypeScript interface for types that can be iterated over in a for...of loop.
 */
export interface JavascriptIterable<T>
{
    /**
     * The iterator function that gets called when this object is passed into a for-of loop.
     */
    [Symbol.iterator](): JavascriptIterator<T>;
}

/**
 * An object that can be iterated over.
 */
export abstract class Iterable<T> implements JavascriptIterable<T>
{
    public [Symbol.iterator](): JavascriptIterator<T>
    {
        return JavascriptIteratorAdapter.create(this.iterate());
    }

    /**
     * Iterate over the values in this {@link Iterable}.
     */
    public abstract iterate(): Iterator<T>;

    public toArray(): T[]
    {
        const result: T[] = [];
        for (const value of this)
        {
            result.push(value);
        }
        return result;
    }

    public toString(): string
    {
        return JSON.stringify(this.toArray());
    }
}