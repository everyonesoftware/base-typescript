import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Iterable, List, Map, ToStringFunctions, TokenType } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("toStringFunctions.ts", () =>
    {
        runner.testType(ToStringFunctions.name, () =>
        {
            runner.testFunction("toString(unknown)", () =>
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
                toStringTest(NaN, "NaN");
                toStringTest(Infinity, "Infinity");
                toStringTest(-Infinity, "-Infinity");
                toStringTest(1.2, "1.2");
                toStringTest("hello\tthere\nfriend", `"hello\\tthere\\nfriend"`);
                toStringTest({}, "{}");
                toStringTest({1:"one", b: "two"}, `{"1":"one","b":"two"}`);
                toStringTest([], "[]");
                toStringTest([undefined, undefined], "[undefined,undefined]");
                toStringTest([1, 2.3, false], "[1,2.3,false]");
                toStringTest([[[]]], "[[[]]]");
                toStringTest(Iterable.create(), `[]`);
                toStringTest(Iterable.create<string>(["abc"]), `["abc"]`);
                toStringTest(Iterable.create([1, 2, 3]), `[1,2,3]`);
                toStringTest(List.create(), `[]`);
                toStringTest(List.create<string>(["abc"]), `["abc"]`);
                toStringTest(List.create([1, 2, 3]), `[1,2,3]`);
                toStringTest(Map.create(), `{}`);
                toStringTest(Map.create<string,number>().set("a", 1), `{"a":1}`);
                toStringTest(TokenType.CarriageReturn, "1");
            });
        });
    });
}
test(createTestRunner());