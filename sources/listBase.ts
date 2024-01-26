import { IndexableIterator } from "./indexableIterator";
import { JavascriptIterable } from "./javascript";
import { List } from "./list";
import { MutableIndexableBase } from "./mutableIndexableBase";

export abstract class ListBase<T> extends MutableIndexableBase<T> implements List<T>
{
    protected constructor()
    {
        super();
    }

    public abstract override set(index: number, value: T): this;

    public abstract override iterate(): IndexableIterator<T>;

    public abstract override getCount(): number;

    public abstract override get(index: number): T;

    public add(value: T): this
    {
        return List.add(this, value);
    }

    public addAll(values: JavascriptIterable<T>): this
    {
        return List.addAll(this, values);
    }

    public abstract insert(index: number, value: T): this;

    public insertAll(index: number, values: JavascriptIterable<T>): this
    {
        return List.insertAll(this, index, values);
    }
}