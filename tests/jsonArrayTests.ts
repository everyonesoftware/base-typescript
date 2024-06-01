import { Iterable, JavascriptIterable, JsonArray, JsonBoolean, JsonNull, JsonSegment, JsonSegmentType, PreConditionError, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonArray.ts", () =>
    {
        runner.testType(JsonArray, () =>
        {
            runner.testFunction("create(JavascriptIterable<JsonSegment>)", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const json: JsonArray = JsonArray.create();
                    test.assertEqual(json.getCount(), 0);
                    test.assertEqual(json.toString(), "[]");
                    test.assertEqual(json.getSegmentType(), JsonSegmentType.Array);
                });

                function createErrorTest(testName: string, elements: JavascriptIterable<JsonSegment>, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => JsonArray.create(elements), expected);
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
                    runner.test(testName, (test: Test) =>
                    {
                        const elementsIterable: Iterable<JsonSegment> = Iterable.create(elements).map(JsonSegment.toJsonSegment);
                        const json: JsonArray = JsonArray.create(elements);
                        test.assertEqual(json.getSegmentType(), JsonSegmentType.Array);
                        test.assertEqual(json.getCount(), elementsIterable.getCount());
                        let index: number = 0;
                        for (const element of elementsIterable)
                        {
                            test.assertEqual(json.get(index), element);
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
}
test(MochaTestRunner.create());