import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Iterable, List, ToStringFunctions, isIterable } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("toStringFunctions.ts", () =>
    {
        runner.testType(ToStringFunctions.name, () =>
        {
            runner.testFunction("toString(unknown)", () =>
            {
                runner.testGroup("with default functions", () =>
                {
                    function toStringTest(value: unknown, expected: string)
                    {
                        runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                        {
                            const functions: ToStringFunctions = ToStringFunctions.create();
                            test.assertSame(functions.toString(value), expected);
                        });
                    }

                    toStringTest(undefined, "undefined");
                    toStringTest(null, "null");
                    toStringTest(false, "false");
                    toStringTest(true, "true");
                    toStringTest(50, "50");
                    toStringTest(1.2, "1.2");
                    toStringTest("hello\tthere\nfriend", `"hello\\tthere\\nfriend"`);
                    toStringTest({}, "{}");
                    toStringTest({1:"one", b: "two"}, `{"1":"one","b":"two"}`);
                    toStringTest([], "[]");
                    toStringTest([undefined, undefined], "[undefined,undefined]");
                    toStringTest([1, 2.3, false], "[1,2.3,false]");
                    toStringTest([[[]]], "[[[]]]");
                    toStringTest(List.create(), `{"array":[]}`);
                    toStringTest(List.create<string>(["abc"]), `{"array":["abc"]}`);
                    toStringTest(List.create([1, 2, 3]), `{"array":[1,2,3]}`);
                });

                runner.testGroup("with Iterable.toString()", () =>
                {
                    function toStringTest(value: unknown, expected: string)
                    {
                        runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                        {
                            const functions: ToStringFunctions = ToStringFunctions.create();
                            functions.add(isIterable, (value: Iterable<unknown>) => Iterable.toString(value, functions));
                            test.assertSame(functions.toString(value), expected);
                        });
                    }

                    toStringTest(undefined, "undefined");
                    toStringTest(null, "null");
                    toStringTest(false, "false");
                    toStringTest(true, "true");
                    toStringTest(50, "50");
                    toStringTest(1.2, "1.2");
                    toStringTest("hello\tthere\nfriend", `"hello\\tthere\\nfriend"`);
                    toStringTest({}, "{}");
                    toStringTest({1:"one", b: "two"}, `{"1":"one","b":"two"}`);
                    toStringTest([], "[]");
                    toStringTest([undefined, undefined], "[undefined,undefined]");
                    toStringTest([1, 2.3, false], "[1,2.3,false]");
                    toStringTest([[[]]], "[[[]]]");
                    toStringTest(List.create(), `[]`);
                    toStringTest(List.create<string>(["abc"]), `["abc"]`);
                    toStringTest(List.create([1, 2, 3]), `[1,2,3]`);
                });
            });
        });
    });
}
test(TestRunner.create());