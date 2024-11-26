import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { JavascriptIterable, JsonDocumentObject, JsonDocumentProperty, NotFoundError, PreConditionError } from "../sources";

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
                    runner.test(`with ${runner.andList([object, propertyName])}`, (test: Test) =>
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
                    runner.test(`with ${runner.andList([object, propertyName])}`, (test: Test) =>
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
        });
    });
}
test(createTestRunner());