import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { JavascriptIterable, JsonDocumentArray, JsonDocumentBoolean, JsonDocumentNumber, JsonDocumentObject, JsonDocumentProperty, JsonDocumentString, JsonDocumentValue, NotFoundError, PreConditionError, Token, WrongTypeError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDocumentObject.ts", () =>
    {
        runner.testType(JsonDocumentObject.name, () =>
        {
            runner.testFunction("iterateProperties()", () =>
            {
                function iteratePropertiesTest(object: JsonDocumentObject, expected: JavascriptIterable<JsonDocumentProperty>): void
                {
                    runner.test(`with ${runner.toString(object)}`, (test: Test) =>
                    {
                        test.assertEqual(expected, object.iterateProperties().toArray());
                    });
                }

                iteratePropertiesTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    [],
                );
                iteratePropertiesTest(
                    JsonDocumentObject.parse(`{   }`, () => {}).await()!,
                    [],
                );
                iteratePropertiesTest(
                    JsonDocumentObject.parse(`{ "a"  }`, () => {}).await()!,
                    [
                        JsonDocumentProperty.parse(`"a"  `, () => {}).await()!,
                    ],
                );
                iteratePropertiesTest(
                    JsonDocumentObject.parse(`{ "a":  }`, () => {}).await()!,
                    [
                        JsonDocumentProperty.parse(`"a":  `, () => {}).await()!,
                    ],
                );
                iteratePropertiesTest(
                    JsonDocumentObject.parse(`{ "a":5 }`).await()!,
                    [
                        JsonDocumentProperty.parse(`"a":5`).await()!,
                    ],
                );
                iteratePropertiesTest(
                    JsonDocumentObject.parse(`{ "a":5, }`, () => {}).await()!,
                    [
                        JsonDocumentProperty.parse(`"a":5`).await()!,
                    ],
                );
                iteratePropertiesTest(
                    JsonDocumentObject.parse(`{ "a":5, "b":true }`, () => {}).await()!,
                    [
                        JsonDocumentProperty.parse(`"a":5`).await()!,
                        JsonDocumentProperty.parse(`"b":true`).await()!,
                    ],
                );
                iteratePropertiesTest(
                    JsonDocumentObject.parse(`{ "a":5 "b":true }`, () => {}).await()!,
                    [
                        JsonDocumentProperty.parse(`"a":5`).await()!,
                        JsonDocumentProperty.parse(`"b":true`).await()!,
                    ],
                );
            });

            runner.testFunction("getProperty(string)", () =>
            {
                function getPropertyErrorTest(object: JsonDocumentObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => object.getProperty(propertyName).await(), expected);
                    });
                }

                getPropertyErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getPropertyErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getPropertyErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    "",
                    new NotFoundError(
                        "No property with the name \"\" found.",
                    ),
                );
                getPropertyErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "b",
                    new NotFoundError(
                        "No property with the name \"b\" found.",
                    ),
                );
                getPropertyErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "A",
                    new NotFoundError(
                        "No property with the name \"A\" found.",
                    ),
                );

                function getPropertyTest(object: JsonDocumentObject, propertyName: string, expected: JsonDocumentProperty): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(object.getProperty(propertyName).await(), expected);
                    });
                }

                getPropertyTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "a",
                    JsonDocumentProperty.parse(`"a":1`).await()!,
                );
                getPropertyTest(
                    JsonDocumentObject.parse(`{  "a" : 1`, () => {}).await()!,
                    "a",
                    JsonDocumentProperty.parse(`"a" : 1`).await()!,
                );
                getPropertyTest(
                    JsonDocumentObject.parse(`{  "a" : 1 ,`, () => {}).await()!,
                    "a",
                    JsonDocumentProperty.parse(`"a" : 1`).await()!,
                );
            });

            runner.testFunction("getValue(string)", () =>
            {
                function getValueErrorTest(object: JsonDocumentObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => object.getValue(propertyName).await(), expected);
                    });
                }

                getValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    "",
                    new NotFoundError(
                        "No property with the name \"\" found.",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "b",
                    new NotFoundError(
                        "No property with the name \"b\" found.",
                    ),
                );
                getValueErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "A",
                    new NotFoundError(
                        "No property with the name \"A\" found.",
                    ),
                );

                function getValueTest(object: JsonDocumentObject, propertyName: string, expected: JsonDocumentValue | undefined): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(object.getValue(propertyName).await(), expected);
                    });
                }

                getValueTest(
                    JsonDocumentObject.parse(`{"a":}`, () => {}).await()!,
                    "a",
                    undefined,
                );
                getValueTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "a",
                    JsonDocumentValue.parse("1").await()!,
                );
                getValueTest(
                    JsonDocumentObject.parse(`{  "a" : false`, () => {}).await()!,
                    "a",
                    JsonDocumentValue.parse(`false`).await()!,
                );
                getValueTest(
                    JsonDocumentObject.parse(`{  "a" : "b" ,`, () => {}).await()!,
                    "a",
                    JsonDocumentValue.parse(`"b"`).await()!,
                );
            });

            runner.testFunction("getStringValue(string)", () =>
            {
                function getStringValueErrorTest(object: JsonDocumentObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => object.getStringValue(propertyName).await(), expected);
                    });
                }

                getStringValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    "",
                    new NotFoundError(
                        "No property with the name \"\" found.",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "b",
                    new NotFoundError(
                        "No property with the name \"b\" found.",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "A",
                    new NotFoundError(
                        "No property with the name \"A\" found.",
                    ),
                );
                getStringValueErrorTest(
                    JsonDocumentObject.parse(`{"a":}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a string, but was undefined instead."),
                );
                getStringValueErrorTest(
                    JsonDocumentObject.parse(`{"a":false}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a string, but was false instead."),
                );
                getStringValueErrorTest(
                    JsonDocumentObject.parse(`{"a":200}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a string, but was 200 instead."),
                );

                function getStringValueTest(object: JsonDocumentObject, propertyName: string, expected: JsonDocumentString): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(object.getStringValue(propertyName).await(), expected);
                    });
                }

                getStringValueTest(
                    JsonDocumentObject.parse(`{"a":"b"}`, () => {}).await()!,
                    "a",
                    JsonDocumentString.parse(`"b"`).await()!,
                );
                getStringValueTest(
                    JsonDocumentObject.parse(`{"a":"c","a":"d"}`, () => {}).await()!,
                    "a",
                    JsonDocumentString.parse(`"c"`).await()!,
                );
            });

            runner.testFunction("getString(string)", () =>
            {
                function getStringErrorTest(object: JsonDocumentObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => object.getString(propertyName).await(), expected);
                    });
                }

                getStringErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    "",
                    new NotFoundError(
                        "No property with the name \"\" found.",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "b",
                    new NotFoundError(
                        "No property with the name \"b\" found.",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "A",
                    new NotFoundError(
                        "No property with the name \"A\" found.",
                    ),
                );
                getStringErrorTest(
                    JsonDocumentObject.parse(`{"a":}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a string, but was undefined instead."),
                );
                getStringErrorTest(
                    JsonDocumentObject.parse(`{"a":false}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a string, but was false instead."),
                );

                function getStringTest(object: JsonDocumentObject, propertyName: string, expected: string): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(object.getString(propertyName).await(), expected);
                    });
                }

                getStringTest(
                    JsonDocumentObject.parse(`{"a":"b"}`, () => {}).await()!,
                    "a",
                    "b",
                );
                getStringTest(
                    JsonDocumentObject.parse(`{"a":"c","a":"d"}`, () => {}).await()!,
                    "a",
                    "c",
                );
            });

            runner.testFunction("getBooleanValue(string)", () =>
            {
                function getBooleanValueErrorTest(object: JsonDocumentObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => object.getBooleanValue(propertyName).await(), expected);
                    });
                }

                getBooleanValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    "",
                    new NotFoundError(
                        "No property with the name \"\" found.",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "b",
                    new NotFoundError(
                        "No property with the name \"b\" found.",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "A",
                    new NotFoundError(
                        "No property with the name \"A\" found.",
                    ),
                );
                getBooleanValueErrorTest(
                    JsonDocumentObject.parse(`{"a":}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a boolean, but was undefined instead."),
                );
                getBooleanValueErrorTest(
                    JsonDocumentObject.parse(`{"a":200}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a boolean, but was 200 instead."),
                );

                function getBooleanValueTest(object: JsonDocumentObject, propertyName: string, expected: JsonDocumentBoolean): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(object.getBooleanValue(propertyName).await(), expected);
                    });
                }

                getBooleanValueTest(
                    JsonDocumentObject.parse(`{"a":false}`, () => {}).await()!,
                    "a",
                    JsonDocumentBoolean.create(Token.letters("false")),
                );
                getBooleanValueTest(
                    JsonDocumentObject.parse(`{"a":true,"a":false}`, () => {}).await()!,
                    "a",
                    JsonDocumentBoolean.create(Token.letters("true")),
                );
            });

            runner.testFunction("getBooleanValue(string)", () =>
            {
                function getBooleanErrorTest(object: JsonDocumentObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => object.getBoolean(propertyName).await(), expected);
                    });
                }

                getBooleanErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    "",
                    new NotFoundError(
                        "No property with the name \"\" found.",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "b",
                    new NotFoundError(
                        "No property with the name \"b\" found.",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentObject.parse(`{"a":1}`).await()!,
                    "A",
                    new NotFoundError(
                        "No property with the name \"A\" found.",
                    ),
                );
                getBooleanErrorTest(
                    JsonDocumentObject.parse(`{"a":}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a boolean, but was undefined instead."),
                );
                getBooleanErrorTest(
                    JsonDocumentObject.parse(`{"a":200}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a boolean, but was 200 instead."),
                );

                function getBooleanTest(object: JsonDocumentObject, propertyName: string, expected: boolean): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(object.getBoolean(propertyName).await(), expected);
                    });
                }

                getBooleanTest(
                    JsonDocumentObject.parse(`{"a":false}`, () => {}).await()!,
                    "a",
                    false,
                );
                getBooleanTest(
                    JsonDocumentObject.parse(`{"a":true,"a":false}`, () => {}).await()!,
                    "a",
                    true,
                );
            });

            runner.testFunction("getNumberValue(string)", () =>
            {
                function getNumberValueErrorTest(object: JsonDocumentObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => object.getNumberValue(propertyName).await(), expected);
                    });
                }

                getNumberValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    "",
                    new NotFoundError(
                        "No property with the name \"\" found.",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentObject.parse(`{"a":"1"}`).await()!,
                    "b",
                    new NotFoundError(
                        "No property with the name \"b\" found.",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentObject.parse(`{"a":"1"}`).await()!,
                    "A",
                    new NotFoundError(
                        "No property with the name \"A\" found.",
                    ),
                );
                getNumberValueErrorTest(
                    JsonDocumentObject.parse(`{"a":}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a number, but was undefined instead."),
                );
                getNumberValueErrorTest(
                    JsonDocumentObject.parse(`{"a":"200"}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a number, but was \"200\" instead."),
                );

                function getNumberValueTest(object: JsonDocumentObject, propertyName: string, expected: JsonDocumentValue): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(object.getNumberValue(propertyName).await(), expected);
                    });
                }

                getNumberValueTest(
                    JsonDocumentObject.parse(`{"a":123}`, () => {}).await()!,
                    "a",
                    JsonDocumentNumber.parse("123").await()!,
                );
                getNumberValueTest(
                    JsonDocumentObject.parse(`{"a":4,"a":56}`, () => {}).await()!,
                    "a",
                    JsonDocumentNumber.parse("4").await()!,
                );
            });

            runner.testFunction("getNumber(string)", () =>
            {
                function getNumberErrorTest(object: JsonDocumentObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => object.getNumber(propertyName).await(), expected);
                    });
                }

                getNumberErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    "",
                    new NotFoundError(
                        "No property with the name \"\" found.",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentObject.parse(`{"a":"1"}`).await()!,
                    "b",
                    new NotFoundError(
                        "No property with the name \"b\" found.",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentObject.parse(`{"a":"1"}`).await()!,
                    "A",
                    new NotFoundError(
                        "No property with the name \"A\" found.",
                    ),
                );
                getNumberErrorTest(
                    JsonDocumentObject.parse(`{"a":}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a number, but was undefined instead."),
                );
                getNumberErrorTest(
                    JsonDocumentObject.parse(`{"a":"200"}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be a number, but was \"200\" instead."),
                );

                function getNumberTest(object: JsonDocumentObject, propertyName: string, expected: number): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(object.getNumber(propertyName).await(), expected);
                    });
                }

                getNumberTest(
                    JsonDocumentObject.parse(`{"a":123}`, () => {}).await()!,
                    "a",
                    123,
                );
                getNumberTest(
                    JsonDocumentObject.parse(`{"a":4,"a":56}`, () => {}).await()!,
                    "a",
                    4,
                );
            });

            runner.testFunction("getObject(string)", () =>
            {
                function getObjectErrorTest(object: JsonDocumentObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => object.getObject(propertyName).await(), expected);
                    });
                }

                getObjectErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    "",
                    new NotFoundError(
                        "No property with the name \"\" found.",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentObject.parse(`{"a":"1"}`).await()!,
                    "b",
                    new NotFoundError(
                        "No property with the name \"b\" found.",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentObject.parse(`{"a":"1"}`).await()!,
                    "A",
                    new NotFoundError(
                        "No property with the name \"A\" found.",
                    ),
                );
                getObjectErrorTest(
                    JsonDocumentObject.parse(`{"a":}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be an object, but was undefined instead."),
                );
                getObjectErrorTest(
                    JsonDocumentObject.parse(`{"a":"200"}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be an object, but was \"200\" instead."),
                );

                function getObjectTest(object: JsonDocumentObject, propertyName: string, expected: JsonDocumentValue): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(object.getObject(propertyName).await(), expected);
                    });
                }

                getObjectTest(
                    JsonDocumentObject.parse(`{"a":{"b":5}}`, () => {}).await()!,
                    "a",
                    JsonDocumentObject.parse(`{"b":5}`).await()!,
                );
                getObjectTest(
                    JsonDocumentObject.parse(`{"a":{"c":true},"a":{"d":56}}`, () => {}).await()!,
                    "a",
                    JsonDocumentObject.parse(`{"c":true}`).await()!,
                );
            });

            runner.testFunction("getArray(string)", () =>
            {
                function getArrayErrorTest(object: JsonDocumentObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => object.getArray(propertyName).await(), expected);
                    });
                }

                getArrayErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    undefined!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    null!,
                    new PreConditionError(
                        "Expression: propertyName",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentObject.parse(`{}`).await()!,
                    "",
                    new NotFoundError(
                        "No property with the name \"\" found.",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentObject.parse(`{"a":"1"}`).await()!,
                    "b",
                    new NotFoundError(
                        "No property with the name \"b\" found.",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentObject.parse(`{"a":"1"}`).await()!,
                    "A",
                    new NotFoundError(
                        "No property with the name \"A\" found.",
                    ),
                );
                getArrayErrorTest(
                    JsonDocumentObject.parse(`{"a":}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be an array, but was undefined instead."),
                );
                getArrayErrorTest(
                    JsonDocumentObject.parse(`{"a":"200"}`, () => {}).await()!,
                    "a",
                    new WrongTypeError("Expected property value to be an array, but was \"200\" instead."),
                );

                function getArrayTest(object: JsonDocumentObject, propertyName: string, expected: JsonDocumentArray): void
                {
                    runner.test(`with ${runner.andList([object.getText(), propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(object.getArray(propertyName).await(), expected);
                    });
                }

                getArrayTest(
                    JsonDocumentObject.parse(`{"a":[1,"2",3]}`, () => {}).await()!,
                    "a",
                    JsonDocumentArray.parse(`[1,"2",3]`).await()!,
                );
                getArrayTest(
                    JsonDocumentObject.parse(`{"a":[4,5],"a":[6]}`, () => {}).await()!,
                    "a",
                    JsonDocumentArray.parse(`[4,5]`).await()!,
                );
            });
        });
    });
}
test(createTestRunner());