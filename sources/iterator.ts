import { Pre } from "./condition";

/**
 * A type that can be used to iterate over a collection.
 */
export abstract class Iterator<T>
{
    /**
     * Move to the next value in the collection. Return whether this {@link Iterator} points to a
     * value after the move.
     */
    public abstract next(): boolean;

    /**
     * Get whether this {@link Iterator} has started iterating over the values in the collection.
     */
    public abstract hasStarted(): boolean;

    /**
     * Get whether this {@link Iterator} currently points at a value in the collection.
     */
    public abstract hasCurrent(): boolean;

    /**
     * Get the value that this {@link Iterator} points to.
     */
    public abstract getCurrent(): T;

    /**
     * Move to the first value if this {@link Iterator} hasn't started yet.
     * @returns This object for method chaining.
     */
    public start(): this
    {
        if (!this.hasStarted())
        {
            this.next();
        }
        return this;
    }

    /**
     * Get the current value from this {@link Iterator} and advance this {@link Iterator} to the
     * next value.
     */
    public takeCurrent(): T
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        const result: T = this.getCurrent();
        this.next();

        return result;
    }
}

/**
 * An {@link Iterator} that maintains the current index of the value being pointed at in the
 * collection.
 */
export abstract class IndexableIterator<T> extends Iterator<T>
{
    /**
     * Get the current index of the value this {@link IndexableIterator} points to.
     */
    public abstract getCurrentIndex(): number;
}

/**
 * An {@link Iterator} that iterates over the characters in a {@link string}.
 */
export class StringIterator extends IndexableIterator<string>
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