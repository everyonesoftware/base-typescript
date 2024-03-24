import * as assert from "assert";

import { Comparison, NumberComparer, andList, toString } from "../sources";

suite("numberComparer.ts", () =>
{
    suite("NumberComparer", () =>
    {
        suite("compare(number, number)", () =>
        {
            function compareTest(left: number, right: number, expected: Comparison): void
            {
                test(`with ${andList([left, right].map(value => toString(value)))}`, () =>
                {
                    const comparer: NumberComparer = NumberComparer.create();
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