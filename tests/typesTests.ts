import * as assert from "assert";

import * as types from "../sources/types"

suite("types", () =>
{
    suite("isString(unknown)", () =>
    {
        function isStringTest(value: unknown, expected: boolean): void
        {
            test(`with ${value}`, () =>
            {
                assert.strictEqual(types.isString(value), expected);
            });
        }

        isStringTest(undefined, false);
        isStringTest(null, false);
        isStringTest(50, false);
        isStringTest({}, false);
        isStringTest("", true);
        isStringTest("hello", true);
    });
});