import { Indexable } from "./indexable";
import { IndexableIterator } from "./indexableIterator";
import { Iterable } from "./iterable";
import { Iterator } from "./iterator";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { List } from "./list";
import { MapIterable } from "./mapIterable";
import { Pre } from "./pre";
import { Result } from "./result";
import { isIterable } from "./types";

/**
 * An expandable {@link List} of bytes.
 */
export class ByteList implements List<number>
{
    private values: Uint8Array;
    private count: number;

    private constructor(initialCapacity: number)
    {
        Pre.condition.assertGreaterThanOrEqualTo(initialCapacity, 0, "initialCapacity");

        this.values = new Uint8Array(initialCapacity);
        this.count = 0;
    }

    public static create(values?: JavascriptIterable<number>): ByteList
    {
        let result: ByteList;
        if (isIterable(values))
        {
            result = new ByteList(values.getCount()).addAll(values);
        }
        else
        {
            result = new ByteList(0);
            if (values)
            {
                result.addAll(values);
            }
        }
        return result;
    }

    public set(index: number, value: number): this
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");
        Pre.condition.assertByte(value, "value");

        this.values[index] = value;

        return this;
    }

    public iterate(): IndexableIterator<number>
    {
        return IndexableIterator.create(Iterator.create(this.values).take(this.count));
    }

    public getCount(): number
    {
        return this.count;
    }

    public getCapacity(): number
    {
        return this.values.length;
    }

    public get(index: number): number
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");

        return this.values[index];
    }

    public insert(index: number, value: number): this
    {
        Pre.condition.assertInsertIndex(index, this.getCount(), "index");
        Pre.condition.assertByte(value, "value");

        const currentCapacity: number = this.getCapacity();
        const currentCount: number = this.getCount();
        if (currentCapacity === currentCount)
        {
            const newCapacity: number = currentCapacity === 0 ? 1 : currentCapacity * 2;
            const newValues: Uint8Array = new Uint8Array(newCapacity);
            if (0 < index)
            {
                newValues.set(this.values.slice(0, index), 0);
            }
            newValues[index] = value;
            if (index < currentCount)
            {
                newValues.set(this.values.slice(index), index + 1);
            }
            this.values = newValues;
        }
        else
        {
            if (index < currentCount)
            {
                this.values.copyWithin(index + 1, index);
            }
            this.values[index] = value;
        }
        this.count++;

        return this;
    }

    public toArray(): number[]
    {
        return Iterable.toArray(this);
    }

    public toString(): string
    {
        return Iterable.toString(this);
    }

    public map<TOutput>(mapping: (value: number) => TOutput): MapIterable<number, TOutput>
    {
        return Iterable.map(this, mapping);
    }

    public any(): boolean
    {
        return this.count > 0;
    }

    public first(): Result<number>
    {
        return Indexable.first(this);
    }
    public add(value: number): this
    {
        return List.add(this, value);
    }

    public addAll(values: JavascriptIterable<number>): this
    {
        return List.addAll(this, values);
    }

    public insertAll(index: number, values: JavascriptIterable<number>): this
    {
        return List.insertAll(this, index, values);
    }

    public [Symbol.iterator](): JavascriptIterator<number>
    {
        return Iterable[Symbol.iterator](this);
    }
}