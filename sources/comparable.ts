import { Comparison } from "./comparison";
import { Pre } from "./pre";

/**
 * An type that can be compared against another type.
 */
export abstract class Comparable<T>
{
    protected constructor()
    {
    }

    /**
     * Compare this value against the provided value.
     * @param value The value to compare against.
     */
    public abstract compareTo(value: T): Comparison;

    /**
     * Get whether this value is less than the provided value.
     * @param value The value to compare against.
     */
    public lessThan(value: T): boolean
    {
        return Comparable.lessThan(this, value);
    }

    /**
     * Get whether the left value is less than the right value.
     * @param left The left value in the comparison.
     * @param right The right value in the comparison.
     */
    public static lessThan<T>(left: Comparable<T>, right: T): boolean
    {
        Pre.condition.assertNotUndefinedAndNotNull(left, "left");

        return left.compareTo(right) === Comparison.LessThan;
    }

    /**
     * Get whether this value equals the provided value.
     * @param value The value to compare against.
     */
    public equals(value: T): boolean
    {
        return Comparable.equals(this, value);
    }

    /**
     * Get whether the left value equals the right value.
     * @param left The left value in the comparison.
     * @param right The right value in the comparison.
     */
    public static equals<T>(left: Comparable<T>, right: T): boolean
    {
        Pre.condition.assertNotUndefinedAndNotNull(left, "left");

        return left.compareTo(right) === Comparison.Equal;
    }

    /**
     * Get whether this value is greater than the provided value.
     * @param value The value to compare against.
     */
    public greaterThan(value: T): boolean
    {
        return Comparable.greaterThan(this, value);
    }

    /**
     * Get whether the left value is greater than the right value.
     * @param left The left value in the comparison.
     * @param right The right value in the comparison.
     */
    public static greaterThan<T>(left: Comparable<T>, right: T): boolean
    {
        Pre.condition.assertNotUndefinedAndNotNull(left, "left");

        return left.compareTo(right) === Comparison.GreaterThan;
    }
}