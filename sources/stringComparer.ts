import { Comparer } from "./comparer";
import { Comparison } from "./comparison";

/**
 * A {@link Comparer} that performs {@link string} comparisons.
 */
export class StringComparer extends Comparer<string>
{
    protected constructor()
    {
        super();
    }

    public static create(): StringComparer
    {
        return new StringComparer();
    }

    public override compare(left: string, right: string): Comparison
    {
        let result: Comparison | undefined = Comparer.compareSameUndefinedNull(left, right);
        if (result === undefined)
        {
            result = (left < right ? Comparison.LessThan : Comparison.GreaterThan);
        }
        return result;
    }
}