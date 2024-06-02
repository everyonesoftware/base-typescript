import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JsonBoolean, JsonNull, JsonNumber, JsonObject, JsonSegment, JsonSegmentType, JsonString, PreConditionError } from "../sources/";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonSegment.ts", () =>
    {
        runner.testType(JsonSegment.name, () =>
        {
            runner.testFunction("boolean(boolean)", () =>
            {
                function booleanErrorTest(value: boolean, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonSegment.boolean(value), expected);
                    });
                }

                booleanErrorTest(undefined!, new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                booleanErrorTest(null!, new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function booleanTest(value: boolean): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const json: JsonBoolean = JsonSegment.boolean(value);
                        test.assertSame(json.getValue(), value);
                        test.assertEqual(json.getSegmentType(), JsonSegmentType.Boolean);
                    });
                }

                booleanTest(false);
                booleanTest(true);
            });

            runner.testFunction("number(number)", () =>
            {
                function numberErrorTest(value: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonSegment.number(value), expected);
                    });
                }

                numberErrorTest(undefined!, new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                numberErrorTest(null!, new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function numberTest(value: number): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const json: JsonNumber = JsonSegment.number(value);
                        test.assertSame(json.getValue(), value);
                        test.assertSame(json.getSegmentType(), JsonSegmentType.Number);
                    });
                }

                numberTest(0);
                numberTest(-1);
                numberTest(1);
                numberTest(-0.1);
                numberTest(0.1);
            });

            runner.testFunction("string(string,string,boolean)", () =>
            {
                function stringErrorTest(value: string, quote: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([value, quote])}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonSegment.string(value, quote), expected);
                    });
                }

                stringErrorTest(undefined!, `"`, new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                stringErrorTest(null!, `"`, new PreConditionError(
                    "Expression: value",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                stringErrorTest("", null!, new PreConditionError(
                    "Expression: quote",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                stringErrorTest("", "", new PreConditionError(
                    "Expression: quote.length",
                    "Expected: 1",
                    "Actual: 0",
                ));
                stringErrorTest("", "ab", new PreConditionError(
                    "Expression: quote.length",
                    "Expected: 1",
                    "Actual: 2",
                ));

                function stringTest(value: string, quote: string, expectedQuote: string = quote): void
                {
                    runner.test(`with ${runner.andList([value, quote])}`, (test: Test) =>
                    {
                        const json: JsonString = JsonSegment.string(value, quote);
                        test.assertSame(json.getValue(), value);
                        test.assertSame(json.getQuote(), expectedQuote);
                        test.assertSame(json.getSegmentType(), JsonSegmentType.String);
                    });
                }

                stringTest("", undefined!, `"`);
                stringTest("", `'`);
                stringTest("abc", `'`);
                stringTest("", `'`);
                stringTest("abc", `'`);
            });

            runner.testFunction("null()", (test: Test) =>
            {
                const json: JsonNull = JsonSegment.null();
                test.assertSame(json.getSegmentType(), JsonSegmentType.Null);
                test.assertSame(json.toString(), "null");
            });

            runner.test("object()", (test: Test) =>
            {
                const json: JsonObject = JsonSegment.object();
                test.assertSame(json.getSegmentType(), JsonSegmentType.Object);
                test.assertEqual(json.toArray(), []);
            });
        });
    });
}
test(TestRunner.create());