import { Indexable } from "./indexable";
import { IndexableIterator } from "./indexableIterator";
import { IterableBase } from "./iterableBase";

/**
 * The abstract base class for the {@link Indexable} type.
 */
export abstract class IndexableBase<T> extends IterableBase<T> implements Indexable<T>
{
    public abstract override iterate(): IndexableIterator<T>;

    public abstract getCount(): number;

    public abstract get(index: number): T;
}