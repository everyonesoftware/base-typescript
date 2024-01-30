import * as assert from "assert";

import { JsonObject, JsonProperty, JsonSegment, JsonSegmentType, PreConditionError, andList, escapeAndQuote, toString } from "../sources";

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
            setErrorTest(
                "abc",
                null!,
                new PreConditionError(
                    "Expression: propertyValue",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

            function setTest(propertyName: string, propertyValue: JsonSegment): void
            {
                const json: JsonObject = JsonObject.create();
                const setResult: JsonObject = json.set(propertyName, propertyValue);
                assert.strictEqual(setResult, json);
                assert.strictEqual(json.getCount(), 1);
                assert.strictEqual(json.get(propertyName), propertyValue);
            }

            setTest("abc", JsonSegment.null());
            setTest("abc", JsonSegment.boolean(true));
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
                const json: JsonObject = JsonObject.create();
                const setResult: JsonObject = json.set(property);
                assert.strictEqual(setResult, json);
                assert.strictEqual(json.getCount(), 1);
                assert.strictEqual(json.get(property.getName()), property.getValue());
            }

            setTest(JsonProperty.create("abc", JsonSegment.null()));
            setTest(JsonProperty.create("abc", JsonSegment.boolean(false)));
        });
    });
});