import * as assert from "assert";

import { JsonProperty, JsonSegment, PreConditionError, andList, escapeAndQuote } from "../sources";

suite("jsonProperty.ts", () =>
{
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
                new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
            createErrorTest(
                null!,
                JsonSegment.boolean(false),
                new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
            createErrorTest(
                "",
                JsonSegment.boolean(false),
                new PreConditionError(
                    "Expression: name",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));
            createErrorTest(
                "abc",
                undefined!,
                new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
            createErrorTest(
                "abc",
                null!,
                new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

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