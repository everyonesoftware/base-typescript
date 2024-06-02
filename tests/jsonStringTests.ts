import { JsonSegmentType, JsonString, JsonTokenType, PreConditionError, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonString.ts", () =>
    {
        runner.testType(JsonString, () =>
        {
            runner.testFunction("create(string, string)", () =>
            {
                function createErrorTest(value: string, quote: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([value, quote])}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonString.create(value, quote), expected);
                    });
                }

                createErrorTest(undefined!, `"`, new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, `"`, new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                createErrorTest("", null!, new PreConditionError(
                    "Expression: quote",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                createErrorTest("", "", new PreConditionError(
                    "Expression: quote.length",
                    "Expected: 1",
                    "Actual: 0",
                ));
                createErrorTest("", "ab", new PreConditionError(
                    "Expression: quote.length",
                    "Expected: 1",
                    "Actual: 2",
                ));

                function createTest(value: string, quote: string, expectedQuote: string = quote): void
                {
                    runner.test(`with ${runner.andList([value, quote])}`, (test: Test) =>
                    {
                        const json: JsonString = JsonString.create(value, quote);
                        test.assertSame(json.getValue(), value);
                        test.assertSame(json.getQuote(), expectedQuote);
                        test.assertSame(json.getSegmentType(), JsonSegmentType.String);
                        test.assertSame(json.getTokenType(), JsonTokenType.String);
                    });
                }

                createTest("", undefined!, `"`);
                createTest("", `'`);
                createTest("abc", `'`);
                createTest("", `'`);
                createTest("abc", `'`);
            });

            runner.testFunction("toString()", () =>
            {
                function toStringTest(value: string, quote: string, expected: string): void
                {
                    runner.test(`with ${runner.andList([value, quote])}`, (test: Test) =>
                    {
                        const json: JsonString = JsonString.create(value, quote);
                        test.assertSame(json.toString(), expected);
                    });
                }

                toStringTest("", `'`, `''`);
                toStringTest("abc", `'`, `'abc'`);
                toStringTest("", `"`, `""`);
                toStringTest("abc", `"`, `"abc"`);
            });
        });
    });
}
test(MochaTestRunner.create());
