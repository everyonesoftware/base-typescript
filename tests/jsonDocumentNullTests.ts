import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { JsonDocumentNull, PreConditionError, Token } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDocumentNull.ts", () =>
    {
        runner.testType(JsonDocumentNull.name, () =>
        {
            runner.testFunction("create(Token)", () =>
            {
                function createErrorTest(token: Token, expected: Error): void
                {
                    runner.test(`with ${runner.toString(token)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDocumentNull.create(token), expected);
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
                    "Expected: \"null\"",
                    "Actual: \"spam\"",
                ));

                function createTest(token: Token): void
                {
                    runner.test(`with ${runner.toString(token)}`, (test: Test) =>
                    {
                        const json: JsonDocumentNull = JsonDocumentNull.create(token);
                        test.assertNotUndefinedAndNotNull(json);
                        test.assertEqual(token.getLength(), json.getLength());
                        test.assertEqual(token.getText(), json.getText());
                        test.assertEqual(token.toString(), json.toString());
                        test.assertNull(json.getValue());
                    });
                }

                createTest(Token.letters("null"));
                createTest(Token.letters("Null"));
                createTest(Token.letters("NULL"));
            });
        });
    });
}
test(createTestRunner());