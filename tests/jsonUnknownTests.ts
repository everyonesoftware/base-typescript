import { JsonSegmentType, JsonUnknown, PreConditionError, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonUnknown.ts", () =>
    {
        runner.testType(JsonUnknown.name, () =>
        {
            runner.testFunction("create(string)", () =>
            {
                function createErrorTest(value: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonUnknown.create(value), expected);
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
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const json: JsonUnknown = JsonUnknown.create(value);
                        test.assertSame(json.toString(), value);
                        test.assertSame(json.getSegmentType(), JsonSegmentType.Unknown);
                    });
                }

                createTest("_");
                createTest("$");
                createTest("*");
            });
        });
    });
}
test(MochaTestRunner.create());