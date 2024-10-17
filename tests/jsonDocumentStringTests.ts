import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { Iterable, JsonDocumentString, PreConditionError, Token } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDocumentString.ts", () =>
    {
        runner.testType(JsonDocumentString.name, () =>
        {
            runner.testFunction("create(Iterable<Token>,boolean)", () =>
            {
                function createErrorTest(tokens: Iterable<Token>, endQuote: boolean, expected: Error): void
                {
                    runner.test(`with ${runner.andList([tokens, endQuote])}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDocumentString.create(tokens, endQuote), expected);
                    });
                }

                createErrorTest(undefined!, false, new PreConditionError(
                    "Expression: tokens",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, false, new PreConditionError(
                    "Expression: tokens",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                createErrorTest(Iterable.create(), false, new PreConditionError(
                    "Expression: tokens",
                    "Expected: not empty",
                    "Actual: []",
                ));
                createErrorTest(Iterable.create([Token.doubleQuote()]), undefined!, new PreConditionError(
                    "Expression: endQuote",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));

                function createTest(tokens: Iterable<Token>, endQuote: boolean, expectedText: string, expectedValue: String): void
                {
                    runner.test(`with ${runner.andList([tokens, endQuote])}`, (test: Test) =>
                    {
                        const json: JsonDocumentString = JsonDocumentString.create(tokens, endQuote);
                        test.assertNotUndefinedAndNotNull(json);
                        test.assertEqual(endQuote, json.hasEndQuote());
                        test.assertEqual(expectedText, json.getText());
                        test.assertEqual(expectedText.length, json.getLength());
                        test.assertEqual(expectedValue, json.getValue());
                    });
                }

                createTest(
                    Iterable.create([
                        Token.doubleQuote(),
                    ]),
                    false,
                    `"`,
                    ``,
                );
                createTest(
                    Iterable.create([
                        Token.doubleQuote(),
                        Token.doubleQuote(),
                    ]),
                    true,
                    `""`,
                    ``,
                );
                createTest(
                    Iterable.create([
                        Token.doubleQuote(),
                        Token.letters("hello"),
                        Token.doubleQuote(),
                    ]),
                    true,
                    `"hello"`,
                    `hello`,
                );
            });
        });
    });
}
test(createTestRunner());