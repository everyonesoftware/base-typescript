import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { escapeAndQuote, JavascriptIterable, JsonDocumentNumber, JsonDocumentProperty, JsonDocumentString, JsonDocumentValue, PreConditionError, Token } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDocumentProperty.ts", () =>
    {
        runner.testType(JsonDocumentProperty.name, () =>
        {
            runner.testFunction("create(JavascriptIterable<Token|JsonDocumentValue>", () =>
            {
                function createErrorTest(tokensAndValues: JavascriptIterable<Token|JsonDocumentValue>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(tokensAndValues)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDocumentProperty.create(tokensAndValues), expected);
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
                createErrorTest([], new PreConditionError(
                    "Expression: tokensAndValues",
                    "Expected: not empty",
                    "Actual: []",
                ));
                createErrorTest([Token.letters("hello")], new PreConditionError(
                    "Expression: Iterable.first(tokensAndValues).await()",
                    "Expected: instance of JsonDocumentString",
                    "Actual: {\"type\":\"Letters\",\"text\":\"hello\"}",
                ));

                function createTest(tokensAndValues: JavascriptIterable<Token|JsonDocumentValue>, expectedName: string, expectedLength: number): void
                {
                    runner.test(`with ${runner.toString(tokensAndValues)}`, (test: Test) =>
                    {
                        const property: JsonDocumentProperty = JsonDocumentProperty.create(tokensAndValues);
                        test.assertNotUndefinedAndNotNull(property);
                        test.assertEqual(expectedName, property.getName());
                        test.assertEqual(expectedLength, property.getLength());
                    });
                }

                createTest(
                    [
                        JsonDocumentString.parse(`"hello"`).await()!,
                    ],
                    "hello",
                    7,
                );
                createTest(
                    [
                        JsonDocumentString.parse(`"hello there"`).await()!,
                    ],
                    "hello there",
                    13,
                );
                createTest(
                    [
                        JsonDocumentString.parse(`"a"`).await()!,
                        Token.whitespace("   "),
                        Token.colon(),
                    ],
                    "a",
                    7,
                );
                createTest(
                    [
                        JsonDocumentString.parse(`"a"`).await()!,
                        Token.whitespace("   "),
                        Token.colon(),
                        JsonDocumentNumber.parse("532").await()!,
                    ],
                    "a",
                    10,
                );
            });

            runner.testFunction("parse()", () =>
            {
                function parseErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDocumentProperty.parse(text).await(), expected);
                    });
                }

                parseErrorTest(undefined!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                parseErrorTest(null!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function createTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const property: JsonDocumentProperty | undefined = JsonDocumentProperty.parse(text).await();
                        test.assertNotUndefinedAndNotNull(property);
                        test.assertEqual(text, property.getText());
                        test.assertEqual(text, property.toString());
                    });
                }

                createTest(`"hello":"there"`);
            });

            runner.testFunction("getValue()", () =>
            {
                function getValueTest(property: JsonDocumentProperty, expected: JsonDocumentValue | undefined): void
                {
                    runner.test(`with ${escapeAndQuote(property.getText())}`, (test: Test) =>
                    {
                        test.assertEqual(expected, property.getValue());
                    });
                }

                getValueTest(
                    JsonDocumentProperty.parse(`"a"`, () => {}).await()!,
                    undefined,
                );
                getValueTest(
                    JsonDocumentProperty.parse(`"a":`, () => {}).await()!,
                    undefined,
                );
                getValueTest(
                    JsonDocumentProperty.parse(`"a" :`, () => {}).await()!,
                    undefined,
                );
                getValueTest(
                    JsonDocumentProperty.parse(`"a": `, () => {}).await()!,
                    undefined,
                );
                getValueTest(
                    JsonDocumentProperty.parse(`"a":"b"`).await()!,
                    JsonDocumentString.parse(`"b"`).await()!,
                );
                getValueTest(
                    JsonDocumentProperty.parse(`"a" :"b"`).await()!,
                    JsonDocumentString.parse(`"b"`).await()!,
                );
                getValueTest(
                    JsonDocumentProperty.parse(`"a": 50`).await()!,
                    JsonDocumentNumber.parse(`50`).await()!,
                );
            });
        });
    });
}
test(createTestRunner());