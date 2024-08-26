import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JsonDataBoolean, JsonDataNull, JsonDataNumber, JsonDataObject, JsonDataString, JsonDataType, JsonDataValue, NotFoundError, PreConditionError, WrongTypeError } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDataObject.ts", () =>
    {
        runner.testType(JsonDataObject, () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const json: JsonDataObject = JsonDataObject.create();
                test.assertFalse(json.any());
                test.assertEqual(json.getPropertyCount(), 0);
                test.assertEqual(json.toString(), "{}");
            });

            runner.testFunction("set(string,JsonSegment)", () =>
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
                getNullErrorTest(JsonDataObject.create(), "", new NotFoundError("The key \"\" was not found in the map."));
                getNullErrorTest(JsonDataObject.create(), "abc", new NotFoundError("The key \"abc\" was not found in the map."));
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
                getStringErrorTest(JsonDataObject.create(), "", new NotFoundError("The key \"\" was not found in the map."));
                getStringErrorTest(JsonDataObject.create(), "abc", new NotFoundError("The key \"abc\" was not found in the map."));
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
                getStringValueErrorTest(JsonDataObject.create(), "", new NotFoundError("The key \"\" was not found in the map."));
                getStringValueErrorTest(JsonDataObject.create(), "abc", new NotFoundError("The key \"abc\" was not found in the map."));
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
        });
    });
}
test(createTestRunner());