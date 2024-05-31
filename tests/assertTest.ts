import * as assert from "assert";

import { Test } from "../sources";

/**
 * A {@link Test} type that uses the standard "assert" module to make assertions.
 */
export class AssertTest implements Test
{
    /**
     * Create a new {@link AssertTest} object.
     */
    public static create(): AssertTest
    {
        return new AssertTest();
    }

    public assertUndefined(value: unknown): asserts value is undefined
    {
        Test.assertUndefined(this, value);
    }

    public assertNull(value: unknown): asserts value is null
    {
        Test.assertNull(this, value);
    }

    public assertNotUndefinedAndNotNull<T>(value: T): asserts value is NonNullable<T>
    {
        Test.assertNotUndefinedAndNotNull(this, value);
    }

    public assertSame<T>(left: T, right: T): void
    {
        assert.strictEqual(left, right);
    }

    public assertNotSame<T>(left: T, right: T): void
    {
        assert.notStrictEqual(left, right);
    }

    public assertEqual<T>(left: T, right: T): void
    {
        assert.deepStrictEqual(left, right);
    }

    public assertNotEqual<T>(left: T, right: T): void
    {
        assert.notDeepStrictEqual(left, right);
    }

    public assertFalse(value: boolean): void
    {
        Test.assertFalse(this, value);
    }

    public assertTrue(value: boolean): void
    {
        Test.assertTrue(this, value);
    }

    public assertThrows(action: () => void, expectedError: Error): void
    {
        assert.throws(action, expectedError);
    }

    public async assertThrowsAsync(action: () => Promise<unknown>, expectedError: Error): Promise<void>
    {
        await assert.rejects(action, expectedError);
    }
}