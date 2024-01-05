import * as assert from "assert";

import { andList, join, PreConditionError } from "../sources/index";

suite("english.ts", () =>
{
    suite("andList(string[])", () =>
    {
        function andListErrorTest(values: string[] | undefined | null, expectedError: Error): void
        {
            test(`with ${JSON.stringify(values)}`, () =>
            {
                assert.throws(() => andList(values!), expectedError);
            });
        }

        andListErrorTest(
            undefined,
            new PreConditionError(
                join("\n", [
                    "Expression: values",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ])));
                andListErrorTest(
            null,
            new PreConditionError(
                join("\n", [
                    "Expression: values",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ])));

        function andListTest(values: string[], expected: string): void
        {
            test(`with ${JSON.stringify(values)}`, () =>
            {
                assert.strictEqual(andList(values), expected);
            });
        }

        andListTest([], "");
        andListTest([""], "");
        andListTest(["", ""], " and ");
        andListTest(["", "", ""], ", , and ");
        
        andListTest(["a"], "a");
        andListTest(["a", "b"], "a and b");
        andListTest(["a", "b", "c"], "a, b, and c");
        andListTest(["a", "b", "c", "d"], "a, b, c, and d");
    });
});