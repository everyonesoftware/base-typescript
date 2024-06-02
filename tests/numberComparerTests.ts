import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Comparison, NumberComparer } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("numberComparer.ts", () =>
    {
        runner.testType(NumberComparer.name, () =>
        {
            runner.testFunction("compare(number, number)", () =>
            {
                function compareTest(left: number, right: number, expected: Comparison): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                    {
                        const comparer: NumberComparer = NumberComparer.create();
                        test.assertSame(comparer.compare(left, right), expected);
                        test.assertSame(comparer.lessThan(left, right), expected === Comparison.LessThan);
                        test.assertSame(comparer.lessThanOrEqual(left, right), expected !== Comparison.GreaterThan);
                        test.assertSame(comparer.equal(left, right), expected === Comparison.Equal);
                        test.assertSame(comparer.greaterThanOrEqualTo(left, right), expected !== Comparison.LessThan);
                        test.assertSame(comparer.greaterThan(left, right), expected === Comparison.GreaterThan);
                    });
                }

                compareTest(undefined!, undefined!, Comparison.Equal);
                compareTest(undefined!, null!, Comparison.LessThan);
                compareTest(undefined!, -1, Comparison.LessThan);
                compareTest(undefined!, 0, Comparison.LessThan);
                compareTest(undefined!, 1, Comparison.LessThan);

                compareTest(null!, undefined!, Comparison.GreaterThan);
                compareTest(null!, null!, Comparison.Equal);
                compareTest(null!, -1, Comparison.LessThan);
                compareTest(null!, 0, Comparison.LessThan);
                compareTest(null!, 1, Comparison.LessThan);

                compareTest(-1, undefined!, Comparison.GreaterThan);
                compareTest(-1, null!, Comparison.GreaterThan);
                compareTest(-1, -1, Comparison.Equal);
                compareTest(-1, 0, Comparison.LessThan);
                compareTest(-1, 1, Comparison.LessThan);

                compareTest(0, undefined!, Comparison.GreaterThan);
                compareTest(0, null!, Comparison.GreaterThan);
                compareTest(0, -1, Comparison.GreaterThan);
                compareTest(0, 0, Comparison.Equal);
                compareTest(0, 1, Comparison.LessThan);

                compareTest(1, undefined!, Comparison.GreaterThan);
                compareTest(1, null!, Comparison.GreaterThan);
                compareTest(1, -1, Comparison.GreaterThan);
                compareTest(1, 0, Comparison.GreaterThan);
                compareTest(1, 1, Comparison.Equal);
            });
        });
    });
}
test(createTestRunner());
