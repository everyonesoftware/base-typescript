import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Iterator, JsonDataArray, JsonDataObject, JsonDataProperty, JsonDataType, NotFoundError, PreConditionError, WrongTypeError } from "../sources";
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

                runner.test("with undefined property value", (test: Test) =>
                {
                    test.assertThrows(() => JsonDataObject.create({a: undefined!}), new PreConditionError(
                        "Expression: propertyValue",
                        "Expected: not undefined",
                        "Actual: undefined",
                    ));
                });

                runner.test("with undefined grandchild-property value", (test: Test) =>
                {
                    const json: JsonDataObject = JsonDataObject.create({a:{b:undefined!}});
                    test.assertTrue(json.any());
                    test.assertEqual(json.getPropertyCount(), 1);
                    test.assertEqual(json.toString(), `{a:[object Object]}`);
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
                            test.assertEqual(expectedProperty[1], properties.getCurrent().getValue().await());

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
                    test.assertEqual(50, property.getValue().await());
                });
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

                function getStringTest(json: JsonDataObject, propertyName: string, expected: string): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getString(propertyName).await(), expected);
                    });
                }

                getStringTest(JsonDataObject.create().set("def", "ghi"), "def", "ghi");
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

                function getBooleanTest(json: JsonDataObject, propertyName: string, expected: boolean): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getBoolean(propertyName).await(), expected);
                    });
                }

                getBooleanTest(JsonDataObject.create().set("def", true), "def", true);
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
                        test.assertEqual(json.getNull(propertyName).await(), null);
                    });
                }

                getNullTest(JsonDataObject.create().set("def", null), "def");
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

                function getNumberTest(json: JsonDataObject, propertyName: string, expected: number): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getNumber(propertyName).await(), expected);
                    });
                }

                getNumberTest(JsonDataObject.create().set("def", 13), "def", 13);
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

                getObjectErrorTest(
                    JsonDataObject.create(),
                    undefined!,
                    new PreConditionError(
                        "Expression: name",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getObjectErrorTest(
                    JsonDataObject.create(),
                    null!,
                    new PreConditionError(
                        "Expression: name",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getObjectErrorTest(
                    JsonDataObject.create(),
                    "",
                    new NotFoundError(`The JSON object doesn't contain a property named "".`),
                );
                getObjectErrorTest(
                    JsonDataObject.create(),
                    "abc1",
                    new NotFoundError(`The JSON object doesn't contain a property named "abc1".`),
                );
                getObjectErrorTest(
                    JsonDataObject.create().set("abc2", "5"),
                    "abc2",
                    new WrongTypeError("Expected object but found string."));
                getObjectErrorTest(
                    JsonDataObject.create().set("abc3", JsonDataArray.create()),
                    "abc3",
                    new WrongTypeError("Expected object but found array."),
                );

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
                    null,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                setErrorTest(
                    null!,
                    null,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
                setErrorTest(
                    "abc",
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyValue",
                        "Expected: not undefined",
                        "Actual: undefined",
                    ));

                function setTest(propertyName: string, propertyValue: JsonDataType): void
                {
                    runner.test(`with ${runner.andList([propertyName, propertyValue])}`, (test: Test) =>
                    {
                        const json: JsonDataObject = JsonDataObject.create();
                        const setResult: JsonDataObject = json.set(propertyName, propertyValue);
                        test.assertSame(setResult, json);
                        test.assertEqual(json.getPropertyCount(), 1);
                        test.assertEqual(json.get(propertyName).await(), propertyValue);
                    });
                }

                setTest("abc", null);
                setTest("abc", true);
                setTest("one", 1);
                setTest("two", "2");
                setTest("def", {});
                setTest("def", {a:1});
                setTest("def", JsonDataObject.create({b:3}));
                setTest("abc", []);
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