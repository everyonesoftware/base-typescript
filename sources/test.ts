import { Pre } from "./pre";

/**
 * A type that can be used to make assertions during a test.
 */
export abstract class Test
{
    /**
     * Assert that the provided values point to the same object.
     * @param left The first value.
     * @param right The second value.
     */
    public abstract assertSame<T>(left: T, right: T): void;

    /**
     * Assert that the provided values are equal.
     * @param left The first value.
     * @param right The second value.
     */
    public abstract assertEqual<T>(left: T, right: T): void;

    /**
     * Assert that the provided value is false.
     * @param value The value to check.
     */
    public assertFalse(value: boolean): void
    {
        Test.assertFalse(this, value);
    }

    /**
     * Assert that the provided value is false.
     * @param value The value to check.
     */
    public static assertFalse(test: Test, value: boolean): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(test, "test");

        test.assertSame(value, false);
    }

    /**
     * Assert that the provided value is true.
     * @param value The value to check.
     */
    public assertTrue(value: boolean): void
    {
        Test.assertTrue(this, value);
    }

    /**
     * Assert that the provided value is true.
     * @param value The value to check.
     */
    public static assertTrue(test: Test, value: boolean): void
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
}