import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JsonDataBoolean, PreConditionError } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDataBoolean.ts", () =>
    {
        runner.testType(JsonDataBoolean.name, () =>
        {
            runner.testFunction("create(boolean)", () =>
            {
                function createErrorTest(value: boolean, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDataBoolean.create(value), expected);
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
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const json: JsonDataBoolean = JsonDataBoolean.create(value);
                        test.assertEqual(json.getValue(), value);
                        test.assertSame(json, JsonDataBoolean.create(value));
                    });
                }

                createTest(false);
                createTest(true);
            });

            runner.testFunction("toString()", () =>
            {
                function toStringTest(value: boolean, expected: string): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const json: JsonDataBoolean = JsonDataBoolean.create(value);
                        test.assertEqual(json.toString(), expected);
                    });
                }

                toStringTest(false, "false");
                toStringTest(true, "true");
            });
        });
    });
}
test(createTestRunner());