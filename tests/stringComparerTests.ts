import * as assert from "assert";

import { Comparison, StringComparer, andList } from "../sources";

suite("stringComparer.ts", () =>
{
    suite("StringComparer", () =>
    {
        suite("compare(string, string)", () =>
        {
            function compareTest(left: string, right: string, expected: Comparison): void
            {
                test(`with ${andList([left, right])}`, () =>
                {
                    const comparer: StringComparer = StringComparer.create();
                    assert.strictEqual(comparer.compare(left, right), expected);
                    assert.strictEqual(comparer.lessThan(left, right), expected === Comparison.LessThan);
                    assert.strictEqual(comparer.lessThanOrEqual(left, right), expected !== Comparison.GreaterThan);
                    assert.strictEqual(comparer.equal(left, right), expected === Comparison.Equal);
                    assert.strictEqual(comparer.greaterThanOrEqualTo(left, right), expected !== Comparison.LessThan);
                    assert.strictEqual(comparer.greaterThan(left, right), expected === Comparison.GreaterThan);
                });
            }

            compareTest(undefined!, undefined!, Comparison.Equal);
            compareTest(undefined!, null!, Comparison.LessThan);
            compareTest(undefined!, "", Comparison.LessThan);
            compareTest(undefined!, "a", Comparison.LessThan);
            compareTest(undefined!, "def", Comparison.LessThan);

            compareTest(null!, undefined!, Comparison.GreaterThan);
            compareTest(null!, null!, Comparison.Equal);
            compareTest(null!, "", Comparison.LessThan);
            compareTest(null!, "a", Comparison.LessThan);
            compareTest(null!, "def", Comparison.LessThan);

            compareTest("", undefined!, Comparison.GreaterThan);
            compareTest("", null!, Comparison.GreaterThan);
            compareTest("", "", Comparison.Equal);
            compareTest("", "a", Comparison.LessThan);
            compareTest("", "def", Comparison.LessThan);

            compareTest("a", undefined!, Comparison.GreaterThan);
            compareTest("a", null!, Comparison.GreaterThan);
            compareTest("a", "", Comparison.GreaterThan);
            compareTest("a", "a", Comparison.Equal);
            compareTest("a", "def", Comparison.LessThan);

            compareTest("def", undefined!, Comparison.GreaterThan);
            compareTest("def", null!, Comparison.GreaterThan);
            compareTest("def", "", Comparison.GreaterThan);
            compareTest("def", "a", Comparison.GreaterThan);
            compareTest("def", "def", Comparison.Equal);
        });
    });
});