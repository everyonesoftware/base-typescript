import { andList, join, PreConditionError, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("english.ts", () =>
    {
        runner.testFunction("andList(string[])", () =>
        {
            function andListErrorTest(values: string[] | undefined | null, expectedError: Error): void
            {
                runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                {
                    test.assertThrows(() => andList(values!), expectedError);
                });
            }

            andListErrorTest(
                undefined,
                new PreConditionError(
                    join("\n", [
                        "Expression: values",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ])));
                    andListErrorTest(
                null,
                new PreConditionError(
                    join("\n", [
                        "Expression: values",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ])));

            function andListTest(values: string[], expected: string): void
            {
                runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                {
                    test.assertEqual(andList(values), expected);
                });
            }

            andListTest([], "");
            andListTest([""], "");
            andListTest(["", ""], " and ");
            andListTest(["", "", ""], ", , and ");
            
            andListTest(["a"], "a");
            andListTest(["a", "b"], "a and b");
            andListTest(["a", "b", "c"], "a, b, and c");
            andListTest(["a", "b", "c", "d"], "a, b, c, and d");
        });
    });
}
test(MochaTestRunner.create());