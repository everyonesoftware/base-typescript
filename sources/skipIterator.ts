import { Iterator } from "./iterator";
import { IteratorDecorator } from "./iteratorDecorator";
import { Pre } from "./pre";

/**
 * An {@link Iterator} that skips the first maximum number of values from an inner {@link Iterator}
 * before beginning to return values.
 */
export class SkipIterator<T> extends IteratorDecorator<T>
{
    private readonly maximumToSkip: number;

    private constructor(innerIterator: Iterator<T>, maximumToSkip: number)
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerIterator, "innerIterator");
        Pre.condition.assertNotUndefinedAndNotNull(maximumToSkip, "maximumToSkip");
        Pre.condition.assertInteger(maximumToSkip, "maximumToSkip");
        Pre.condition.assertGreaterThanOrEqualTo(maximumToSkip, 0, "maximumToSkip");

        super(innerIterator);

        this.maximumToSkip = maximumToSkip;
    }

    public static create<T>(innerIterator: Iterator<T>, maximumToSkip: number)
    {
        return new SkipIterator(innerIterator, maximumToSkip);
    }

    public override next(): boolean
    {
        if (!this.hasStarted())
        {
            for (let i = 0; i < this.maximumToSkip; i++)
            {
                if (!super.next())
                {
                    break;
                }
            }
        }
        return super.next();
    }
}