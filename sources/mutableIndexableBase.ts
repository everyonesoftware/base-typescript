import { IndexableBase } from "./indexableBase";
import { MutableIndexable } from "./mutableIndexable";

export abstract class MutableIndexableBase<T> extends IndexableBase<T> implements MutableIndexable<T>
{
    public abstract set(index: number, value: T): this;

    public override any(): boolean
    {
        return this.getCount() > 0;
    }
}