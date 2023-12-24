import * as assert from "assert";

import { PreConditionError } from "../sources/condition";
import * as english from "../sources/english";
import * as strings from "../sources/strings";

suite("english", () =>
{
    suite("andList(string[])", () =>
    {
        function andListErrorTest(values: string[] | undefined | null, expectedError: Error): void
        {
            test(`with ${JSON.stringify(values)}`, () =>
            {
                assert.throws(() => english.andList(values!), expectedError);
            });
        }

        andListErrorTest(
            undefined,
            new PreConditionError(
                strings.join("\n", [
                    "Expression: values",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ])));
                andListErrorTest(
            null,
            new PreConditionError(
                strings.join("\n", [
                    "Expression: values",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ])));

        function andListTest(values: string[], expected: string): void
        {
            test(`with ${JSON.stringify(values)}`, () =>
            {
                assert.strictEqual(english.andList(values), expected);
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