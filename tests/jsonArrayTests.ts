import * as assert from "assert";

import { Iterable, JavascriptIterable, JsonArray, JsonBoolean, JsonNull, JsonSegment, JsonSegmentType, PreConditionError } from "../sources";

suite("jsonArray.ts", () =>
{
    suite("JsonArray", () =>
    {
        suite("create(JavascriptIterable<JsonSegment>)", () =>
        {
            test("with no arguments", () =>
            {
                const json: JsonArray = JsonArray.create();
                assert.strictEqual(json.getCount(), 0);
                assert.strictEqual(json.toString(), "[]");
                assert.strictEqual(json.getSegmentType(), JsonSegmentType.Array);
            });

            function createErrorTest(testName: string, elements: JavascriptIterable<JsonSegment>, expected: Error): void
            {
                test(testName, () =>
                {
                    assert.throws(() => JsonArray.create(elements), expected);
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

            function createTest(testName: string, elements: JavascriptIterable<JsonSegment|number|boolean|string|null>): void
            {
                test(testName, () =>
                {
                    const elementsIterable: Iterable<JsonSegment> = Iterable.create(elements).map(JsonSegment.toJsonSegment);
                    const json: JsonArray = JsonArray.create(elements);
                    assert.strictEqual(json.getSegmentType(), JsonSegmentType.Array);
                    assert.strictEqual(json.getCount(), elementsIterable.getCount());
                    let index: number = 0;
                    for (const element of elementsIterable)
                    {
                        assert.deepStrictEqual(json.get(index), element);
                        index++;
                    }
                });
            }

            createTest("with no elements", []);
            createTest("with one element", [JsonNull.create()]);
            createTest("with one null element", [null]);
            createTest("with two elements", [JsonBoolean.create(false), JsonNull.create()]);
        });
    });
});