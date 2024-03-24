import { Comparison } from "./comparison";

/**
 * A type that can be used to compare values.
 */
export abstract class Comparer<TLeft, TRight = TLeft>
{
    /**
     * Compare the two provided values.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public abstract compare(left: TLeft, right: TRight): Comparison;

    /**
     * Get whether the left value is less than the right value.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public lessThan(left: TLeft, right: TRight): boolean
    {
        return this.compare(left, right) === Comparison.LessThan;
    }

    /**
     * Get whether the left value is less than or equal to the right value.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public lessThanOrEqual(left: TLeft, right: TRight): boolean
    {
        return this.compare(left, right) !== Comparison.GreaterThan;
    }

    /**
     * Get whether the left value equals the right value.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public equal(left: TLeft, right: TRight): boolean
    {
        return this.compare(left, right) === Comparison.Equal;
    }

    /**
     * Get whether the left value is greater than or equal to the right value.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public greaterThanOrEqualTo(left: TLeft, right: TRight): boolean
    {
        return this.compare(left, right) !== Comparison.LessThan;
    }

    /**
     * Get whether the left value is greater than the right value.
     * @param left The left value to compare.
     * @param right The right value to compare.
     */
    public greaterThan(left: TLeft, right: TRight): boolean
    {
        return this.compare(left, right) === Comparison.GreaterThan;
    }

    public static compareSameUndefinedNull<TLeft, TRight>(left: TLeft | undefined | null, right: TRight | undefined | null): Comparison | undefined
    {
        let result: Comparison | undefined = undefined;
        if (left === right)
        {
            result = Comparison.Equal;
        }
        else if (left === undefined)
        {
            result = Comparison.LessThan;
        }
        else if (right === undefined)
        {
            result = Comparison.GreaterThan;
        }
        else if (left === null)
        {
            result = Comparison.LessThan;
        }
        else if (right === null)
        {
            result = Comparison.GreaterThan;
        }
        return result;
    }
}