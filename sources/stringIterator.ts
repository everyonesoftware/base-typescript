import { IndexableIteratorBase } from "./indexableIteratorBase";
import { Iterator } from "./iterator";
import { Pre } from "./pre";

/**
 * An {@link Iterator} that iterates over the characters in a {@link string}.
 */
export class StringIterator extends IndexableIteratorBase<string>
{
    private readonly value: string;
    private currentIndex: number;
    private started: boolean;

    public constructor(value: string)
    {
        super();

        this.value = value;
        this.currentIndex = 0;
        this.started = false;
    }

    public static create(value: string): StringIterator
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        return new StringIterator(value);
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
        return this.hasStarted() && this.currentIndex < this.value.length;
    }

    public override getCurrent(): string
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.value[this.currentIndex];
    }
}