import { Pre } from "./condition";
import { IndexableIterator } from "./indexable";

export class ArrayIterator<T> extends IndexableIterator<T>
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

    public override getCurrentIndex(): number
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.currentIndex;
    }

    public override next(): boolean
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

    public override hasStarted(): boolean
    {
        return this.started;
    }

    public override hasCurrent(): boolean
    {
        return this.hasStarted() && this.currentIndex < this.values.length;
    }

    public override getCurrent(): T
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.values[this.currentIndex];
    }
}