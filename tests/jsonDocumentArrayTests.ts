import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { Iterable, JavascriptIterable, JsonDocumentArray, JsonDocumentBoolean, JsonDocumentNumber, JsonDocumentObject, JsonDocumentString, JsonDocumentValue, PreConditionError, Token, WrongTypeError } from "../sources";

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

            runner.testFunction("iterateElements()", () =>
            {
                function iterateElementsTest(array: JsonDocumentArray, expected: JavascriptIterable<JsonDocumentValue | undefined>): void
                {
                    runner.test(`with ${runner.toString(array.getText())}`, (test: Test) =>
                    {
                        test.assertEqual(expected, array.iterateElements().toArray());
                    });
                }

                iterateElementsTest(
                    JsonDocumentArray.parse("[", () => {}).await()!,
                    [],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[]").await()!,
                    [],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[,", () => {}).await()!,
                    [
                        undefined,
                        undefined,
                    ],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[,]", () => {}).await()!,
                    [
                        undefined,
                        undefined,
                    ],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[1", () => {}).await()!,
                    [JsonDocumentNumber.parse("1").await()!],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[1]").await()!,
                    [JsonDocumentNumber.parse("1").await()!],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[1,", () => {}).await()!,
                    [
                        JsonDocumentNumber.parse("1").await()!,
                        undefined,
                    ],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[1,]", () => {}).await()!,
                    [
                        JsonDocumentNumber.parse("1").await()!,
                        undefined,
                    ],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[1,2", () => {}).await()!,
                    [
                        JsonDocumentNumber.parse("1").await()!,
                        JsonDocumentNumber.parse("2").await()!,
                    ],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[1,2]").await()!,
                    [
                        JsonDocumentNumber.parse("1").await()!,
                        JsonDocumentNumber.parse("2").await()!,
                    ],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[1 2", () => {}).await()!,
                    [
                        JsonDocumentNumber.parse("1").await()!,
                        JsonDocumentNumber.parse("2").await()!,
                    ],
                );
                iterateElementsTest(
                    JsonDocumentArray.parse("[1 2]", () => {}).await()!,
                    [
                        JsonDocumentNumber.parse("1").await()!,
                        JsonDocumentNumber.parse("2").await()!,
                    ],
                );
            });

            runner.testFunction("getValue()", () =>
            {
                function getValueErrorTest(array: JsonDocumentArray, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => array.getValue(index).await(), expected);
                    });
                }

                getValueErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    null!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    0.1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: 0.1",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    0,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: -1",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    2,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: 2",
                    ),
                );

                function getValueTest(array: JsonDocumentArray, index: number, expected: JsonDocumentValue | undefined): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertEqual(expected, array.getValue(index).await());
                    });
                }

                getValueTest(
                    JsonDocumentArray.parse(`["a"]`).await()!,
                    0,
                    JsonDocumentString.parse(`"a"`).await(),
                );
                getValueTest(
                    JsonDocumentArray.parse(`["a", 2]`).await()!,
                    1,
                    JsonDocumentNumber.parse(`2`).await()!,
                );
                getValueTest(
                    JsonDocumentArray.parse(`[true,"a", 2]`).await()!,
                    0,
                    JsonDocumentBoolean.create(Token.letters("true")),
                );
            });

            runner.testFunction("getStringValue()", () =>
            {
                function getStringValueErrorTest(array: JsonDocumentArray, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => array.getStringValue(index).await(), expected);
                    });
                }

                getStringValueErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    10,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: undefined",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    null!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: null",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    0.1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: 0.1",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: -1",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    2,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: 2",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentArray.parse("[,]", () => {}).await()!,
                    0,
                    new WrongTypeError("Expected value at index 0 to be a string, but was undefined instead."),
                );

                function getStringValueTest(array: JsonDocumentArray, index: number, expected: JsonDocumentString): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertEqual(expected, array.getStringValue(index).await());
                    });
                }

                getStringValueTest(
                    JsonDocumentArray.parse(`["a"]`).await()!,
                    0,
                    JsonDocumentString.parse(`"a"`).await()!,
                );
                getStringValueTest(
                    JsonDocumentArray.parse(`[1, "b", 2]`).await()!,
                    1,
                    JsonDocumentString.parse(`"b"`).await()!,
                );
            });

            runner.testFunction("getString()", () =>
            {
                function getStringErrorTest(array: JsonDocumentArray, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => array.getString(index).await(), expected);
                    });
                }

                getStringErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    10,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: undefined",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    null!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: null",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    0.1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: 0.1",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: -1",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    2,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: 2",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentArray.parse("[,]", () => {}).await()!,
                    0,
                    new WrongTypeError("Expected value at index 0 to be a string, but was undefined instead."),
                );

                function getStringTest(array: JsonDocumentArray, index: number, expected: string): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertEqual(expected, array.getString(index).await());
                    });
                }

                getStringTest(
                    JsonDocumentArray.parse(`["a"]`).await()!,
                    0,
                    "a",
                );
                getStringTest(
                    JsonDocumentArray.parse(`[1, "b", 2]`).await()!,
                    1,
                    "b",
                );
            });

            runner.testFunction("getBooleanValue()", () =>
            {
                function getBooleanValueErrorTest(array: JsonDocumentArray, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => array.getBooleanValue(index).await(), expected);
                    });
                }

                getBooleanValueErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    10,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: undefined",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    null!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: null",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    0.1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: 0.1",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: -1",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    2,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: 2",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentArray.parse("[,]", () => {}).await()!,
                    0,
                    new WrongTypeError("Expected value at index 0 to be a boolean, but was undefined instead."),
                );

                function getBooleanValueTest(array: JsonDocumentArray, index: number, expected: JsonDocumentBoolean): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertEqual(expected, array.getBooleanValue(index).await());
                    });
                }

                getBooleanValueTest(
                    JsonDocumentArray.parse(`[false]`).await()!,
                    0,
                    JsonDocumentBoolean.create(Token.letters("false")),
                );
                getBooleanValueTest(
                    JsonDocumentArray.parse(`[1, true, 2]`).await()!,
                    1,
                    JsonDocumentBoolean.create(Token.letters("true")),
                );
            });

            runner.testFunction("getBoolean()", () =>
            {
                function getBooleanErrorTest(array: JsonDocumentArray, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => array.getBoolean(index).await(), expected);
                    });
                }

                getBooleanErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    10,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: undefined",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    null!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: null",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    0.1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: 0.1",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: -1",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    2,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: 2",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentArray.parse("[,]", () => {}).await()!,
                    0,
                    new WrongTypeError("Expected value at index 0 to be a boolean, but was undefined instead."),
                );

                function getBooleanTest(array: JsonDocumentArray, index: number, expected: boolean): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertEqual(expected, array.getBoolean(index).await());
                    });
                }

                getBooleanTest(
                    JsonDocumentArray.parse(`[false]`).await()!,
                    0,
                    false,
                );
                getBooleanTest(
                    JsonDocumentArray.parse(`[1, true, 2]`).await()!,
                    1,
                    true,
                );
            });

            runner.testFunction("getNumberValue()", () =>
            {
                function getNumberValueErrorTest(array: JsonDocumentArray, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => array.getNumberValue(index).await(), expected);
                    });
                }

                getNumberValueErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    10,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: undefined",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    null!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: null",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    0.1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: 0.1",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: -1",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    2,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: 2",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentArray.parse("[,]", () => {}).await()!,
                    0,
                    new WrongTypeError("Expected value at index 0 to be a number, but was undefined instead."),
                );

                function getNumberValueTest(array: JsonDocumentArray, index: number, expected: JsonDocumentValue): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertEqual(expected, array.getNumberValue(index).await());
                    });
                }

                getNumberValueTest(
                    JsonDocumentArray.parse(`[5]`).await()!,
                    0,
                    JsonDocumentNumber.parse("5").await()!,
                );
                getNumberValueTest(
                    JsonDocumentArray.parse(`[1, 3, 2]`).await()!,
                    1,
                    JsonDocumentNumber.parse("3").await()!,
                );
            });

            runner.testFunction("getNumber()", () =>
            {
                function getNumberErrorTest(array: JsonDocumentArray, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => array.getNumber(index).await(), expected);
                    });
                }

                getNumberErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    10,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: undefined",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    null!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: null",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    0.1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: 0.1",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: -1",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    2,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: 2",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentArray.parse("[,]", () => {}).await()!,
                    0,
                    new WrongTypeError("Expected value at index 0 to be a number, but was undefined instead."),
                );

                function getNumberTest(array: JsonDocumentArray, index: number, expected: number): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertEqual(expected, array.getNumber(index).await());
                    });
                }

                getNumberTest(
                    JsonDocumentArray.parse(`[5]`).await()!,
                    0,
                    5,
                );
                getNumberTest(
                    JsonDocumentArray.parse(`[1, 3, 2]`).await()!,
                    1,
                    3,
                );
            });

            runner.testFunction("getObject()", () =>
            {
                function getObjectErrorTest(array: JsonDocumentArray, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => array.getObject(index).await(), expected);
                    });
                }

                getObjectErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    10,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: undefined",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    null!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: null",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    0.1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: 0.1",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: -1",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    2,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: 2",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentArray.parse("[,]", () => {}).await()!,
                    0,
                    new WrongTypeError("Expected value at index 0 to be an object, but was undefined instead."),
                );

                function getObjectTest(array: JsonDocumentArray, index: number, expected: JsonDocumentObject): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertEqual(expected, array.getObject(index).await());
                    });
                }

                getObjectTest(
                    JsonDocumentArray.parse(`[{}]`).await()!,
                    0,
                    JsonDocumentObject.parse(`{}`).await()!,
                );
                getObjectTest(
                    JsonDocumentArray.parse(`[1, {"a":"b"}, 2]`).await()!,
                    1,
                    JsonDocumentObject.parse(`{"a":"b"}`).await()!,
                );
            });

            runner.testFunction("getArray()", () =>
            {
                function getArrayErrorTest(array: JsonDocumentArray, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertThrows(() => array.getArray(index).await(), expected);
                    });
                }

                getArrayErrorTest(
                    JsonDocumentArray.parse("[]").await()!,
                    10,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: undefined",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    null!,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: null",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    0.1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: integer",
                        "Actual: 0.1",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentArray.parse("[false]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: -1",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentArray.parse("[\"a\",\"b\"]").await()!,
                    2,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: between 0 and 1",
                        "Actual: 2",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentArray.parse("[,]", () => {}).await()!,
                    0,
                    new WrongTypeError("Expected value at index 0 to be an array, but was undefined instead."),
                );

                function getArrayTest(array: JsonDocumentArray, index: number, expected: JsonDocumentArray): void
                {
                    runner.test(`with ${runner.andList([array.getText(), index])}`, (test: Test) =>
                    {
                        test.assertEqual(expected, array.getArray(index).await());
                    });
                }

                getArrayTest(
                    JsonDocumentArray.parse(`[[]]`).await()!,
                    0,
                    JsonDocumentArray.parse(`[]`).await()!,
                );
                getArrayTest(
                    JsonDocumentArray.parse(`[1, [3], 2]`).await()!,
                    1,
                    JsonDocumentArray.parse(`[3]`).await()!,
                );
            });
        });
    });
}
test(createTestRunner());