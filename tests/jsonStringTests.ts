import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JsonDataString, PreConditionError } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonString.ts", () =>
    {
        runner.testType(JsonDataString, () =>
        {
            runner.testFunction("create(string)", () =>
            {
                function createErrorTest(value: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDataString.create(value), expected);
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

                function createTest(value: string): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const json: JsonDataString = JsonDataString.create(value);
                        test.assertSame(json.getValue(), value);
                        test.assertSame(json.toString(), value);
                    });
                }

                createTest("");
                createTest("abc");
            });
        });
    });
}
test(createTestRunner());
