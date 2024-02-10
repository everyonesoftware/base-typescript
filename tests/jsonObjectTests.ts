import * as assert from "assert";

import { JsonBoolean, JsonNull, JsonNumber, JsonObject, JsonProperty, JsonSegment, JsonSegmentType, JsonString, NotFoundError, PreConditionError, WrongTypeError, andList, escapeAndQuote, toString } from "../sources";

suite("jsonObject.ts", () =>
{
    suite("JsonObject", () =>
    {
        test("create()", () =>
        {
            const json: JsonObject = JsonObject.create();
            assert.strictEqual(json.getCount(), 0);
            assert.strictEqual(json.getSegmentType(), JsonSegmentType.Object);
            assert.strictEqual(json.toString(), "{}");
        });

        suite("set(string,JsonSegment)", () =>
        {
            function setErrorTest(propertyName: string, propertyValue: JsonSegment, expected: Error): void
            {
                test(`with ${andList([escapeAndQuote(propertyName), toString(propertyValue)])}`, () =>
                {
                    const json: JsonObject = JsonObject.create();
                    assert.throws(() => json.set(propertyName, propertyValue), expected);
                    assert.strictEqual(json.getCount(), 0);
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
                test(`with ${escapeAndQuote(propertyName)} and ${propertyValue}`, () =>
                {
                    if (expectedPropertyValue === undefined)
                    {
                        expectedPropertyValue = propertyValue as JsonSegment;
                    }

                    const json: JsonObject = JsonObject.create();
                    const setResult: JsonObject = json.set(propertyName, propertyValue);
                    assert.strictEqual(setResult, json);
                    assert.strictEqual(json.getCount(), 1);
                    assert.deepStrictEqual(json.get(propertyName).await(), expectedPropertyValue);
                });
            }

            setTest("abc", JsonSegment.null());
            setTest("abc", JsonBoolean.create(true));
            setTest("one", 1, JsonNumber.create(1));
            setTest("two", "2", JsonString.create("2"));
            setTest("def", null, JsonNull.create());
        });

        suite("set(JsonProperty)", () =>
        {
            function setErrorTest(property: JsonProperty, expected: Error): void
            {
                test(`with ${toString(property)}`, () =>
                {
                    const json: JsonObject = JsonObject.create();
                    assert.throws(() => json.set(property), expected);
                    assert.strictEqual(json.getCount(), 0);
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
                test(`with ${property}`, () =>
                {
                    const json: JsonObject = JsonObject.create();
                    const setResult: JsonObject = json.set(property);
                    assert.strictEqual(setResult, json);
                    assert.strictEqual(json.getCount(), 1);
                    assert.strictEqual(json.get(property.getName()).await(), property.getValue());
                });
            }

            setTest(JsonProperty.create("abc", JsonSegment.null()));
            setTest(JsonProperty.create("abc", JsonSegment.boolean(false)));
        });

        suite("getNull(string)", () =>
        {
            function getNullErrorTest(json: JsonObject, propertyName: string, expected: Error): void
            {
                assert.throws(() => json.getNull(propertyName).await(),
                    expected);
            }

            getNullErrorTest(JsonObject.create(), undefined!, new NotFoundError("The key undefined was not found in the map."));
            getNullErrorTest(JsonObject.create(), null!, new NotFoundError("The key null was not found in the map."));
            getNullErrorTest(JsonObject.create(), "", new NotFoundError("The key \"\" was not found in the map."));
            getNullErrorTest(JsonObject.create(), "abc", new NotFoundError("The key \"abc\" was not found in the map."));
            getNullErrorTest(JsonObject.create().set("abc", "def"), "abc", new WrongTypeError("Expected JsonNull but found JsonString."));

            function getNullTest(json: JsonObject, propertyName: string): void
            {
                assert.deepStrictEqual(json.getNull(propertyName).await(), JsonNull.create());
            }

            getNullTest(JsonObject.create().set("def", null), "def");
        });

        suite("getString(string)", () =>
        {
            function getStringErrorTest(json: JsonObject, propertyName: string, expected: Error): void
            {
                test(`with ${json} and ${escapeAndQuote(propertyName)}`, () =>
                {
                    assert.throws(() => json.getString(propertyName).await(),
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
                test(`with ${json} and ${escapeAndQuote(propertyName)}`, () =>
                {
                    assert.deepStrictEqual(json.getString(propertyName).await(), expected);
                });
            }

            getStringTest(JsonObject.create().set("def", "ghi"), "def", JsonString.create("ghi"));
        });

        suite("getStringValue(string)", () =>
        {
            function getStringValueErrorTest(json: JsonObject, propertyName: string, expected: Error): void
            {
                test(`with ${json} and ${escapeAndQuote(propertyName)}`, () =>
                {
                    assert.throws(() => json.getStringValue(propertyName).await(),
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
                test(`with ${json} and ${escapeAndQuote(propertyName)}`, () =>
                {
                    assert.deepStrictEqual(json.getStringValue(propertyName).await(), expected);
                });
            }

            getStringValueTest(JsonObject.create().set("def", "ghi"), "def", "ghi");
        });
    });
});