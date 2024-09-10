import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Iterable, JavascriptIterable, JsonDataArray, PreConditionError, JsonDataType, List, WrongTypeError, JsonDataObject } from "../sources";
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

                

                function createTest(testName: string, elements: JavascriptIterable<JsonDataType>): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        const json: JsonDataArray = JsonDataArray.create(elements);

                        const elementsIterable: Iterable<JsonDataType> = Iterable.create(elements);
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
                createTest("with one boolean element", [false]);
                createTest("with one null element", [null]);
                createTest("with two elements", [false, null]);
                
                // I'm not going to validate the entire array's contents for performance reasons.
                createTest("with one undefined element", [undefined!]);
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
                    runner.test(`with ${runner.andList([initialValues, toAdd])}`, (test: Test) =>
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
                    runner.test(`with ${runner.andList([initialValues, toAdd])}`, (test: Test) =>
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
                    runner.test(`with ${runner.andList([initialValues, toAdd])}`, (test: Test) =>
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
                    runner.test(`with ${runner.andList([initialValues, index, toInsert])}`, (test: Test) =>
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
                    runner.test(`with ${runner.andList([initialValues, index, toInsert])}`, (test: Test) =>
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
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
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
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const json: null = array.getNull(index).await();
                        test.assertNull(json);
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
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
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

                function getStringTest(initialValues: Iterable<JsonDataType>, index: number, expected: string): void
                {
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const json: string = array.getString(index).await();
                        test.assertEqual(json, expected);
                    });
                }

                getStringTest(
                    List.create<JsonDataType>(["hello"]),
                    0,
                    "hello",
                );
                getStringTest(
                    List.create<JsonDataType>(["hello", 1, 2, "there", 4]),
                    0,
                    "hello",
                );
                getStringTest(
                    List.create<JsonDataType>(["hello", 1, 2, "there", 4]),
                    3,
                    "there",
                );
            });

            runner.testFunction("getBoolean(index)", () =>
            {
                function getBooleanErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
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

                function getBooleanTest(initialValues: Iterable<JsonDataType>, index: number, expected: boolean): void
                {
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const value: boolean = array.getBoolean(index).await();
                        test.assertEqual(value, expected);
                    });
                }

                getBooleanTest(
                    List.create<JsonDataType>([false]),
                    0,
                    false,
                );
                getBooleanTest(
                    List.create<JsonDataType>([true, 1, 2, false, 4]),
                    0,
                    true,
                );
                getBooleanTest(
                    List.create<JsonDataType>([true, 1, 2, false, 4]),
                    3,
                    false,
                );
            });

            runner.testFunction("getNumber(index)", () =>
            {
                function getNumberErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
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

                function getNumberTest(initialValues: Iterable<JsonDataType>, index: number, expected: number): void
                {
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
                    {
                        const array: JsonDataArray = JsonDataArray.create(initialValues);
                        const json: number = array.getNumber(index).await();
                        test.assertEqual(json, expected);
                    });
                }

                getNumberTest(
                    List.create<JsonDataType>([33]),
                    0,
                    33,
                );
                getNumberTest(
                    List.create<JsonDataType>([-10, 1, 2, 30, 4]),
                    0,
                    -10,
                );
                getNumberTest(
                    List.create<JsonDataType>([-10, 1, 2, 30, 4]),
                    3,
                    30,
                );
            });

            runner.testFunction("getObject(index)", () =>
            {
                function getObjectErrorTest(initialValues: Iterable<JsonDataType>, index: number, expected: Error): void
                {
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
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
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
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
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
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
                    runner.test(`with ${runner.andList([initialValues, index])}`, (test: Test) =>
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
        });
    });
}
test(createTestRunner());