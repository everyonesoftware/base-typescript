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
                    assert.strictEqual(json.getSegmentType(), JsonSegmentType.Boolean);
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
                    assert.strictEqual(json.getSegmentType(), JsonSegmentType.Number);
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
            function stringErrorTest(value: string, quote: string, expected: Error): void
            {
                test(`with ${andList([value, quote].map(x => escapeAndQuote(x)))}`, () =>
                {
                    assert.throws(() => JsonSegment.string(value, quote), expected);
                });
            }

            stringErrorTest(undefined!, `"`, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            stringErrorTest(null!, `"`, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
            stringErrorTest("", null!, new PreConditionError(
                "Expression: quote",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
            stringErrorTest("", "", new PreConditionError(
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 0",
            ));
            stringErrorTest("", "ab", new PreConditionError(
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 2",
            ));

            function stringTest(value: string, quote: string, expectedQuote: string = quote): void
            {
                test(`with ${andList([value, quote].map(x => escapeAndQuote(x)))}`, () =>
                {
                    const json: JsonString = JsonSegment.string(value, quote);
                    assert.strictEqual(json.getValue(), value);
                    assert.strictEqual(json.getQuote(), expectedQuote);
                    assert.strictEqual(json.getSegmentType(), JsonSegmentType.String);
                });
            }

            stringTest("", undefined!, `"`);
            stringTest("", `'`);
            stringTest("abc", `'`);
            stringTest("", `'`);
            stringTest("abc", `'`);
        });

        test("null()", () =>
        {
            const json: JsonNull = JsonSegment.null();
            assert.strictEqual(json.getSegmentType(), JsonSegmentType.Null);
            assert.strictEqual(json.toString(), "null");
        });

        test("object()", () =>
        {
            const json: JsonObject = JsonSegment.object();
            assert.strictEqual(json.getSegmentType(), JsonSegmentType.Object);
            assert.deepStrictEqual(json.toArray(), []);
        });
    });
});
