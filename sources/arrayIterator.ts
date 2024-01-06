import { IndexableIteratorBase } from "./indexableIteratorBase";
import { Pre } from "./pre";

/**
 * An {@link Iterator} that iterates over the values in an {@link Array}.
 */
export class ArrayIterator<T> extends IndexableIteratorBase<T>
{
    private readonly values: T[];
    private currentIndex: number;
    private started: boolean;

    private constructor(values: T[])
    {
        super();

        this.values = values;
        this.currentIndex = 0;
        this.started = false;
    }

    public static create<T>(values: T[]): ArrayIterator<T>
    {
        Pre.condition.assertNotUndefinedAndNotNull(values, "values");

        return new ArrayIterator<T>(values);
    }

    public getCurrentIndex(): number
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.currentIndex;
    }

    public next(): boolean
    {
        if (!this.hasStarted())
        {
            this.started = true;
        }
        else if (this.hasCurrent())
        {
            this.currentIndex++;
        }
        return this.hasCurrent();
    }

    public hasStarted(): boolean
    {
        return this.started;
    }

    public hasCurrent(): boolean
    {
        return this.hasStarted() && this.currentIndex < this.values.length;
    }

    public getCurrent(): T
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.values[this.currentIndex];
    }
}