import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { JsonDocumentBoolean, PreConditionError, Token } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDocumentBoolean.ts", () =>
    {
        runner.testType(JsonDocumentBoolean.name, () =>
        {
            runner.testFunction("create(Token)", () =>
            {
                function createErrorTest(token: Token, expected: Error): void
                {
                    runner.test(`with ${runner.toString(token)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDocumentBoolean.create(token), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError(
                    "Expression: token",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, new PreConditionError(
                    "Expression: token",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                createErrorTest(Token.letters("spam"), new PreConditionError(
                    "Expression: token.getText().toLowerCase()",
                    "Expected: one of [\"true\",\"false\"]",
                    "Actual: \"spam\"",
                ));

                function createTest(token: Token, expectedValue: boolean): void
                {
                    runner.test(`with ${runner.toString(token)}`, (test: Test) =>
                    {
                        const json: JsonDocumentBoolean = JsonDocumentBoolean.create(token);
                        test.assertNotUndefinedAndNotNull(json);
                        test.assertEqual(token.getLength(), json.getLength());
                        test.assertEqual(token.getText(), json.getText());
                        test.assertEqual(token.toString(), json.toString());
                        test.assertEqual(expectedValue, json.getValue());
                    });
                }

                createTest(Token.letters("false"), false);
                createTest(Token.letters("true"), true);
                createTest(Token.letters("FALSE"), false);
                createTest(Token.letters("TRUE"), true);
            });
        });
    });
}
test(createTestRunner());