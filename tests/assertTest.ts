import * as assert from "assert";

import { Test } from "../sources";

/**
 * A {@link Test} type that uses the standard "assert" module to make assertions.
 */
export class AssertTest implements Test
{
    protected constructor()
    {
    }

    /**
     * Create a new {@link AssertTest} object.
     */
    public static create(): AssertTest
    {
        return new AssertTest();
    }

    public assertSame<T>(left: T, right: T): void
    {
        assert.strictEqual(left, right);
    }

    public assertEqual<T>(left: T, right: T): void
    {
        assert.deepStrictEqual(left, right);
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
}