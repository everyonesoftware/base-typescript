import * as assert from "assert";
import { JsonBoolean, JsonSegmentType, PreConditionError } from "../sources";

suite("jsonBoolean.ts", () =>
{
    suite("JsonBoolean", () =>
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
});