import * as assert from "assert";

import { isArray, isString } from "../sources/index";

suite("types.ts", () =>
{
    suite("isString(unknown)", () =>
    {
        function isStringTest(value: unknown, expected: boolean): void
        {
            test(`with ${value}`, () =>
            {
                assert.strictEqual(isString(value), expected);
            });
        }

        isStringTest(undefined, false);
        isStringTest(null, false);
        isStringTest(50, false);
        isStringTest({}, false);
        isStringTest("", true);
        isStringTest("hello", true);
    });

    suite("isArray(unknown)", () =>
    {
        function isArrayTest(value: unknown, expected: boolean): void
        {
            test(`with ${value}`, () =>
            {
                assert.strictEqual(isArray(value), expected);
            });
        }

        isArrayTest(undefined, false);
        isArrayTest(null, false);
        isArrayTest(50, false);
        isArrayTest({}, false);
        isArrayTest("", false);
        isArrayTest("hello", false);
        isArrayTest([], true);
        isArrayTest(["a", "b"], true);
    });
});