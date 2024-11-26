import { JavascriptIterable } from "./javascript";
import { MutableCondition } from "./mutableCondition";
import { Type } from "./types";

/**
 * A collection of condition methods that can be used to assert the state of an application.
 */
export abstract class Condition
{
    protected constructor()
    {
    }

    /**
     * Create a new {@link MutableCondition} object.
     */
    public static create(): MutableCondition
    {
        return MutableCondition.create();
    }

    /**
     * Assert that the provided value is undefined.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public abstract assertUndefined(value: unknown, expression?: string, message?: string): asserts value is undefined;

    /**
     * Assert that the provided value is not undefined and not null.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public abstract assertNotUndefined<T>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>;

    /**
     * Assert that the provided value is not undefined and not null.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public abstract assertNotUndefinedAndNotNull<T>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>;

    /**
     * Assert that the provided value is true.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public abstract assertTrue(value: boolean, expression?: string, message?: string): asserts value is true;

    /**
     * Assert that the provided value is false.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public abstract assertFalse(value: boolean, expression?: string, message?: string): asserts value is false;

    /**
     * Assert that the provided actual value is the same as the provided expected value.
     * @param expected The expected value.
     * @param actual The actual value.
     * @param expression The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertSame<T>(expected: T, actual: T, expression?: string, message?: string): void;

    /**
     * Assert that the provided actual value is not the same as the provided expected value.
     * @param expected The expected value.
     * @param actual The actual value.
     * @param expression The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertNotSame<T>(expected: T, actual: T, expression?: string, message?: string): void;

    /**
     * Assert that the provided actual value is equal to the provided expected value.
     * @param expected The expected value.
     * @param actual The actual value.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertEqual<T>(expected: T, actual: T, expression?: string, message?: string): void;

    /**
     * Assert that the provided actual value is not equal to the provided expected value.
     * @param notExpected The not expected value.
     * @param actual The actual value.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertNotEqual<T>(notExpected: T, actual: T, expression?: string, message?: string): void;

    /**
     * Assert that the provided value is not empty.
     * @param value The value to check.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertNotEmpty(value: JavascriptIterable<unknown> | string | undefined | null, expression?: string, message?: string): void;

    /**
     * Assert that the provided value is less than the provided upperBound.
     * @param value The value to check.
     * @param upperBound The upperBound that the value must be less than.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertLessThan(value: number, upperBound: number, expression?: string, message?: string): void;

    /**
     * Assert that the provided value is less than or equal to the provided upperBound.
     * @param value The value to check.
     * @param upperBound The upperBound that the value must be less than.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertLessThanOrEqualTo(value: number, upperBound: number, expression?: string, message?: string): void;

    /**
     * Assert that the provided value is greater than or equal to the provided lowerBound.
     * @param value The value to check.
     * @param lowerBound The lowerBound that the value must be greater than or equal to.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertGreaterThanOrEqualTo(value: number, lowerBound: number, expression?: string, message?: string): void;

    /**
     * Assert that the provided value is greater than the provided lowerBound.
     * @param value The value to check.
     * @param lowerBound The lowerBound that the value must be greater than.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertGreaterThan(value: number, lowerBound: number, expression?: string, message?: string): void;

    /**
     * Assert that the value is greater than or equal to the lowerBound and less than or equal to
     * the upperBound.
     * @param lowerBound The lowerBound that the value must be greater than or equal to.
     * @param value The value to check.
     * @param upperBound The upperBound that the value must be less than or equal to.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertBetween(lowerBound: number, value: number, upperBound: number, expression?: string, message?: string): void;

    /**
     * Assert that the index is within the access bounds of an indexable with the provided count.
     * @param index The index to check.
     * @param count The number of elements in the indexable.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertAccessIndex(index: number, count: number, expression?: string, message?: string): void;

    /**
     * Assert that the index is within the insertion bounds of a {@link List} with the provided count.
     * @param index The index to check.
     * @param count The number of elements in the indexable.
     * @param expression  The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public abstract assertInsertIndex(index: number, count: number, expression?: string, message?: string): void;

    /**
     * Assert that the value is one of the possibilities.
     * @param possibilities The possible values that the value can be.
     * @param value The value to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public abstract assertOneOf<T>(possibilities: JavascriptIterable<T>, value: T, expression?: string, message?: string): void;

    /**
     * Assert that the value is within the bounds of a byte.
     * @param value The value to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public abstract assertByte(value: number, expression?: string, message?: string): void;

    /**
     * Assert that the value is an integer.
     * @param value The value to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public abstract assertInteger(value: number, expression?: string, message?: string): void;

    /**
     * Assert that the provided value is an instance of the provided {@link Type}.
     * @param value The value to check.
     * @param type The {@link Type} to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public abstract assertInstanceOf<T>(value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string): asserts value is T;
    /**
     * Assert that the provided value is an instance of the provided {@link Type}.
     * @param value The value to check.
     * @param type The {@link Type} to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public abstract assertInstanceOf<T>(parameters: { value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string }): void;
}