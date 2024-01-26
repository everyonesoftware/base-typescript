import * as assert from "assert";

import { JsonArray, JsonBoolean, JsonNull, JsonObject, JsonSegment, JsonString, ParseError, PreConditionError, escapeAndQuote, parseJson } from "../sources";

suite("json.ts", () =>
{
    suite("parseJson(string)", () =>
    {
        function parseJsonErrorTest(text: string, expected: Error): void
        {
            test(`with ${escapeAndQuote(text)}`, () =>
            {
                assert.throws(() => parseJson(text), expected);
            });
        }

        parseJsonErrorTest(
            undefined!,
            new PreConditionError(
                "Expression: text",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
        parseJsonErrorTest(
            null!,
            new PreConditionError(
                "Expression: text",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
        parseJsonErrorTest(
            ``,
            new ParseError(
                "Missing JSON value.",
            ));
        parseJsonErrorTest(
            `"`,
            new ParseError(
                `Missing string end quote: "\\"" (34)`,
            ));
        parseJsonErrorTest(
            `"\t"`,
            new ParseError(
                `Invalid string character: "\\t" (9)`,
            ));
        parseJsonErrorTest(
            `{`,
            new ParseError(
                `Missing object closing brace: "}" (125)`,
            ));
        parseJsonErrorTest(
            `  {  `,
            new ParseError(
                `Missing object closing brace: "}" (125)`,
            ));
        parseJsonErrorTest(
            `{hello`,
            new ParseError(
                `Expected "}" or "\\"", but found "hello" instead.`,
            ));
        parseJsonErrorTest(
            `{"hello`,
            new ParseError(
                `Missing string end quote: "\\"" (34)`,
            ));

        function parseJsonTest(text: string, expected: JsonSegment): void
        {
            test(`with ${escapeAndQuote(text)}`, () =>
            {
                assert.deepStrictEqual(parseJson(text), expected);
            });
        }

        parseJsonTest("null", JsonNull.create());
        parseJsonTest("false", JsonBoolean.create(false));
        parseJsonTest("true", JsonBoolean.create(true));
        parseJsonTest(`""`, JsonString.create(""));
        parseJsonTest(`"hello"`, JsonString.create("hello"));
        parseJsonTest(`"\\\""`, JsonString.create("\\\""));
        parseJsonTest(`"\\t"`, JsonString.create("\\t"));
        parseJsonTest(`"\\m"`, JsonString.create("\\m"));
        parseJsonTest(`{}`, JsonObject.create());
        parseJsonTest(` { } `, JsonObject.create());
        parseJsonTest(`[]`, JsonArray.create());
    });
});