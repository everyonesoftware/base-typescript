import * as assert from "assert";
import { JsonBoolean, JsonNull, JsonNumber, JsonObject, JsonProperty, JsonSegment, JsonSegmentType, JsonString, JsonUnknown, PreConditionError, andList, escapeAndQuote, join } from "../sources/index";

suite("json.ts", () =>
{
    suite(JsonSegment.name, () =>
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

            booleanErrorTest(undefined!, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            booleanErrorTest(null!, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));

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

            numberErrorTest(undefined!, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            numberErrorTest(null!, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));

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

            stringErrorTest(undefined!, `"`, false, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            stringErrorTest(null!, `"`, false, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            stringErrorTest("", null!, false, new PreConditionError(join("\n", [
                "Expression: quote",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            stringErrorTest("", "", false, new PreConditionError(join("\n", [
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 0",
            ])));
            stringErrorTest("", "ab", false, new PreConditionError(join("\n", [
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 2",
            ])));

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

    suite(JsonBoolean.name, () =>
    {
        suite("create(boolean)", () =>
        {
            function createErrorTest(value: boolean, expected: Error): void
            {
                test(`with ${value}`, () =>
                {
                    assert.throws(() => JsonBoolean.create(value), expected);
                });
            }

            createErrorTest(undefined!, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            createErrorTest(null!, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));

            function createTest(value: boolean): void
            {
                test(`with ${value}`, () =>
                {
                    const json: JsonBoolean = JsonBoolean.create(value);
                    assert.strictEqual(json.getValue(), value);
                    assert.strictEqual(json.getType(), JsonSegmentType.Boolean);
                });
            }

            createTest(false);
            createTest(true);
        });

        suite("toString()", () =>
        {
            function toStringTest(value: boolean, expected: string): void
            {
                test(`with ${value}`, () =>
                {
                    const json: JsonBoolean = JsonBoolean.create(value);
                    assert.strictEqual(json.toString(), expected);
                });
            }

            toStringTest(false, "false");
            toStringTest(true, "true");
        });
    });

    suite(JsonNumber.name, () =>
    {
        suite("create(number)", () =>
        {
            function createErrorTest(value: number, expected: Error): void
            {
                test(`with ${value}`, () =>
                {
                    assert.throws(() => JsonNumber.create(value), expected);
                });
            }

            createErrorTest(undefined!, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            createErrorTest(null!, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));

            function createTest(value: number): void
            {
                test(`with ${value}`, () =>
                {
                    const json: JsonNumber = JsonNumber.create(value);
                    assert.strictEqual(json.getValue(), value);
                    assert.strictEqual(json.getType(), JsonSegmentType.Number);
                });
            }

            createTest(0);
            createTest(-1);
            createTest(1);
            createTest(-0.1);
            createTest(0.1);
        });

        suite("toString()", () =>
        {
            function toStringTest(value: number, expected: string): void
            {
                test(`with ${value}`, () =>
                {
                    const json: JsonNumber = JsonNumber.create(value);
                    assert.strictEqual(json.toString(), expected);
                });
            }

            toStringTest(0, "0");
            toStringTest(1, "1");
            toStringTest(-1, "-1");
            toStringTest(-0.1, "-0.1");
            toStringTest(0.1, "0.1");
        });
    });

    suite(JsonNull.name, () =>
    {
        test("create()", () =>
        {
            const json: JsonNull = JsonNull.create();
            assert.strictEqual(json.getType(), JsonSegmentType.Null);
            assert.strictEqual(json.toString(), "null");
        });
    });

    suite(JsonString.name, () =>
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

            createErrorTest(undefined!, `"`, false, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            createErrorTest(null!, `"`, false, new PreConditionError(join("\n", [
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            createErrorTest("", null!, false, new PreConditionError(join("\n", [
                "Expression: quote",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            createErrorTest("", "", false, new PreConditionError(join("\n", [
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 0",
            ])));
            createErrorTest("", "ab", false, new PreConditionError(join("\n", [
                "Expression: quote.length",
                "Expected: 1",
                "Actual: 2",
            ])));

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

    suite(JsonUnknown.name, () =>
    {
        suite("create(string)", () =>
        {
            function createErrorTest(value: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(value)}`, () =>
                {
                    assert.throws(() => JsonUnknown.create(value), expected);
                });
            }

            createErrorTest(undefined!, new PreConditionError(join("\n", [
                "Expression: text",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ])));
            createErrorTest(null!, new PreConditionError(join("\n", [
                "Expression: text",
                "Expected: not undefined and not null",
                "Actual: null",
            ])));
            createErrorTest("", new PreConditionError(join("\n", [
                "Expression: text",
                "Expected: not empty",
                "Actual: \"\"",
            ])));

            function createTest(value: string): void
            {
                test(`with ${value}`, () =>
                {
                    const json: JsonUnknown = JsonUnknown.create(value);
                    assert.strictEqual(json.toString(), value);
                    assert.strictEqual(json.getType(), JsonSegmentType.Unknown);
                });
            }

            createTest("_");
            createTest("$");
            createTest("*");
        });
    });

    suite(JsonProperty.name, () =>
    {
        suite("create(string,JsonSegment)", () =>
        {
            function createErrorTest(name: string, value: JsonSegment, expected: Error): void
            {
                test(`with ${andList([escapeAndQuote(name), JSON.stringify(value)])}`, () =>
                {
                    assert.throws(() => JsonProperty.create(name, value), expected);
                });
            }

            createErrorTest(
                undefined!,
                JsonSegment.boolean(false),
                new PreConditionError(join("\n", [
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ])));
            createErrorTest(
                null!,
                JsonSegment.boolean(false),
                new PreConditionError(join("\n", [
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ])));
            createErrorTest(
                "",
                JsonSegment.boolean(false),
                new PreConditionError(join("\n", [
                    "Expression: name",
                    "Expected: not empty",
                    "Actual: \"\"",
                ])));
            createErrorTest(
                "abc",
                undefined!,
                new PreConditionError(join("\n", [
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ])));
            createErrorTest(
                "abc",
                null!,
                new PreConditionError(join("\n", [
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ])));

            function createTest(name: string, value: JsonSegment): void
            {
                test(`with ${andList([escapeAndQuote(name), JSON.stringify(value)])}`, () =>
                {
                    const property: JsonProperty = JsonProperty.create(name, value);
                    assert.strictEqual(property.getName(), name);
                    assert.strictEqual(property.getValue(), value);
                });
            }

            createTest("abc", JsonSegment.boolean(false));
            createTest("def", JsonSegment.boolean(true));
            createTest("g", JsonSegment.null());
        });
    });
});