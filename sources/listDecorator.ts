import { IndexableIterator } from "./indexableIterator";
import { JavascriptIterable } from "./javascript";
import { List } from "./list";
import { ListBase } from "./listBase";
import { Pre } from "./pre";

/**
 * A type that wraps around another {@link List}.
 */
export abstract class ListDecorator<T> extends ListBase<T>
{
    private readonly innerList: List<T>;

    protected constructor(innerList: List<T>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerList, "innerList");

        super();

        this.innerList = innerList;
    }

    public override set(index: number, value: T): this
    {
        this.innerList.set(index, value);

        return this;
    }

    public override iterate(): IndexableIterator<T>
    {
        return this.innerList.iterate();
    }

    public override any(): boolean
    {
        return this.innerList.any();
    }

    public override getCount(): number
    {
        return this.innerList.getCount();
    }

    public override get(index: number): T
    {
        return this.innerList.get(index);
    }

    public override insert(index: number, value: T): this
    {
        this.innerList.insert(index, value);

        return this;
    }

    public override insertAll(index: number, values: JavascriptIterable<T>): this
    {
        this.innerList.insertAll(index, values);

        return this;
    }
}