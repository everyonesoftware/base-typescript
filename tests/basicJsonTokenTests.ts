import * as assert from "assert";

import { BasicJsonToken, JsonTokenType, PreConditionError, andList, escapeAndQuote, toString } from "../sources";

suite("basicJsonToken.ts", () =>
{
    suite("BasicJsonToken", () =>
    {
        suite("create(JsonTokenType,string)", () =>
        {
            function createErrorTest(tokenType: JsonTokenType, text: string, expected: Error): void
            {
                test(`with ${andList([toString(tokenType), escapeAndQuote(text)])}`, () =>
                {
                    assert.throws(() => BasicJsonToken.create(tokenType, text), expected);
                });
            }

            createErrorTest(
                undefined!,
                "hello",
                new PreConditionError(
                    "Expression: tokenType",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
            createErrorTest(
                null!,
                "hello",
                new PreConditionError(
                    "Expression: tokenType",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
            createErrorTest(
                JsonTokenType.Boolean,
                undefined!,
                new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
            createErrorTest(
                JsonTokenType.Boolean,
                null!,
                new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
            createErrorTest(
                JsonTokenType.Boolean,
                "",
                new PreConditionError(
                    "Expression: text",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));

            function createTest(tokenType: JsonTokenType, text: string): void
            {
                const token: BasicJsonToken = BasicJsonToken.create(tokenType, text);
                assert.strictEqual(token.getTokenType(), tokenType);
                assert.strictEqual(token.getText(), text);
            }

            createTest(JsonTokenType.Boolean, "FALSE");
            createTest(JsonTokenType.Null, "Null");
        });
    });
});