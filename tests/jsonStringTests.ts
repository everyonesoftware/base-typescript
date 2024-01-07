import * as assert from "assert";

import { JsonSegmentType, JsonString, PreConditionError, andList, escapeAndQuote } from "../sources";

suite("jsonString.ts", () =>
{
    suite("JsonString", () =>
    {
        suite("create(string, string, boolean)", () =>
        {
            function createErrorTest(value: string, quote: string, endQuote: boolean, expected: Error): void
            {
                test(`with ${andList([escapeAndQuote(value), escapeAndQuote(quote), endQuote.toString()])}`, () =>
                {
                    assert.throws(() => JsonString.create(value, quote, endQuote), expected);
                });
            }

            createErrorTest(undefined!, `"`, false, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            createErrorTest(null!, `"`, false, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
            createErrorTest("", null!, false, new PreConditionError(
                "Expression: quote",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
            createErrorTest("", "", false, new PreConditionError(
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 0",
            ));
            createErrorTest("", "ab", false, new PreConditionError(
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 2",
            ));

            function createTest(value: string, quote: string, endQuote: boolean, expectedQuote: string = quote, expectedEndQuote: boolean = endQuote): void
            {
                test(`with ${andList([escapeAndQuote(value), escapeAndQuote(quote), endQuote.toString()])}`, () =>
                {
                    const json: JsonString = JsonString.create(value, quote, endQuote);
                    assert.strictEqual(json.getValue(), value);
                    assert.strictEqual(json.getQuote(), expectedQuote);
                    assert.strictEqual(json.hasEndQuote(), expectedEndQuote);
                    assert.strictEqual(json.getType(), JsonSegmentType.String);
                });
            }

            createTest("", undefined!, false, `"`);
            createTest("", `'`, false);
            createTest("abc", `'`, false);
            createTest("", `'`, true);
            createTest("abc", `'`, true);
        });

        suite("toString()", () =>
        {
            function toStringTest(value: string, quote: string, endQuote: boolean, expected: string): void
            {
                test(`with ${andList([escapeAndQuote(value), escapeAndQuote(quote), endQuote.toString()])}`, () =>
                {
                    const json: JsonString = JsonString.create(value, quote, endQuote);
                    assert.strictEqual(json.toString(), expected);
                });
            }

            toStringTest("", `'`, false, `'`);
            toStringTest("abc", `'`, false, `'abc`);
            toStringTest("", `'`, true, `''`);
            toStringTest("abc", `'`, true, `'abc'`);
        });
    });
});