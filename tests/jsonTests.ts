import * as assert from "assert";

import { JsonArray, JsonBoolean, JsonNull, JsonNumber, JsonObject, JsonSegment, JsonString, ParseError, PreConditionError, escapeAndQuote, parseJson } from "../sources";

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
                `Missing object property or object closing brace ('}').`,
            ));
        parseJsonErrorTest(
            `  {  `,
            new ParseError(
                `Missing object property or object closing brace ('}').`,
            ));
        parseJsonErrorTest(
            `{,`,
            new ParseError(
                `Expected object property or object closing brace ('}'), but found "," instead.`,
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
        parseJsonErrorTest(
            `{"hello"`,
            new ParseError(
                `Missing property name/value separator: ":" (58)`,
            ));
        parseJsonErrorTest(
            `{  "hello"  `,
            new ParseError(
                `Missing property name/value separator: ":" (58)`,
            ));
        parseJsonErrorTest(
            `{  "hello"  *  `,
            new ParseError(
                `Expected property name/value separator (':'), but found "*" instead.`,
            ));
        parseJsonErrorTest(
            `{  "hello"  :  `,
            new ParseError(
                `Missing property value.`,
            ));
        parseJsonErrorTest(
            `{  "hello"  :  ,`,
            new ParseError(
                `Expected property value, but found "," instead.`,
            ));
        parseJsonErrorTest(
            `{  "hello"  : "there" `,
            new ParseError(
                `Missing object closing brace: "}" (125)`,
            ));
        parseJsonErrorTest(
            `{  "hello"  : "there" "a":1 `,
            new ParseError(
                `Expected object property separator (',') or object closing brace ('}'), but found "\\"a\\"" instead.`,
            ));
        parseJsonErrorTest(
            `{  "hello"  : "there" , `,
            new ParseError(
                `Missing object property.`,
            ));
        parseJsonErrorTest(
            `{  "hello"  : "there" , }`,
            new ParseError(
                `Expected object property, but found "}" instead.`,
            ));
        parseJsonErrorTest(
            `[`,
            new ParseError(
                `Missing array element or array closing bracket (']').`,
            ));
        parseJsonErrorTest(
            `  [  `,
            new ParseError(
                `Missing array element or array closing bracket (']').`,
            ));
        parseJsonErrorTest(
            `[hello`,
            new ParseError(
                `Expected array element or "]", but found hello instead.`,
            ));
        parseJsonErrorTest(
            `["hello`,
            new ParseError(
                `Missing string end quote: "\\"" (34)`,
            ));
        parseJsonErrorTest(
            `[,`,
            new ParseError(
                `Expected array element or array closing bracket (']'), but found "," instead.`,
            ));
        parseJsonErrorTest(
            `[false`,
            new ParseError(
                `Missing array closing bracket: "]" (93)`,
            ));
        parseJsonErrorTest(
            `[false true`,
            new ParseError(
                `Expected array element separator (',') or array closing bracket (']'), but found "true" instead.`,
            ));
        parseJsonErrorTest(
            `[false,`,
            new ParseError(
                `Missing array element.`,
            ));
        parseJsonErrorTest(
            `[false,  ]`,
            new ParseError(
                `Expected array element, but found "]" instead.`,
            ));
        parseJsonErrorTest(
            `[false,,`,
            new ParseError(
                `Expected array element or array closing bracket (']'), but found "," instead.`,
            ));
        parseJsonErrorTest(
            `false   true`,
            new ParseError(
                `Unexpected token: true`
            ));
        parseJsonErrorTest(
            `&`,
            new ParseError(
                `Unexpected token: &`
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
        parseJsonTest(`5`, JsonNumber.create(5));
        parseJsonTest(`{}`, JsonObject.create());
        parseJsonTest(` { } `, JsonObject.create());
        parseJsonTest(`{"a":1}`, JsonObject.create().set("a", 1));
        parseJsonTest(`{"a":[]}`, JsonObject.create().set("a", JsonArray.create()));
        parseJsonTest(`{"a":{}}`, JsonObject.create().set("a", JsonObject.create()));
        parseJsonTest(`{"a":"apple"}`, JsonObject.create().set("a", "apple"));
        parseJsonTest(`{"a":32}`, JsonObject.create().set("a", 32));
        parseJsonTest(`{"a":false}`, JsonObject.create().set("a", false));
        parseJsonTest(`{"a":1,"b":true}`, JsonObject.create().set("a", 1).set("b", true));
        parseJsonTest(`[]`, JsonArray.create());
        parseJsonTest(`[[]]`, JsonArray.create([JsonArray.create()]));
        parseJsonTest(`[{}]`, JsonArray.create([JsonObject.create()]));
        parseJsonTest(`["abc"]`, JsonArray.create([JsonString.create("abc")]));
        parseJsonTest(`[true]`, JsonArray.create([JsonBoolean.create(true)]));
        parseJsonTest(`[null]`, JsonArray.create([JsonNull.create()]));
        parseJsonTest(`[12345]`, JsonArray.create([JsonNumber.create(12345)]));
        parseJsonTest(`[1,2,3]`, JsonArray.create([1, 2, 3]));
    });
});