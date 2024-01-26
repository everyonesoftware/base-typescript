import * as assert from "assert";

import { JsonNumber, JsonSegmentType, PreConditionError } from "../sources";

suite("jsonNumber.ts", () =>
{
    suite("JsonNumber", () =>
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

            createErrorTest(undefined!, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            createErrorTest(null!, new PreConditionError(
                "Expression: value",
                "Expected: not undefined and not null",
                "Actual: null",
            ));

            function createTest(value: number): void
            {
                test(`with ${value}`, () =>
                {
                    const json: JsonNumber = JsonNumber.create(value);
                    assert.strictEqual(json.getValue(), value);
                    assert.strictEqual(json.getSegmentType(), JsonSegmentType.Number);
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
});