import { IndexableIterator } from "./indexableIterator";
import { IteratorBase } from "./iteratorBase";

export abstract class IndexableIteratorBase<T> extends IteratorBase<T> implements IndexableIterator<T>
{
    public abstract getCurrentIndex(): number;
}