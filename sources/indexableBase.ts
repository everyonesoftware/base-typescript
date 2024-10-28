import { Indexable } from "./indexable";
import { IndexableIterator } from "./indexableIterator";
import { IterableBase } from "./iterableBase";
import { Result } from "./result";

/**
 * The abstract base class for the {@link Indexable} type.
 */
export abstract class IndexableBase<T> extends IterableBase<T> implements Indexable<T>
{
    public abstract override iterate(): IndexableIterator<T>;

    public abstract override any(): boolean;

    public abstract override getCount(): number;

    public abstract get(index: number): T;

    public override first(): Result<T>
    {
        return Indexable.first(this);
    }

    public override last(): Result<T>
    {
        return Indexable.last(this);
    }
}