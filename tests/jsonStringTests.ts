import * as assert from "assert";

import { JsonSegmentType, JsonString, JsonTokenType, PreConditionError, andList, escapeAndQuote } from "../sources";

suite("jsonString.ts", () =>
{
    suite("JsonString", () =>
    {
        suite("create(string, string)", () =>
        {
            function createErrorTest(value: string, quote: string, expected: Error): void
            {
                test(`with ${andList([value, quote].map(x => escapeAndQuote(x)))}`, () =>
                {
                    assert.throws(() => JsonString.create(value, quote), expected);
                });
            }

            createErrorTest(undefined!, `"`, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            createErrorTest(null!, `"`, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
            createErrorTest("", null!, new PreConditionError(
                "Expression: quote",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
            createErrorTest("", "", new PreConditionError(
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 0",
            ));
            createErrorTest("", "ab", new PreConditionError(
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 2",
            ));

            function createTest(value: string, quote: string, expectedQuote: string = quote): void
            {
                test(`with ${andList([value, quote].map(x => escapeAndQuote(x)))}`, () =>
                {
                    const json: JsonString = JsonString.create(value, quote);
                    assert.strictEqual(json.getValue(), value);
                    assert.strictEqual(json.getQuote(), expectedQuote);
                    assert.strictEqual(json.getSegmentType(), JsonSegmentType.String);
                    assert.strictEqual(json.getTokenType(), JsonTokenType.String);
                });
            }

            createTest("", undefined!, `"`);
            createTest("", `'`);
            createTest("abc", `'`);
            createTest("", `'`);
            createTest("abc", `'`);
        });

        suite("toString()", () =>
        {
            function toStringTest(value: string, quote: string, expected: string): void
            {
                test(`with ${andList([value, quote].map(x => escapeAndQuote(x)))}`, () =>
                {
                    const json: JsonString = JsonString.create(value, quote);
                    assert.strictEqual(json.toString(), expected);
                });
            }

            toStringTest("", `'`, `''`);
            toStringTest("abc", `'`, `'abc'`);
            toStringTest("", `"`, `""`);
            toStringTest("abc", `"`, `"abc"`);
        });
    });
});