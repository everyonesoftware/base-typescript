import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Iterable, JavascriptIterable, JsonDataArray, JsonDataBoolean, JsonDataNull, PreConditionError, JsonDataType, JsonDataValue, List, WrongTypeError, JsonDataString, JsonDataNumber, JsonDataObject, Type } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDataArray.ts", () =>
    {
        runner.testType(JsonDataArray.name, () =>
        {
            runner.testFunction("create(JavascriptIterable<JsonDataType>|undefined)", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const json: JsonDataArray = JsonDataArray.create();
                    test.assertEqual(json.getCount(), 0);
                    test.assertEqual(json.toString(), "[]");
                });

                function createErrorTest(testName: string, elements: JavascriptIterable<JsonDataType>, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => JsonDataArray.create(elements), expected);
                    });
                }

                createErrorTest(
                    "with undefined element",
                    [undefined!],
                    new PreConditionError(
                        "Expression: value",
                        "Expected: not undefined",
                        "Actual: undefined",
                    ));

                function createTest(testName: string, elements: JavascriptIterable<JsonDataType>): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        const json: JsonDataArray = JsonDataArray.create(elements);

                        const elementsIterable: Iterable<JsonDataValue> = Iterable.create(elements).map(JsonDataValue.toJsonDataValue);
                        test.assertEqual(json.getCount(), elementsIterable.getCount());
                        let index: number = 0;
                        for (const element of elementsIterable)
                        {
                            test.assertEqual(json.get(index), element);
                            index++;
                        }
                    });
                }

                createTest("with undefined elements", undefined!);
                createTest("with no elements", []);
                createTest("with one element", [JsonDataNull.create()]);
                createTest("with one null element", [null]);
                createTest("with two elements", [JsonDataBoolean.create(false), JsonDataNull.create()]);
            });

            runner.testFunction("add(JsonDataType)", () =>
            {
                runner.test("with undefined", (test: Test) =>
                {
                    const json: JsonDataArray = JsonDataArray.create();
                    test.assertThrows(() => json.add(undefined!), new PreConditionError(
                        "Expression: value",
                        "Expected: not undefined",
                        "Actual: undefined",
                    ));
                    test.assertFalse(json.any());
                });

                function addTest(initialValues: Iterable<JsonDataType>, toAdd: JsonDataType, expected: Iterable<JsonDataType>): void
                {
                    runner.test(`with ${runner.andList([initialValues, toAdd].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const addResult: JsonDataArray = array.add(toAdd);
                        test.assertSame(addResult, array);
                        test.assertEqual(array, JsonDataArray.create(expected));
                    });
                }

                addTest(
                    List.create<JsonDataType>(),
                    50,
                    List.create<JsonDataType>([50]),
                );
            });

            runner.testFunction("addAll(JavascriptIterable<JsonDataType>)", () =>
            {
                function addAllErrorTest(initialValues: Iterable<JsonDataType>, toAdd: Iterable<JsonDataType>, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, toAdd].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.addAll(toAdd), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                addAllErrorTest(
                    List.create(),
                    undefined!,
                    new PreConditionError(
                        "Expression: values",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                addAllErrorTest(
                    List.create(),
                    null!,
                    new PreConditionError(
                        "Expression: values",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );

                function addAllTest(initialValues: Iterable<JsonDataType>, toAdd: Iterable<JsonDataType>, expected: Iterable<JsonDataType>): void
                {
                    runner.test(`with ${runner.andList([initialValues, toAdd].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const addResult: JsonDataArray = array.addAll(toAdd);
                        test.assertSame(addResult, array);
                        test.assertEqual(array, JsonDataArray.create(expected));
                    });
                }

                addAllTest(
                    List.create<JsonDataType>(),
                    List.create<JsonDataType>([50]),
                    List.create<JsonDataType>([50]),
                );
                addAllTest(
                    List.create<JsonDataType>([1, 2, false, true]),
                    List.create<JsonDataType>(["hello", "there"]),
                    List.create<JsonDataType>([1, 2, false, true, "hello", "there"]),
                );
            });

            runner.testFunction("insert(number,JsonDataType)", () =>
            {
                function insertErrorTest(initialValues: Iterable<JsonDataType>, index: number, toInsert: JsonDataType, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index, toInsert].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.insert(index, toInsert), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                insertErrorTest(
                    List.create(),
                    undefined!,
                    50,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: undefined",
                    ),
                );
                insertErrorTest(
                    List.create(),
                    null!,
                    50,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: null",
                    ),
                );
                insertErrorTest(
                    List.create(),
                    -1,
                    50,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                insertErrorTest(
                    List.create(),
                    1,
                    50,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: 1",
                    ),
                );
                insertErrorTest(
                    List.create(),
                    0,
                    undefined!,
                    new PreConditionError(
                        "Expression: value",
                        "Expected: not undefined",
                        "Actual: undefined",
                    ),
                );

                function insertTest(initialValues: Iterable<JsonDataType>, index: number, toInsert: JsonDataType, expected: Iterable<JsonDataType>): void
                {
                    runner.test(`with ${runner.andList([initialValues, index, toInsert].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const insertResult: JsonDataArray = array.insert(index, toInsert);
                        test.assertSame(array, insertResult);
                        test.assertEqual(array, JsonDataArray.create(expected));
                    });
                }

                insertTest(
                    List.create<JsonDataType>(),
                    0,
                    10,
                    List.create<JsonDataType>([10]),
                );
                insertTest(
                    List.create<JsonDataType>([1, 2, 3]),
                    0,
                    0,
                    List.create<JsonDataType>([0, 1, 2, 3]),
                );
            });

            runner.testFunction("getNull(index)", () =>
            {
                function getNullErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.getNull(index).await(), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                getNullErrorTest(
                    List.create<JsonDataType>(),
                    undefined!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNullErrorTest(
                    List.create<JsonDataType>(),
                    null!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNullErrorTest(
                    List.create<JsonDataType>(),
                    -1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNullErrorTest(
                    List.create<JsonDataType>(),
                    0,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNullErrorTest(
                    List.create<JsonDataType>(),
                    1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNullErrorTest(
                    List.create<JsonDataType>([false]),
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getNullErrorTest(
                    List.create<JsonDataType>([false]),
                    1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: 1",
                    ),
                );
                getNullErrorTest(
                    List.create<JsonDataType>([false]),
                    0,
                    new WrongTypeError("Expected null but found boolean."),
                );

                function getNullTest(initialValues: Iterable<JsonDataType>, index: number): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const jsonNull: JsonDataNull = array.getNull(index).await();
                        test.assertNotUndefinedAndNotNull(jsonNull);
                    });
                }

                getNullTest(
                    List.create<JsonDataType>([null]),
                    0,
                );
                getNullTest(
                    List.create<JsonDataType>([null, 1, 2, null, 4]),
                    0,
                );
                getNullTest(
                    List.create<JsonDataType>([null, 1, 2, null, 4]),
                    3,
                );
            });

            runner.testFunction("getString(index)", () =>
            {
                function getStringErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.getString(index).await(), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                getStringErrorTest(
                    List.create<JsonDataType>(),
                    undefined!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringErrorTest(
                    List.create<JsonDataType>(),
                    null!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringErrorTest(
                    List.create<JsonDataType>(),
                    -1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringErrorTest(
                    List.create<JsonDataType>(),
                    0,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringErrorTest(
                    List.create<JsonDataType>(),
                    1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringErrorTest(
                    List.create<JsonDataType>([false]),
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getStringErrorTest(
                    List.create<JsonDataType>([false]),
                    1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: 1",
                    ),
                );
                getStringErrorTest(
                    List.create<JsonDataType>([20]),
                    0,
                    new WrongTypeError("Expected string but found number."),
                );

                function getStringTest(initialValues: Iterable<JsonDataType>, index: number, expected: JsonDataString): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const jsonString: JsonDataString = array.getString(index).await();
                        test.assertEqual(jsonString, expected);
                    });
                }

                getStringTest(
                    List.create<JsonDataType>(["hello"]),
                    0,
                    JsonDataString.create("hello"),
                );
                getStringTest(
                    List.create<JsonDataType>(["hello", 1, 2, "there", 4]),
                    0,
                    JsonDataString.create("hello"),
                );
                getStringTest(
                    List.create<JsonDataType>(["hello", 1, 2, "there", 4]),
                    3,
                    JsonDataString.create("there"),
                );
            });

            runner.testFunction("getStringValue(index)", () =>
            {
                function getStringValueErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.getStringValue(index).await(), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                getStringValueErrorTest(
                    List.create<JsonDataType>(),
                    undefined!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringValueErrorTest(
                    List.create<JsonDataType>(),
                    null!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringValueErrorTest(
                    List.create<JsonDataType>(),
                    -1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringValueErrorTest(
                    List.create<JsonDataType>(),
                    0,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringValueErrorTest(
                    List.create<JsonDataType>(),
                    1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getStringValueErrorTest(
                    List.create<JsonDataType>([false]),
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getStringValueErrorTest(
                    List.create<JsonDataType>([false]),
                    1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: 1",
                    ),
                );
                getStringValueErrorTest(
                    List.create<JsonDataType>([20]),
                    0,
                    new WrongTypeError("Expected string but found number."),
                );

                function getStringValueTest(initialValues: Iterable<JsonDataType>, index: number, expected: string): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const value: string = array.getStringValue(index).await();
                        test.assertEqual(value, expected);
                    });
                }

                getStringValueTest(
                    List.create<JsonDataType>(["hello"]),
                    0,
                    "hello",
                );
                getStringValueTest(
                    List.create<JsonDataType>(["hello", 1, 2, "there", 4]),
                    0,
                    "hello",
                );
                getStringValueTest(
                    List.create<JsonDataType>(["hello", 1, 2, "there", 4]),
                    3,
                    "there",
                );
            });

            runner.testFunction("getBoolean(index)", () =>
            {
                function getBooleanErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.getBoolean(index).await(), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                getBooleanErrorTest(
                    List.create<JsonDataType>(),
                    undefined!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanErrorTest(
                    List.create<JsonDataType>(),
                    null!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanErrorTest(
                    List.create<JsonDataType>(),
                    -1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanErrorTest(
                    List.create<JsonDataType>(),
                    0,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanErrorTest(
                    List.create<JsonDataType>(),
                    1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanErrorTest(
                    List.create<JsonDataType>([false]),
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getBooleanErrorTest(
                    List.create<JsonDataType>([false]),
                    1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: 1",
                    ),
                );
                getBooleanErrorTest(
                    List.create<JsonDataType>([20]),
                    0,
                    new WrongTypeError("Expected boolean but found number."),
                );

                function getBooleanTest(initialValues: Iterable<JsonDataType>, index: number, expected: JsonDataBoolean): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const jsonBoolean: JsonDataBoolean = array.getBoolean(index).await();
                        test.assertEqual(jsonBoolean, expected);
                    });
                }

                getBooleanTest(
                    List.create<JsonDataType>([false]),
                    0,
                    JsonDataBoolean.create(false),
                );
                getBooleanTest(
                    List.create<JsonDataType>([true, 1, 2, false, 4]),
                    0,
                    JsonDataBoolean.create(true),
                );
                getBooleanTest(
                    List.create<JsonDataType>([true, 1, 2, false, 4]),
                    3,
                    JsonDataBoolean.create(false),
                );
            });

            runner.testFunction("getBooleanValue(index)", () =>
            {
                function getBooleanValueErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.getBooleanValue(index).await(), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                getBooleanValueErrorTest(
                    List.create<JsonDataType>(),
                    undefined!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanValueErrorTest(
                    List.create<JsonDataType>(),
                    null!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanValueErrorTest(
                    List.create<JsonDataType>(),
                    -1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanValueErrorTest(
                    List.create<JsonDataType>(),
                    0,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanValueErrorTest(
                    List.create<JsonDataType>(),
                    1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getBooleanValueErrorTest(
                    List.create<JsonDataType>([false]),
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getBooleanValueErrorTest(
                    List.create<JsonDataType>([false]),
                    1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: 1",
                    ),
                );
                getBooleanValueErrorTest(
                    List.create<JsonDataType>([20]),
                    0,
                    new WrongTypeError("Expected boolean but found number."),
                );

                function getBooleanValueTest(initialValues: Iterable<JsonDataType>, index: number, expected: boolean): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const value: boolean = array.getBooleanValue(index).await();
                        test.assertEqual(value, expected);
                    });
                }

                getBooleanValueTest(
                    List.create<JsonDataType>([true]),
                    0,
                    true,
                );
                getBooleanValueTest(
                    List.create<JsonDataType>([false, 1, 2, true, 4]),
                    0,
                    false,
                );
                getBooleanValueTest(
                    List.create<JsonDataType>([false, 1, 2, true, 4]),
                    3,
                    true,
                );
            });

            runner.testFunction("getNumber(index)", () =>
            {
                function getNumberErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.getNumber(index).await(), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                getNumberErrorTest(
                    List.create<JsonDataType>(),
                    undefined!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberErrorTest(
                    List.create<JsonDataType>(),
                    null!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberErrorTest(
                    List.create<JsonDataType>(),
                    -1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberErrorTest(
                    List.create<JsonDataType>(),
                    0,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberErrorTest(
                    List.create<JsonDataType>(),
                    1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberErrorTest(
                    List.create<JsonDataType>([false]),
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getNumberErrorTest(
                    List.create<JsonDataType>([false]),
                    1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: 1",
                    ),
                );
                getNumberErrorTest(
                    List.create<JsonDataType>(["oops"]),
                    0,
                    new WrongTypeError("Expected number but found string."),
                );

                function getNumberTest(initialValues: Iterable<JsonDataType>, index: number, expected: JsonDataNumber): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const jsonNumber: JsonDataNumber = array.getNumber(index).await();
                        test.assertEqual(jsonNumber, expected);
                    });
                }

                getNumberTest(
                    List.create<JsonDataType>([33]),
                    0,
                    JsonDataNumber.create(33),
                );
                getNumberTest(
                    List.create<JsonDataType>([-10, 1, 2, 30, 4]),
                    0,
                    JsonDataNumber.create(-10),
                );
                getNumberTest(
                    List.create<JsonDataType>([-10, 1, 2, 30, 4]),
                    3,
                    JsonDataNumber.create(30),
                );
            });

            runner.testFunction("getNumberValue(index)", () =>
            {
                function getNumberValueErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.getNumberValue(index).await(), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                getNumberValueErrorTest(
                    List.create<JsonDataType>(),
                    undefined!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberValueErrorTest(
                    List.create<JsonDataType>(),
                    null!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberValueErrorTest(
                    List.create<JsonDataType>(),
                    -1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberValueErrorTest(
                    List.create<JsonDataType>(),
                    0,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberValueErrorTest(
                    List.create<JsonDataType>(),
                    1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getNumberValueErrorTest(
                    List.create<JsonDataType>([false]),
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getNumberValueErrorTest(
                    List.create<JsonDataType>([false]),
                    1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: 1",
                    ),
                );
                getNumberValueErrorTest(
                    List.create<JsonDataType>([{}]),
                    0,
                    new WrongTypeError("Expected number but found object."),
                );

                function getNumberValueTest(initialValues: Iterable<JsonDataType>, index: number, expected: number): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const value: number = array.getNumberValue(index).await();
                        test.assertEqual(value, expected);
                    });
                }

                getNumberValueTest(
                    List.create<JsonDataType>([15]),
                    0,
                    15,
                );
                getNumberValueTest(
                    List.create<JsonDataType>([-10, 1, 2, 30, 4]),
                    0,
                    -10,
                );
                getNumberValueTest(
                    List.create<JsonDataType>([-10, 1, 2, 30, 4]),
                    3,
                    30,
                );
            });

            runner.testFunction("getObject(index)", () =>
            {
                function getObjectErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.getObject(index).await(), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                getObjectErrorTest(
                    List.create<JsonDataType>(),
                    undefined!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getObjectErrorTest(
                    List.create<JsonDataType>(),
                    null!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getObjectErrorTest(
                    List.create<JsonDataType>(),
                    -1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getObjectErrorTest(
                    List.create<JsonDataType>(),
                    0,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getObjectErrorTest(
                    List.create<JsonDataType>(),
                    1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getObjectErrorTest(
                    List.create<JsonDataType>([false]),
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getObjectErrorTest(
                    List.create<JsonDataType>([false]),
                    1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: 1",
                    ),
                );
                getObjectErrorTest(
                    List.create<JsonDataType>(["oops"]),
                    0,
                    new WrongTypeError("Expected object but found string."),
                );

                function getObjectTest(initialValues: Iterable<JsonDataType>, index: number, expected: JsonDataObject): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const jsonObject: JsonDataObject = array.getObject(index).await();
                        test.assertEqual(jsonObject, expected);
                    });
                }

                getObjectTest(
                    List.create<JsonDataType>([{}]),
                    0,
                    JsonDataObject.create(),
                );
                getObjectTest(
                    List.create<JsonDataType>([{a:0}, 1, 2, {b:3}, 4]),
                    0,
                    JsonDataObject.create({a:0}),
                );
                getObjectTest(
                    List.create<JsonDataType>([{a:0}, 1, 2, {b:3}, 4]),
                    3,
                    JsonDataObject.create({b:3}),
                );
            });

            runner.testFunction("getArray(index)", () =>
            {
                function getArrayErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        test.assertThrows(() => array.getArray(index).await(), expected);
                        test.assertEqual(array, JsonDataArray.create(initialValues));
                    });
                }

                getArrayErrorTest(
                    List.create<JsonDataType>(),
                    undefined!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getArrayErrorTest(
                    List.create<JsonDataType>(),
                    null!,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getArrayErrorTest(
                    List.create<JsonDataType>(),
                    -1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getArrayErrorTest(
                    List.create<JsonDataType>(),
                    0,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getArrayErrorTest(
                    List.create<JsonDataType>(),
                    1,
                    new PreConditionError(
                        "Expression: count",
                        "Expected: greater than or equal to 1",
                        "Actual: 0",
                    ),
                );
                getArrayErrorTest(
                    List.create<JsonDataType>([false]),
                    -1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: -1",
                    ),
                );
                getArrayErrorTest(
                    List.create<JsonDataType>([false]),
                    1,
                    new PreConditionError(
                        "Expression: index",
                        "Expected: 0",
                        "Actual: 1",
                    ),
                );
                getArrayErrorTest(
                    List.create<JsonDataType>(["oops"]),
                    0,
                    new WrongTypeError("Expected array but found string."),
                );

                function getArrayTest(initialValues: Iterable<JsonDataType>, index: number, expected: JsonDataArray): void
                {
                    runner.test(`with ${runner.andList([initialValues, index].map(runner.toString))}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const jsonArray: JsonDataArray = array.getArray(index).await();
                        test.assertEqual(jsonArray, expected);
                    });
                }

                getArrayTest(
                    List.create<JsonDataType>([[15]]),
                    0,
                    JsonDataArray.create([15]),
                );
                getArrayTest(
                    List.create<JsonDataType>([[-10], 1, 2, [30], 4]),
                    0,
                    JsonDataArray.create([-10]),
                );
                getArrayTest(
                    List.create<JsonDataType>([[-10], 1, 2, [30], 4]),
                    3,
                    JsonDataArray.create([30]),
                );
            });

            runner.testFunction("getTypeDisplayName()", (test: Test) =>
            {
                const jsonArray: JsonDataArray = JsonDataArray.create();
                test.assertEqual("array", jsonArray.getTypeDisplayName());
            });

            runner.testFunction("as(Type<T>,string)", () =>
            {
                function asErrorTest<T extends JsonDataType>(type: Type<T>, typeDisplayName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([type, typeDisplayName].map(runner.toString))}`, (test: Test) =>
                    {
                        const jsonArray: JsonDataArray = JsonDataArray.create();
                        test.assertThrows(() => jsonArray.as(type, typeDisplayName).await(), expected);
                    });
                }

                asErrorTest(
                    JsonDataNull,
                    JsonDataNull.typeDisplayName,
                    new WrongTypeError("Expected null but found array."),
                );
                asErrorTest(
                    JsonDataBoolean,
                    JsonDataBoolean.typeDisplayName,
                    new WrongTypeError("Expected boolean but found array."),
                );
                asErrorTest(
                    JsonDataNumber,
                    JsonDataNumber.typeDisplayName,
                    new WrongTypeError("Expected number but found array."));
                asErrorTest(
                    JsonDataString,
                    JsonDataString.typeDisplayName,
                    new WrongTypeError("Expected string but found array."),
                );
                asErrorTest(
                    JsonDataObject,
                    JsonDataObject.typeDisplayName,
                    new WrongTypeError("Expected object but found array."),
                );

                function asTest<T extends JsonDataType>(type: Type<T>, typeDisplayName: string): void
                {
                    runner.test(`with ${runner.andList([type, typeDisplayName].map(runner.toString))}`, (test: Test) =>
                    {
                        const jsonArray: JsonDataArray = JsonDataArray.create();
                        test.assertSame(jsonArray.as(type, typeDisplayName).await(), jsonArray);
                    });
                }

                asTest(JsonDataArray, JsonDataArray.typeDisplayName);
            });
        });
    });
}
test(createTestRunner());