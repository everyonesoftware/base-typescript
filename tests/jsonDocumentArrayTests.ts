import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { Iterable, JsonDocumentArray, JsonDocumentBoolean, JsonDocumentNumber, PreConditionError, Token } from "../sources";
import { JsonDocumentValue } from "../sources/jsonDocumentValue";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDocumentArray.ts", () =>
    {
        runner.testType(JsonDocumentArray.name, () =>
        {
            runner.testFunction("create(Iterable<Token|JsonDocumentSegment>)", () =>
            {
                function createErrorTest(tokensAndSegments: Iterable<Token | JsonDocumentValue>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(tokensAndSegments)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDocumentArray.create(tokensAndSegments), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError(
                    "Expression: tokensAndValues",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, new PreConditionError(
                    "Expression: tokensAndValues",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                createErrorTest(Iterable.create(), new PreConditionError(
                    "Expression: tokensAndValues",
                    "Expected: not empty",
                    "Actual: []",
                ));

                function createTest(tokensAndSegments: Iterable<Token | JsonDocumentValue>, expectedText: string): void
                {
                    runner.test(`with ${runner.toString(tokensAndSegments)}`, (test: Test) =>
                    {
                        const json: JsonDocumentArray = JsonDocumentArray.create(tokensAndSegments);
                        test.assertNotUndefinedAndNotNull(json);
                        test.assertEqual(expectedText, json.getText());
                        test.assertEqual(expectedText.length, json.getLength());
                    });
                }

                createTest(
                    Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                    ]),
                    `[`,
                );
                createTest(
                    Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                        Token.rightSquareBrace(),
                    ]),
                    `[]`,
                );
                createTest(
                    Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                        Token.comma(),
                        Token.rightSquareBrace(),
                    ]),
                    `[,]`,
                );
                createTest(
                    Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                        JsonDocumentBoolean.create(Token.letters("false")),
                        Token.rightSquareBrace(),
                    ]),
                    `[false]`,
                );
                createTest(
                    Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                        JsonDocumentBoolean.create(Token.letters("true")),
                        Token.comma(),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("123")])),
                        Token.rightSquareBrace(),
                    ]),
                    `[true,123]`,
                );
            });
        });
    });
}
test(createTestRunner());