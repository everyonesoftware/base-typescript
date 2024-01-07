import * as assert from "assert";
import { JsonBoolean, JsonNull, JsonNumber, JsonObject, JsonSegment, JsonSegmentType, JsonString, PreConditionError, andList, escapeAndQuote } from "../sources/";

suite("jsonSegment.ts", () =>
{
    suite("JsonSegment", () =>
    {
        suite("boolean(boolean)", () =>
        {
            function booleanErrorTest(value: boolean, expected: Error): void
            {
                test(`with ${value}`, () =>
                {
                    assert.throws(() => JsonSegment.boolean(value), expected);
                });
            }

            booleanErrorTest(undefined!, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            booleanErrorTest(null!, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ));

            function booleanTest(value: boolean): void
            {
                test(`with ${value}`, () =>
                {
                    const json: JsonBoolean = JsonSegment.boolean(value);
                    assert.strictEqual(json.getValue(), value);
                    assert.strictEqual(json.getType(), JsonSegmentType.Boolean);
                });
            }

            booleanTest(false);
            booleanTest(true);
        });

        suite("number(number)", () =>
        {
            function numberErrorTest(value: number, expected: Error): void
            {
                test(`with ${value}`, () =>
                {
                    assert.throws(() => JsonSegment.number(value), expected);
                });
            }

            numberErrorTest(undefined!, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            numberErrorTest(null!, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ));

            function numberTest(value: number): void
            {
                test(`with ${value}`, () =>
                {
                    const json: JsonNumber = JsonSegment.number(value);
                    assert.strictEqual(json.getValue(), value);
                    assert.strictEqual(json.getType(), JsonSegmentType.Number);
                });
            }

            numberTest(0);
            numberTest(-1);
            numberTest(1);
            numberTest(-0.1);
            numberTest(0.1);
        });

        suite("string(string,string,boolean)", () =>
        {
            function stringErrorTest(value: string, quote: string, endQuote: boolean, expected: Error): void
            {
                test(`with ${andList([escapeAndQuote(value), escapeAndQuote(quote), endQuote.toString()])}`, () =>
                {
                    assert.throws(() => JsonSegment.string(value, quote, endQuote), expected);
                });
            }

            stringErrorTest(undefined!, `"`, false, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            stringErrorTest(null!, `"`, false, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
            stringErrorTest("", null!, false, new PreConditionError(
                "Expression: quote",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
            stringErrorTest("", "", false, new PreConditionError(
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 0",
            ));
            stringErrorTest("", "ab", false, new PreConditionError(
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 2",
            ));

            function stringTest(value: string, quote: string, endQuote: boolean, expectedQuote: string = quote, expectedEndQuote: boolean = endQuote): void
            {
                test(`with ${andList([escapeAndQuote(value), escapeAndQuote(quote), endQuote.toString()])}`, () =>
                {
                    const json: JsonString = JsonSegment.string(value, quote, endQuote);
                    assert.strictEqual(json.getValue(), value);
                    assert.strictEqual(json.getQuote(), expectedQuote);
                    assert.strictEqual(json.hasEndQuote(), expectedEndQuote);
                    assert.strictEqual(json.getType(), JsonSegmentType.String);
                });
            }

            stringTest("", undefined!, false, `"`);
            stringTest("", `'`, false);
            stringTest("abc", `'`, false);
            stringTest("", `'`, true);
            stringTest("abc", `'`, true);
        });

        test("null()", () =>
        {
            const json: JsonNull = JsonSegment.null();
            assert.strictEqual(json.getType(), JsonSegmentType.Null);
            assert.strictEqual(json.toString(), "null");
        });

        test("object()", () =>
        {
            const json: JsonObject = JsonSegment.object();
            assert.strictEqual(json.getType(), JsonSegmentType.Object);
            assert.deepStrictEqual(json.toArray(), []);
        });
    });
});
