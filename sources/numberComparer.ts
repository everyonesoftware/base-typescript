import { Comparer } from "./comparer";
import { Comparison } from "./comparison";

/**
 * A {@link Comparer} that compares {@link number}s.
 */
export class NumberComparer extends Comparer<number>
{
    protected constructor()
    {
        super();
    }

    public static create(): NumberComparer
    {
        return new NumberComparer();
    }

    public override compare(left: number, right: number): Comparison
    {
        return NumberComparer.compare(left, right);
    }

    public static compare(left: number, right: number): Comparison
    {
        let result: Comparison | undefined = Comparer.compareSameUndefinedNull(left, right);
        if (result === undefined)
        {
            result = (left < right ? Comparison.LessThan : Comparison.GreaterThan);
        }
        return result;
    }
}