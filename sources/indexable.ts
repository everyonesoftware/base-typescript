import { Iterable } from "./iterable";
import { Iterator } from "./iterator";

/**
 * An {@link Iterator} that maintains the current index of the value being pointed at in the
 * collection.
 */
export abstract class IndexableIterator<T> extends Iterator<T>
{
    /**
     * Get the current index of the value this {@link IndexableIterator} points to.
     */
    public abstract getCurrentIndex(): number;
}

/**
 * An object that can access its elements by index.
 */
export abstract class Indexable<T> extends Iterable<T>
{
    /**
     * Get the number of values in this {@link Indexable}.
     */
    public abstract getCount(): number;

    /**
     * Get the value at the provided index.
     * @param index The index of the value to return.
     */
    public abstract get(index: number): T;

    /**
     * Iterate over the values in this {@link Indexable}.
     */
    public abstract override iterate(): IndexableIterator<T>;
}

/**
 * An object that can modify its elements by index.
 */
export abstract class MutableIndexable<T> extends Indexable<T>
{
    /**
     * Set the value at the provided index.
     * @param index The index of the value to set.
     * @param value The value to set at the provided index.
     */
    public abstract set(index: number, value: T): this;
}