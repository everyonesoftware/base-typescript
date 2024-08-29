import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Iterator, JsonDataArray, JsonDataBoolean, JsonDataNull, JsonDataNumber, JsonDataObject, JsonDataProperty, JsonDataString, JsonDataType, JsonDataValue, NotFoundError, PreConditionError, WrongTypeError } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDataObject.ts", () =>
    {
        runner.testType(JsonDataObject, () =>
        {
            runner.testFunction("create(JsonDataObject | { [propertyName: string]: JsonDataType } | undefined)", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const json: JsonDataObject = JsonDataObject.create();
                    test.assertFalse(json.any());
                    test.assertEqual(json.getPropertyCount(), 0);
                    test.assertEqual(json.toString(), "{}");
                });

                runner.test("with undefined", (test: Test) =>
                {
                    const json: JsonDataObject = JsonDataObject.create(undefined);
                    test.assertFalse(json.any());
                    test.assertEqual(json.getPropertyCount(), 0);
                    test.assertEqual(json.toString(), "{}");
                });

                runner.test("with empty object", (test: Test) =>
                {
                    const json: JsonDataObject = JsonDataObject.create({});
                    test.assertFalse(json.any());
                    test.assertEqual(json.getPropertyCount(), 0);
                    test.assertEqual(json.toString(), "{}");
                });

                runner.test("with non-empty object", (test: Test) =>
                {
                    const json: JsonDataObject = JsonDataObject.create({a:1});
                    test.assertTrue(json.any());
                    test.assertEqual(json.getPropertyCount(), 1);
                    test.assertEqual(json.toString(), `{a:1}`);
                });

                runner.test("with empty JsonDataObject", (test: Test) =>
                {
                    const source: JsonDataObject = JsonDataObject.create();
                    const json: JsonDataObject = JsonDataObject.create(source);
                    test.assertFalse(json.any());
                    test.assertEqual(json.getPropertyCount(), 0);
                    test.assertEqual(json.toString(), `{}`);
                    test.assertNotSame(source, json);
                });
            });

            runner.testFunction("any()", () =>
            {
                function anyTest(json: JsonDataObject, expected: boolean): void
                {
                    runner.test(`with ${runner.toString(json)}`, (test: Test) =>
                    {
                        test.assertEqual(expected, json.any());
                    });
                }

                anyTest(JsonDataObject.create(), false);
                anyTest(JsonDataObject.create({a:2}), true);
                anyTest(JsonDataObject.create({a:2,b:4}), true);
            });

            runner.testFunction("getPropertyCount()", () =>
            {
                function getPropertyCountTest(json: JsonDataObject, expected: number): void
                {
                    runner.test(`with ${runner.toString(json)}`, (test: Test) =>
                    {
                        test.assertEqual(expected, json.getPropertyCount());
                    });
                }

                getPropertyCountTest(JsonDataObject.create(), 0);
                getPropertyCountTest(JsonDataObject.create({a:2}), 1);
                getPropertyCountTest(JsonDataObject.create({a:2,b:4}), 2);
            });

            runner.testFunction("iteratePropertyNames()", () =>
            {
                function iteratePropertyNamesTest(json: JsonDataObject, expected: string[]): void
                {
                    runner.test(`with ${runner.toString(json)}`, (test: Test) =>
                    {
                        test.assertEqual(expected, json.iteratePropertyNames().toArray());
                    });
                }

                iteratePropertyNamesTest(JsonDataObject.create(), []);
                iteratePropertyNamesTest(JsonDataObject.create({a:2}), ["a"]);
                iteratePropertyNamesTest(JsonDataObject.create({a:2,b:4}), ["a", "b"]);
            });

            runner.testFunction("iterateProperties()", () =>
            {
                function iteratePropertiesTest(json: JsonDataObject, expected: [string,JsonDataType][]): void
                {
                    runner.test(`with ${runner.toString(json)}`, (test: Test) =>
                    {
                        const properties: Iterator<JsonDataProperty> = json.iterateProperties().start();
                        for (const expectedProperty of expected)
                        {
                            test.assertTrue(properties.hasCurrent());
                            test.assertEqual(expectedProperty[0], properties.getCurrent().getName());
                            test.assertEqual(JsonDataValue.toJsonDataValue(expectedProperty[1]), properties.getCurrent().getValue().await());

                            properties.next();
                        }
                        test.assertFalse(properties.hasCurrent());
                    });
                }

                iteratePropertiesTest(JsonDataObject.create(), []);
                iteratePropertiesTest(JsonDataObject.create({a:2}), [["a",2]]);
                iteratePropertiesTest(JsonDataObject.create({a:2,b:4}), [["a",2], ["b",4]]);
            });

            runner.testFunction("getProperty(string)", () =>
            {
                function getPropertyErrorTest(propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(propertyName)}`, (test: Test) =>
                    {
                        const jsonObject: JsonDataObject = JsonDataObject.create();
                        test.assertThrows(() => jsonObject.getProperty(propertyName), expected);
                        test.assertEqual(0, jsonObject.getPropertyCount());
                    });
                }

                getPropertyErrorTest(
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getPropertyErrorTest(
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );

                runner.test("with property that doesn't exist", (test: Test) =>
                {
                    const jsonObject: JsonDataObject = JsonDataObject.create();
                    const property: JsonDataProperty = jsonObject.getProperty("hello");
                    test.assertNotUndefinedAndNotNull(property);
                    test.assertEqual("hello", property.getName());
                    test.assertThrows(() => property.getValue().await(),
                        new NotFoundError(`The JSON object doesn't contain a property named "hello".`));
                });

                runner.test("with property that exists", (test: Test) =>
                {
                    const jsonObject: JsonDataObject = JsonDataObject.create()
                        .set("a", 50);
                    const property: JsonDataProperty = jsonObject.getProperty("a");
                    test.assertNotUndefinedAndNotNull(property);
                    test.assertEqual("a", property.getName());
                    test.assertEqual(JsonDataNumber.create(50), property.getValue().await());
                });
            });

            runner.testFunction("getTypeDisplayName()", (test: Test) =>
            {
                const jsonObject: JsonDataObject = JsonDataObject.create();
                test.assertEqual("object", jsonObject.getTypeDisplayName());
            });

            runner.testFunction("getString(string)", () =>
            {
                function getStringErrorTest(json: JsonDataObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getString(propertyName).await(),
                            expected);
                    });
                }

                getStringErrorTest(JsonDataObject.create(), undefined!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getStringErrorTest(JsonDataObject.create(), null!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getStringErrorTest(JsonDataObject.create(), "", new NotFoundError(`The JSON object doesn't contain a property named "".`));
                getStringErrorTest(JsonDataObject.create(), "abc", new NotFoundError(`The JSON object doesn't contain a property named "abc".`));
                getStringErrorTest(JsonDataObject.create().set("abc", 5), "abc", new WrongTypeError("Expected string but found number."));

                function getStringTest(json: JsonDataObject, propertyName: string, expected: JsonDataString): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getString(propertyName).await(), expected);
                    });
                }

                getStringTest(JsonDataObject.create().set("def", "ghi"), "def", JsonDataString.create("ghi"));
            });

            runner.testFunction("getStringValue(string)", () =>
            {
                function getStringValueErrorTest(json: JsonDataObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getStringValue(propertyName).await(),
                            expected);
                    });
                }

                getStringValueErrorTest(JsonDataObject.create(), undefined!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getStringValueErrorTest(JsonDataObject.create(), null!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getStringValueErrorTest(JsonDataObject.create(), "", new NotFoundError(`The JSON object doesn't contain a property named "".`));
                getStringValueErrorTest(JsonDataObject.create(), "abc", new NotFoundError(`The JSON object doesn't contain a property named "abc".`));
                getStringValueErrorTest(JsonDataObject.create().set("abc", 5), "abc", new WrongTypeError("Expected string but found number."));

                function getStringValueTest(json: JsonDataObject, propertyName: string, expected: string): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getStringValue(propertyName).await(), expected);
                    });
                }

                getStringValueTest(JsonDataObject.create().set("def", "ghi"), "def", "ghi");
            });

            runner.testFunction("getBoolean(string)", () =>
            {
                function getBooleanErrorTest(json: JsonDataObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getBoolean(propertyName).await(),
                            expected);
                    });
                }

                getBooleanErrorTest(JsonDataObject.create(), undefined!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getBooleanErrorTest(JsonDataObject.create(), null!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getBooleanErrorTest(JsonDataObject.create(), "", new NotFoundError(`The JSON object doesn't contain a property named "".`));
                getBooleanErrorTest(JsonDataObject.create(), "abc", new NotFoundError(`The JSON object doesn't contain a property named "abc".`));
                getBooleanErrorTest(JsonDataObject.create().set("abc", 5), "abc", new WrongTypeError("Expected boolean but found number."));

                function getBooleanTest(json: JsonDataObject, propertyName: string, expected: JsonDataBoolean): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getBoolean(propertyName).await(), expected);
                    });
                }

                getBooleanTest(JsonDataObject.create().set("def", true), "def", JsonDataBoolean.create(true));
            });

            runner.testFunction("getBooleanValue(string)", () =>
            {
                function getBooleanValueErrorTest(json: JsonDataObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getBooleanValue(propertyName).await(),
                            expected);
                    });
                }

                getBooleanValueErrorTest(JsonDataObject.create(), undefined!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getBooleanValueErrorTest(JsonDataObject.create(), null!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getBooleanValueErrorTest(JsonDataObject.create(), "", new NotFoundError(`The JSON object doesn't contain a property named "".`));
                getBooleanValueErrorTest(JsonDataObject.create(), "abc", new NotFoundError(`The JSON object doesn't contain a property named "abc".`));
                getBooleanValueErrorTest(JsonDataObject.create().set("abc", 5), "abc", new WrongTypeError("Expected boolean but found number."));

                function getBooleanValueTest(json: JsonDataObject, propertyName: string, expected: boolean): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getBooleanValue(propertyName).await(), expected);
                    });
                }

                getBooleanValueTest(JsonDataObject.create().set("def", false), "def", false);
            });

            runner.testFunction("getNull(string)", () =>
            {
                function getNullErrorTest(json: JsonDataObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getNull(propertyName).await(), expected);
                    });
                }

                getNullErrorTest(JsonDataObject.create(), undefined!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getNullErrorTest(JsonDataObject.create(), null!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getNullErrorTest(JsonDataObject.create(), "", new NotFoundError(`The JSON object doesn't contain a property named "".`));
                getNullErrorTest(JsonDataObject.create(), "abc", new NotFoundError(`The JSON object doesn't contain a property named "abc".`));
                getNullErrorTest(JsonDataObject.create().set("abc", "def"), "abc", new WrongTypeError("Expected null but found string."));

                function getNullTest(json: JsonDataObject, propertyName: string): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getNull(propertyName).await(), JsonDataNull.create());
                    });
                }

                getNullTest(JsonDataObject.create().set("def", null), "def");
            });

            runner.testFunction("getNullValue(string)", () =>
            {
                function getNullValueErrorTest(json: JsonDataObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getNullValue(propertyName).await(), expected);
                    });
                }

                getNullValueErrorTest(JsonDataObject.create(), undefined!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getNullValueErrorTest(JsonDataObject.create(), null!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getNullValueErrorTest(JsonDataObject.create(), "", new NotFoundError(`The JSON object doesn't contain a property named "".`));
                getNullValueErrorTest(JsonDataObject.create(), "abc", new NotFoundError(`The JSON object doesn't contain a property named "abc".`));
                getNullValueErrorTest(JsonDataObject.create().set("abc", "def"), "abc", new WrongTypeError("Expected null but found string."));

                function getNullValueTest(json: JsonDataObject, propertyName: string): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertNull(json.getNullValue(propertyName).await());
                    });
                }

                getNullValueTest(JsonDataObject.create().set("def", null), "def");
            });

            runner.testFunction("getNumber(string)", () =>
            {
                function getNumberErrorTest(json: JsonDataObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getNumber(propertyName).await(),
                            expected);
                    });
                }

                getNumberErrorTest(JsonDataObject.create(), undefined!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getNumberErrorTest(JsonDataObject.create(), null!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getNumberErrorTest(JsonDataObject.create(), "", new NotFoundError(`The JSON object doesn't contain a property named "".`));
                getNumberErrorTest(JsonDataObject.create(), "abc", new NotFoundError(`The JSON object doesn't contain a property named "abc".`));
                getNumberErrorTest(JsonDataObject.create().set("abc", "5"), "abc", new WrongTypeError("Expected number but found string."));

                function getNumberTest(json: JsonDataObject, propertyName: string, expected: JsonDataNumber): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getNumber(propertyName).await(), expected);
                    });
                }

                getNumberTest(JsonDataObject.create().set("def", 13), "def", JsonDataNumber.create(13));
            });

            runner.testFunction("getNumberValue(string)", () =>
            {
                function getNumberValueErrorTest(json: JsonDataObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getNumberValue(propertyName).await(),
                            expected);
                    });
                }

                getNumberValueErrorTest(JsonDataObject.create(), undefined!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getNumberValueErrorTest(JsonDataObject.create(), null!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getNumberValueErrorTest(JsonDataObject.create(), "", new NotFoundError(`The JSON object doesn't contain a property named "".`));
                getNumberValueErrorTest(JsonDataObject.create(), "abc", new NotFoundError(`The JSON object doesn't contain a property named "abc".`));
                getNumberValueErrorTest(JsonDataObject.create().set("abc", "5"), "abc", new WrongTypeError("Expected number but found string."));

                function getNumberValueTest(json: JsonDataObject, propertyName: string, expected: number): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getNumberValue(propertyName).await(), expected);
                    });
                }

                getNumberValueTest(JsonDataObject.create().set("def", 5), "def", 5);
            });

            runner.testFunction("getObject(string)", () =>
            {
                function getObjectErrorTest(json: JsonDataObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getObject(propertyName).await(),
                            expected);
                    });
                }

                getObjectErrorTest(JsonDataObject.create(), undefined!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getObjectErrorTest(JsonDataObject.create(), null!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getObjectErrorTest(JsonDataObject.create(), "", new NotFoundError(`The JSON object doesn't contain a property named "".`));
                getObjectErrorTest(JsonDataObject.create(), "abc", new NotFoundError(`The JSON object doesn't contain a property named "abc".`));
                getObjectErrorTest(JsonDataObject.create().set("abc", "5"), "abc", new WrongTypeError("Expected object but found string."));
                getObjectErrorTest(JsonDataObject.create().set("abc", JsonDataArray.create()), "abc", new WrongTypeError("Expected object but found array."));

                function getObjectTest(json: JsonDataObject, propertyName: string, expected: JsonDataObject): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getObject(propertyName).await(), expected);
                    });
                }

                getObjectTest(JsonDataObject.create().set("def", {}), "def", JsonDataObject.create());
                getObjectTest(JsonDataObject.create().set("def", {a:4,b:true}), "def", JsonDataObject.create({a:4,b:true}));
            });

            runner.testFunction("getArray(string)", () =>
            {
                function getArrayErrorTest(json: JsonDataObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getArray(propertyName).await(),
                            expected);
                    });
                }

                getArrayErrorTest(JsonDataObject.create(), undefined!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getArrayErrorTest(JsonDataObject.create(), null!, new PreConditionError(
                    "Expression: name",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getArrayErrorTest(JsonDataObject.create(), "", new NotFoundError(`The JSON object doesn't contain a property named "".`));
                getArrayErrorTest(JsonDataObject.create(), "abc", new NotFoundError(`The JSON object doesn't contain a property named "abc".`));
                getArrayErrorTest(JsonDataObject.create().set("abc", "5"), "abc", new WrongTypeError("Expected array but found string."));
                getArrayErrorTest(JsonDataObject.create().set("abc", JsonDataObject.create()), "abc", new WrongTypeError("Expected array but found object."));

                function getArrayTest(json: JsonDataObject, propertyName: string, expected: JsonDataArray): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getArray(propertyName).await(), expected);
                    });
                }

                getArrayTest(JsonDataObject.create().set("def", []), "def", JsonDataArray.create());
                getArrayTest(JsonDataObject.create().set("def", ["a",4,"b",true]), "def", JsonDataArray.create(["a",4,"b",true]));
            });

            runner.testFunction("set(string,JsonDataType)", () =>
            {
                function setErrorTest(propertyName: string, propertyValue: JsonDataType, expected: Error): void
                {
                    runner.test(`with ${runner.andList([propertyName, propertyValue])}`, (test: Test) =>
                    {
                        const json: JsonDataObject = JsonDataObject.create();
                        test.assertThrows(() => json.set(propertyName, propertyValue), expected);
                        test.assertEqual(json.getPropertyCount(), 0);
                    });
                }

                setErrorTest(
                    undefined!,
                    JsonDataNull.create(),
                    new PreConditionError(
                        "Expression: isString(name)",
                        "Expected: true",
                        "Actual: false",
                    ));
                setErrorTest(
                    null!,
                    JsonDataNull.create(),
                    new PreConditionError(
                        "Expression: isString(name)",
                        "Expected: true",
                        "Actual: false",
                    ));
                setErrorTest(
                    "abc",
                    undefined!,
                    new PreConditionError(
                        "Expression: value",
                        "Expected: not undefined",
                        "Actual: undefined",
                    ));

                function setTest(propertyName: string, propertyValue: JsonDataType, expectedPropertyValue?: JsonDataValue): void
                {
                    runner.test(`with ${runner.andList([propertyName, propertyValue])}`, (test: Test) =>
                    {
                        if (expectedPropertyValue === undefined)
                        {
                            expectedPropertyValue = propertyValue as JsonDataValue;
                        }

                        const json: JsonDataObject = JsonDataObject.create();
                        const setResult: JsonDataObject = json.set(propertyName, propertyValue);
                        test.assertSame(setResult, json);
                        test.assertEqual(json.getPropertyCount(), 1);
                        test.assertEqual(json.get(propertyName).await(), expectedPropertyValue);
                    });
                }

                setTest("abc", JsonDataNull.create());
                setTest("abc", JsonDataBoolean.create(true));
                setTest("one", 1, JsonDataNumber.create(1));
                setTest("two", "2", JsonDataString.create("2"));
                setTest("def", null, JsonDataNull.create());
                setTest("def", {}, JsonDataObject.create());
                setTest("def", {a:1}, JsonDataObject.create().set("a", 1));
                setTest("abc", [], JsonDataArray.create());
            });

            runner.testFunction("setAll(string,JsonDataObject|{[propertyName:string]:JsonDataType})", () =>
            {
                function setAllErrorTest(json: JsonDataObject, properties: JsonDataObject|{[propertyName:string]:JsonDataType}, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, properties])}`, (test: Test) =>
                    {
                        const json: JsonDataObject = JsonDataObject.create();
                        test.assertThrows(() => json.setAll(properties), expected);
                        test.assertEqual(json.getPropertyCount(), 0);
                    });
                }

                setAllErrorTest(
                    JsonDataObject.create(),
                    undefined!,
                    new PreConditionError(
                        "Expression: properties",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                setAllErrorTest(
                    JsonDataObject.create(),
                    null!,
                    new PreConditionError(
                        "Expression: properties",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));

                function setAllTest(json: JsonDataObject, properties: JsonDataObject|{[propertyName:string]:JsonDataType}, expected: JsonDataObject): void
                {
                    runner.test(`with ${runner.andList([json, properties])}`, (test: Test) =>
                    {
                        const setAllResult: JsonDataObject = json.setAll(properties);
                        test.assertSame(setAllResult, json);
                        test.assertEqual(json, expected);
                    });
                }

                setAllTest(
                    JsonDataObject.create(),
                    JsonDataObject.create(),
                    JsonDataObject.create(),
                );
                setAllTest(
                    JsonDataObject.create(),
                    {},
                    JsonDataObject.create(),
                );
                setAllTest(
                    JsonDataObject.create(),
                    JsonDataObject.create({
                        a: 1,
                        b: "2",
                        c: false,
                    }),
                    JsonDataObject.create({
                        a: 1,
                        b: "2",
                        c: false,
                    }),
                );
                setAllTest(
                    JsonDataObject.create(),
                    {
                        a: 1,
                        b: "2",
                        c: false,
                    },
                    JsonDataObject.create({
                        a: 1,
                        b: "2",
                        c: false,
                    }),
                );
                setAllTest(
                    JsonDataObject.create({a: 1}),
                    {
                        b: "2",
                        c: false,
                    },
                    JsonDataObject.create({
                        a: 1,
                        b: "2",
                        c: false,
                    }),
                );
                setAllTest(
                    JsonDataObject.create({b: "200"}),
                    {
                        b: "2",
                        c: false,
                    },
                    JsonDataObject.create({
                        b: "2",
                        c: false,
                    }),
                );
            });
        });
    });
}
test(createTestRunner());