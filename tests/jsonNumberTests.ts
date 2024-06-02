import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JsonNumber, JsonSegmentType, PreConditionError } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonNumber.ts", () =>
    {
        runner.testType(JsonNumber, () =>
        {
            runner.testFunction("create(number)", () =>
            {
                function createErrorTest(value: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonNumber.create(value), expected);
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
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const json: JsonNumber = JsonNumber.create(value);
                        test.assertEqual(json.getValue(), value);
                        test.assertEqual(json.getSegmentType(), JsonSegmentType.Number);
                    });
                }

                createTest(0);
                createTest(-1);
                createTest(1);
                createTest(-0.1);
                createTest(0.1);
            });

            runner.testFunction("toString()", () =>
            {
                function toStringTest(value: number, expected: string): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const json: JsonNumber = JsonNumber.create(value);
                        test.assertEqual(json.toString(), expected);
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
}
test(createTestRunner());