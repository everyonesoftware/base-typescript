import { Pre } from "./pre";

/**
 * A type that can be used to make assertions during a test.
 */
export abstract class Test
{
    /**
     * Fail the current test with the provided message.
     * @param message The message that explains why this test failed.
     */
    public abstract fail(message?: string): void;

    /**
     * Assert that the provided value is undefined;
     * @param value The value to check.
     */
    public assertUndefined(value: unknown): asserts value is undefined
    {
        Test.assertUndefined(this, value);
    }

    /**
     * Assert that the provided value is undefined.
     * @param test The current {@link Test}.
     * @param value The value to check.
     */
    public static assertUndefined(test: Test, value: unknown): asserts value is undefined
    {
        test.assertSame(value, undefined);
    }

    /**
     * Assert that the provided value is not undefined;
     * @param value The value to check.
     */
    public assertNotUndefined<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotUndefined(this, value);
    }

    /**
     * Assert that the provided value is not undefined.
     * @param test The current {@link Test}.
     * @param value The value to check.
     */
    public static assertNotUndefined<T>(test: Test, value: unknown): asserts value is NonNullable<T>
    {
        test.assertNotSame(value, undefined);
    }

    /**
     * Assert that the provided value is null.
     * @param value The value to check.
     */
    public assertNull(value: unknown): asserts value is null
    {
        Test.assertNull(this, value);
    }

    /**
     * Assert that the provided value is null.
     * @param value The value to check.
     */
    public static assertNull(test: Test, value: unknown): asserts value is null
    {
        test.assertSame(value, null);
    }

    /**
     * Assert that the provided value is not null.
     * @param value The value to check.
     */
    public assertNotNull<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNull(this, value);
    }

    /**
     * Assert that the provided value is not null.
     * @param value The value to check.
     */
    public static assertNotNull<T>(test: Test, value: T): asserts value is NonNullable<T>
    {
        test.assertNotSame(value, null);
    }

    /**
     * Assert that the provided value is not undefined and not null.
     * @param value The value to check.
     */
    public assertNotUndefinedAndNotNull<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotUndefinedAndNotNull(this, value);
    }

    /**
     * Assert that the provided value is not undefined and not null.
     * @param value The value to check.
     */
    public static assertNotUndefinedAndNotNull<T>(test: Test, value: T): asserts value is NonNullable<T>
    {
        test.assertNotSame(value, null);
        test.assertNotSame(value, undefined);
    }

    /**
     * Assert that the provided values point to the same object.
     * @param left The first value.
     * @param right The second value.
     */
    public abstract assertSame<T>(left: T, right: T): void;

    /**
     * Assert that the provided values don't point to the same object.
     * @param left The first value.
     * @param right The second value.
     */
    public abstract assertNotSame<T>(left: T, right: T): void;

    /**
     * Assert that the provided values are equal.
     * @param left The first value.
     * @param right The second value.
     */
    public abstract assertEqual<T>(left: T, right: T): void;

    /**
     * Assert that the provided values are not equal.
     * @param left The first value.
     * @param right The second value.
     */
    public abstract assertNotEqual<T>(left: T, right: T): void;

    /**
     * Assert that the provided value is false.
     * @param value The value to check.
     */
    public assertFalse(value: boolean): asserts value is false
    {
        Test.assertFalse(this, value);
    }

    /**
     * Assert that the provided value is false.
     * @param value The value to check.
     */
    public static assertFalse(test: Test, value: boolean): asserts value is false
    {
        Pre.condition.assertNotUndefinedAndNotNull(test, "test");

        test.assertSame(value, false);
    }

    /**
     * Assert that the provided value is true.
     * @param value The value to check.
     */
    public assertTrue(value: boolean): asserts value is true
    {
        Test.assertTrue(this, value);
    }

    /**
     * Assert that the provided value is true.
     * @param value The value to check.
     */
    public static assertTrue(test: Test, value: boolean): asserts value is true
    {
        Pre.condition.assertNotUndefinedAndNotNull(test, "test");

        test.assertSame(value, true);
    }

    /**
     * Assert that the provided action throws the provided {@link Error} when it is run.
     * @param action The action to run.
     * @param expectedError The expected {@link Error}.
     */
    public abstract assertThrows(action: () => void, expectedError: Error): void;

    /**
     * Assert that the provided action throws the provided {@link Error} when it is run.
     * @param action The action to run.
     * @param expectedError The expected {@link Error}.
     */
    public abstract assertThrowsAsync(action: () => Promise<unknown>, expectedError: Error): Promise<void>;
}