import { IndexableIterator } from "./indexableIterator";
import { IteratorDecorator } from "./iteratorDecorator";
import { Iterator } from "./iterator";
import { Pre } from "./pre";

/**
 * An {@link IteratorDecorator} that keeps track of which index the inner
 * {@link Iterator} is referencing.
 */
export class IndexableIteratorDecorator<T> extends IteratorDecorator<T> implements IndexableIterator<T>
{
    private currentIndex: number;

    private constructor(innerIterator: Iterator<T>)
    {
        super(innerIterator);

        this.currentIndex = -1;
    }

    /**
     * Create a new {@link IndexableIteratorDecorator} that wraps around the provided
     * {@link Iterator}.
     * @param innerIterator The inner {@link Iterator} to wrap around.
     */
    public static create<T>(innerIterator: Iterator<T>)
    {
        return new IndexableIteratorDecorator<T>(innerIterator);
    }

    public override next(): boolean
    {
        const result: boolean = super.next();
        if (result)
        {
            this.currentIndex++;
        }
        return result;
    }

    public getCurrentIndex(): number
    {
        Pre.condition.assertTrue(this.hasStarted(), "this.hasStarted()");
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.currentIndex;
    }
}