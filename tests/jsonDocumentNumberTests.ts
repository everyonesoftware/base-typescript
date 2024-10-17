import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { Iterable, JsonDocumentNumber, PreConditionError, Token } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDocumentNumber.ts", () =>
    {
        runner.testType(JsonDocumentNumber.name, () =>
        {
            runner.testFunction("create(Iterable<Token>)", () =>
            {
                function createErrorTest(tokens: Iterable<Token>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(tokens)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDocumentNumber.create(tokens), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError(
                    "Expression: tokens",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, new PreConditionError(
                    "Expression: tokens",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                createErrorTest(Iterable.create(), new PreConditionError(
                    "Expression: tokens",
                    "Expected: not empty",
                    "Actual: []",
                ));

                function createTest(tokens: Iterable<Token>, expectedText: string, expectedValue: number): void
                {
                    runner.test(`with ${runner.toString(tokens)}`, (test: Test) =>
                    {
                        const json: JsonDocumentNumber = JsonDocumentNumber.create(tokens);
                        test.assertNotUndefinedAndNotNull(json);
                        test.assertEqual(expectedText, json.getText());
                        test.assertEqual(expectedText.length, json.getLength());
                        test.assertEqual(expectedValue, json.getValue());
                    });
                }

                createTest(
                    Iterable.create([
                        Token.digits("123"),
                    ]),
                    "123",
                    123,
                );
                createTest(
                    Iterable.create([
                        Token.digits("123"),
                        Token.period(),
                        Token.digits("45"),
                    ]),
                    "123.45",
                    123.45,
                );
            });
        });
    });
}
test(createTestRunner());