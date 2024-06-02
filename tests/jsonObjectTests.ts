import { JsonBoolean, JsonNull, JsonNumber, JsonObject, JsonProperty, JsonSegment, JsonSegmentType, JsonString, NotFoundError, PreConditionError, Test, TestRunner, WrongTypeError } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonObject.ts", () =>
    {
        runner.testType(JsonObject, () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const json: JsonObject = JsonObject.create();
                test.assertEqual(json.getCount(), 0);
                test.assertEqual(json.getSegmentType(), JsonSegmentType.Object);
                test.assertEqual(json.toString(), "{}");
            });

            runner.testFunction("set(string,JsonSegment)", () =>
            {
                function setErrorTest(propertyName: string, propertyValue: JsonSegment, expected: Error): void
                {
                    runner.test(`with ${runner.andList([propertyName, propertyValue])}`, (test: Test) =>
                    {
                        const json: JsonObject = JsonObject.create();
                        test.assertThrows(() => json.set(propertyName, propertyValue), expected);
                        test.assertEqual(json.getCount(), 0);
                    });
                }

                setErrorTest(
                    undefined!,
                    JsonSegment.null(),
                    new PreConditionError(
                        "Expression: isString(propertyName)",
                        "Expected: true",
                        "Actual: false",
                    ));
                setErrorTest(
                    null!,
                    JsonSegment.null(),
                    new PreConditionError(
                        "Expression: isString(propertyName)",
                        "Expected: true",
                        "Actual: false",
                    ));
                setErrorTest(
                    "abc",
                    undefined!,
                    new PreConditionError(
                        "Expression: property instanceof JsonProperty",
                        "Expected: true",
                        "Actual: false",
                    ));

                function setTest(propertyName: string, propertyValue: JsonSegment|number|boolean|string|null, expectedPropertyValue?: JsonSegment): void
                {
                    runner.test(`with ${runner.andList([propertyName, propertyValue])}`, (test: Test) =>
                    {
                        if (expectedPropertyValue === undefined)
                        {
                            expectedPropertyValue = propertyValue as JsonSegment;
                        }

                        const json: JsonObject = JsonObject.create();
                        const setResult: JsonObject = json.set(propertyName, propertyValue);
                        test.assertSame(setResult, json);
                        test.assertEqual(json.getCount(), 1);
                        test.assertEqual(json.get(propertyName).await(), expectedPropertyValue);
                    });
                }

                setTest("abc", JsonSegment.null());
                setTest("abc", JsonBoolean.create(true));
                setTest("one", 1, JsonNumber.create(1));
                setTest("two", "2", JsonString.create("2"));
                setTest("def", null, JsonNull.create());
            });

            runner.testFunction("set(JsonProperty)", () =>
            {
                function setErrorTest(property: JsonProperty, expected: Error): void
                {
                    runner.test(`with ${runner.toString(property)}`, (test: Test) =>
                    {
                        const json: JsonObject = JsonObject.create();
                        test.assertThrows(() => json.set(property), expected);
                        test.assertEqual(json.getCount(), 0);
                    });
                }

                setErrorTest(
                    undefined!,
                    new PreConditionError(
                        "Expression: property",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                setErrorTest(
                    null!,
                    new PreConditionError(
                        "Expression: property",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));

                function setTest(property: JsonProperty): void
                {
                    runner.test(`with ${runner.toString(property)}`, (test: Test) =>
                    {
                        const json: JsonObject = JsonObject.create();
                        const setResult: JsonObject = json.set(property);
                        test.assertSame(setResult, json);
                        test.assertEqual(json.getCount(), 1);
                        test.assertSame(json.get(property.getName()).await(), property.getValue());
                    });
                }

                setTest(JsonProperty.create("abc", JsonSegment.null()));
                setTest(JsonProperty.create("abc", JsonSegment.boolean(false)));
            });

            runner.testFunction("getNull(string)", () =>
            {
                function getNullErrorTest(json: JsonObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getNull(propertyName).await(), expected);
                    });
                }

                getNullErrorTest(JsonObject.create(), undefined!, new NotFoundError("The key undefined was not found in the map."));
                getNullErrorTest(JsonObject.create(), null!, new NotFoundError("The key null was not found in the map."));
                getNullErrorTest(JsonObject.create(), "", new NotFoundError("The key \"\" was not found in the map."));
                getNullErrorTest(JsonObject.create(), "abc", new NotFoundError("The key \"abc\" was not found in the map."));
                getNullErrorTest(JsonObject.create().set("abc", "def"), "abc", new WrongTypeError("Expected JsonNull but found JsonString."));

                function getNullTest(json: JsonObject, propertyName: string): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getNull(propertyName).await(), JsonNull.create());
                    });
                }

                getNullTest(JsonObject.create().set("def", null), "def");
            });

            runner.testFunction("getString(string)", () =>
            {
                function getStringErrorTest(json: JsonObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getString(propertyName).await(),
                            expected);
                    });
                }

                getStringErrorTest(JsonObject.create(), undefined!, new NotFoundError("The key undefined was not found in the map."));
                getStringErrorTest(JsonObject.create(), null!, new NotFoundError("The key null was not found in the map."));
                getStringErrorTest(JsonObject.create(), "", new NotFoundError("The key \"\" was not found in the map."));
                getStringErrorTest(JsonObject.create(), "abc", new NotFoundError("The key \"abc\" was not found in the map."));
                getStringErrorTest(JsonObject.create().set("abc", 5), "abc", new WrongTypeError("Expected JsonString but found JsonNumber."));

                function getStringTest(json: JsonObject, propertyName: string, expected: JsonString): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getString(propertyName).await(), expected);
                    });
                }

                getStringTest(JsonObject.create().set("def", "ghi"), "def", JsonString.create("ghi"));
            });

            runner.testFunction("getStringValue(string)", () =>
            {
                function getStringValueErrorTest(json: JsonObject, propertyName: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertThrows(() => json.getStringValue(propertyName).await(),
                            expected);
                    });
                }

                getStringValueErrorTest(JsonObject.create(), undefined!, new NotFoundError("The key undefined was not found in the map."));
                getStringValueErrorTest(JsonObject.create(), null!, new NotFoundError("The key null was not found in the map."));
                getStringValueErrorTest(JsonObject.create(), "", new NotFoundError("The key \"\" was not found in the map."));
                getStringValueErrorTest(JsonObject.create(), "abc", new NotFoundError("The key \"abc\" was not found in the map."));
                getStringValueErrorTest(JsonObject.create().set("abc", 5), "abc", new WrongTypeError("Expected JsonString but found JsonNumber."));

                function getStringValueTest(json: JsonObject, propertyName: string, expected: string): void
                {
                    runner.test(`with ${runner.andList([json, propertyName])}`, (test: Test) =>
                    {
                        test.assertEqual(json.getStringValue(propertyName).await(), expected);
                    });
                }

                getStringValueTest(JsonObject.create().set("def", "ghi"), "def", "ghi");
            });
        });
    });
}
test(MochaTestRunner.create());