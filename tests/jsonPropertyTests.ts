import { JsonProperty, JsonSegment, PreConditionError, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonProperty.ts", () =>
    {
        runner.testType(JsonProperty.name, () =>
        {
            runner.testFunction("create(string,JsonSegment)", () =>
            {
                function createErrorTest(name: string, value: JsonSegment, expected: Error): void
                {
                    runner.test(`with ${runner.andList([name, value])}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonProperty.create(name, value), expected);
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
                    runner.test(`with ${runner.andList([name, value])}`, (test: Test) =>
                    {
                        const property: JsonProperty = JsonProperty.create(name, value);
                        test.assertSame(property.getName(), name);
                        test.assertSame(property.getValue(), value);
                    });
                }

                createTest("abc", JsonSegment.boolean(false));
                createTest("def", JsonSegment.boolean(true));
                createTest("g", JsonSegment.null());
            });
        });
    });
}
test(MochaTestRunner.create());