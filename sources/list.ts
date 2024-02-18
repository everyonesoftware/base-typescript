import { JavascriptArrayList } from "./javascriptArrayList";
import { IndexableIterator } from "./indexableIterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { MapIterable } from "./mapIterable";
import { MutableIndexable } from "./mutableIndexable";
import { Pre } from "./pre";
import { Result } from "./result";

export abstract class List<T> implements MutableIndexable<T>
{
    public static create<T>(values?: JavascriptIterable<T>): List<T>
    {
        return JavascriptArrayList.create(values);
    }

    public abstract iterate(): IndexableIterator<T>;

    public abstract toArray(): T[];

    public abstract toString(): string;

    public abstract map<TOutput>(mapping: (value: T) => TOutput): MapIterable<T, TOutput>;

    public abstract getCount(): number;

    public abstract first(): Result<T>;

    public abstract get(index: number): T;

    public abstract set(index: number, value: T): this;

    public abstract [Symbol.iterator](): JavascriptIterator<T>;

    /**
     * Add the provided value to the end of this {@link List}.
     * @param value The value to add.
     */
    public abstract add(value: T): this;

    /**
     * Add the provided value to the provided {@link List}.
     * @param list The {@link List} to add the value to.
     * @param value The value to add.
     */
    public static add<T,TList extends List<T>>(list: TList, value: T): TList
    {
        Pre.condition.assertNotUndefinedAndNotNull(list, "list");
        
        return list.insert(list.getCount(), value);
    }

    /**
     * Add the provided values to the end of this {@link List}.
     * @param values The values to add.
     */
    public abstract addAll(values: JavascriptIterable<T>): this;

    /**
     * Add the provided values to the end of the provided {@link List}.
     * @param list The {@link List} to add the values to.
     * @param values The values to add.
     */
    public static addAll<T,TList extends List<T>>(list: TList, values: JavascriptIterable<T>): TList
    {
        Pre.condition.assertNotUndefinedAndNotNull(list, "list");
        Pre.condition.assertNotUndefinedAndNotNull(values, "values");

        return list.insertAll(list.getCount(), values);
    }

    /**
     * Insert the value at the index in this {@link List}.
     * @param index The index to insert the value at.
     * @param value The value to insert.
     */
    public abstract insert(index: number, value: T): this;

    /**
     * Insert the values at the index in this {@link List}.
     * @param index The index to insert the values at.
     * @param values The values to insert.
     */
    public abstract insertAll(index: number, values: JavascriptIterable<T>): this;

    /**
     * Insert the values at the index in this {@link List}.
     * @param list The list to insert the values into.
     * @param index The index to insert the values at.
     * @param values The values to insert.
     */
    public static insertAll<T,TList extends List<T>>(list: TList, index: number, values: JavascriptIterable<T>): TList
    {
        Pre.condition.assertNotUndefinedAndNotNull(list, "list");
        Pre.condition.assertInsertIndex(index, list.getCount(), "index");
        Pre.condition.assertNotUndefinedAndNotNull(values, "values");

        let insertIndex: number = index;
        for (const value of values)
        {
            list.insert(insertIndex, value);
            insertIndex++;
        }
        return list;
    }
}