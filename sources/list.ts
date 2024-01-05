import { ArrayIterator } from "./arrayIterator";
import { Pre } from "./condition";
import { IndexableIterator, MutableIndexable } from "./indexable";
import { Iterable } from "./iterable";
import { isArray } from "./types";

export class List<T> extends MutableIndexable<T>
{
    private readonly values: T[];

    private constructor()
    {
        super();

        this.values = [];
    }

    public static create<T>(values?: T[] | Iterable<T>): List<T>
    {
        const result = new List<T>();
        if (values !== undefined)
        {
            result.addAll(values);
        }
        return result;
    }

    public override getCount(): number
    {
        return this.values.length;
    }

    public override set(index: number, value: T): this
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");
        
        this.values[index] = value;

        return this;
    }

    public override get(index: number): T
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");

        return this.values[index];
    }

    public override iterate(): IndexableIterator<T>
    {
        return ArrayIterator.create(this.values);
    }

    public add(value: T): this
    {
        this.values.push(value);
        return this;
    }

    public addAll(values: T[] | Iterable<T>): this
    {
        for (const value of values)
        {
            this.add(value);
        }
        return this;
    }

    public insert(index: number, value: T): this
    {
        Pre.condition.assertInsertIndex(index, this.getCount(), "index");

        this.values.splice(index, 0, value);
        return this;
    }

    public insertAll(index: number, values: T[] | Iterable<T>): this
    {
        Pre.condition.assertInsertIndex(index, this.getCount(), "index");

        if (!isArray(values))
        {
            values = values.toArray();
        }
        this.values.splice(index, 0, ...values);
        return this;
    }
}