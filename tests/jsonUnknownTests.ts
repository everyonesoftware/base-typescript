import * as assert from "assert";

import { JsonSegmentType, JsonUnknown, PreConditionError, escapeAndQuote } from "../sources";

suite("jsonUnknown.ts", () =>
{
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

            createErrorTest(undefined!, new PreConditionError(
                "Expression: text",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            createErrorTest(null!, new PreConditionError(
                "Expression: text",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
            createErrorTest("", new PreConditionError(
                "Expression: text",
                "Expected: not empty",
                "Actual: \"\"",
            ));

            function createTest(value: string): void
            {
                test(`with ${value}`, () =>
                {
                    const json: JsonUnknown = JsonUnknown.create(value);
                    assert.strictEqual(json.toString(), value);
                    assert.strictEqual(json.getSegmentType(), JsonSegmentType.Unknown);
                });
            }

            createTest("_");
            createTest("$");
            createTest("*");
        });
    });
});