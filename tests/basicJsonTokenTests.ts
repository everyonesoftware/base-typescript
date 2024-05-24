import { BasicJsonToken, JsonTokenType, PreConditionError, Test, TestRunner, andList, escapeAndQuote, toString } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

function test(runner: TestRunner): void
{
    runner.testFile("basicJsonToken.ts", () =>
    {
        runner.testType(BasicJsonToken, () =>
        {
            runner.testFunction("create(JsonTokenType,string)", () =>
            {
                function createErrorTest(tokenType: JsonTokenType, text: string, expected: Error): void
                {
                    runner.test(`with ${andList([toString(tokenType), escapeAndQuote(text)])}`, (test: Test) =>
                    {
                        test.assertThrows(() => BasicJsonToken.create(tokenType, text), expected);
                    });
                }

                createErrorTest(
                    undefined!,
                    "hello",
                    new PreConditionError(
                        "Expression: tokenType",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                createErrorTest(
                    null!,
                    "hello",
                    new PreConditionError(
                        "Expression: tokenType",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
                createErrorTest(
                    JsonTokenType.Boolean,
                    undefined!,
                    new PreConditionError(
                        "Expression: text",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                createErrorTest(
                    JsonTokenType.Boolean,
                    null!,
                    new PreConditionError(
                        "Expression: text",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
                createErrorTest(
                    JsonTokenType.Boolean,
                    "",
                    new PreConditionError(
                        "Expression: text",
                        "Expected: not empty",
                        "Actual: \"\"",
                    ));

                function createTest(tokenType: JsonTokenType, text: string): void
                {
                    runner.test(`with ${andList([toString(tokenType), escapeAndQuote(text)])}`, (test: Test) =>
                    {
                        const token: BasicJsonToken = BasicJsonToken.create(tokenType, text);
                        test.assertSame(token.getTokenType(), tokenType);
                        test.assertSame(token.getText(), text);
                    });
                }

                createTest(JsonTokenType.Boolean, "FALSE");
                createTest(JsonTokenType.Null, "Null");
            });
        });
    });
}
test(MochaTestRunner.create());