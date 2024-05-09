import { Iterator } from "./iterator";
import { IteratorDecorator } from "./iteratorDecorator";
import { Pre } from "./pre";

/**
 * An {@link Iterator} that iterates over a maximum number of values.
 */
export class TakeIterator<T> extends IteratorDecorator<T>
{
    private readonly maximumToTake: number;
    private taken: number;

    private constructor(innerIterator: Iterator<T>, maximumToTake: number)
    {
        Pre.condition.assertGreaterThanOrEqualTo(maximumToTake, 0, "maximumToTake");

        super(innerIterator);

        this.maximumToTake = maximumToTake;
        this.taken = 0;
    }

    public static create<T>(innerIterator: Iterator<T>, maximumToTake: number)
    {
        return new TakeIterator(innerIterator, maximumToTake);
    }

    public override hasCurrent(): boolean
    {
        return this.taken <= this.maximumToTake && super.hasCurrent();
    }

    public override next(): boolean
    {
        let result: boolean = false;
        if (this.taken <= this.maximumToTake)
        {
            result = super.next();
            if (result)
            {
                this.taken++;
            }
        }
        return result;
    }
}