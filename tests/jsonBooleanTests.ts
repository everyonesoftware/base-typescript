import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JsonBoolean, JsonSegmentType, PreConditionError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonBoolean.ts", () =>
    {
        runner.testType(JsonBoolean, () =>
        {
            runner.testFunction("create(boolean)", () =>
            {
                function createErrorTest(value: boolean, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonBoolean.create(value), expected);
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
                        const json: JsonBoolean = JsonBoolean.create(value);
                        test.assertEqual(json.getValue(), value);
                        test.assertEqual(json.getSegmentType(), JsonSegmentType.Boolean);
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
                        const json: JsonBoolean = JsonBoolean.create(value);
                        test.assertEqual(json.toString(), expected);
                    });
                }

                toStringTest(false, "false");
                toStringTest(true, "true");
            });
        });
    });
}
test(TestRunner.create());