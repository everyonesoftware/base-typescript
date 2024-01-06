import * as assert from "assert";

import { join, ArrayIterator, PreConditionError } from "../sources/";
import { iteratorTests } from "./iteratorTests";

suite("arrayIterator.ts", () =>
{
    suite("ArrayIterator", () =>
    {
        iteratorTests(() => ArrayIterator.create<number>([]));

        suite("create(T[])", () =>
        {
            function createErrorTest<T>(value: T[], expectedError: Error): void
            {
                test(`with ${value}`, () =>
                {
                    assert.throws(() => ArrayIterator.create(value), expectedError);
                });
            }

            createErrorTest(
                undefined!,
                new PreConditionError(join("\n", [
                    "Expression: values",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ])));
            createErrorTest(
                null!,
                new PreConditionError(join("\n", [
                    "Expression: values",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ])));

            function createTest<T>(values: T[]): void
            {
                test(`with "${values}"`, () =>
                {
                    const iterator: ArrayIterator<T> = ArrayIterator.create(values);
                    assert.strictEqual(iterator.hasStarted(), false);
                    assert.strictEqual(iterator.hasCurrent(), false);
                    assert.throws(() => iterator.getCurrentIndex(),
                        new PreConditionError(join("\n", [
                            "Expression: this.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ])));
                    assert.throws(() => iterator.getCurrent(),
                        new PreConditionError(join("\n", [
                            "Expression: this.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ])));
                });
            }

            createTest([]);
            createTest([1]);
            createTest([false, true]);
            createTest([2, "", true]);
        });

        test("start()", () =>
        {
            const iterator: ArrayIterator<string> = ArrayIterator.create(["a", "b", "c"]);
            assert.strictEqual(iterator.hasStarted(), false);

            for (let i: number = 0; i < 2; i++)
            {
                const startResult = iterator.start();
                assert.strictEqual(startResult, iterator);
                assert.strictEqual(iterator.hasStarted(), true);
                assert.strictEqual(iterator.hasCurrent(), true);
                assert.strictEqual(iterator.getCurrent(), "a");
                assert.strictEqual(iterator.getCurrentIndex(), 0);
            }
        });

        test("takeCurrent()", () =>
        {
            const values: string[] = ["a", "b", "c"];
            const iterator: ArrayIterator<string> = ArrayIterator.create(values);

            assert.throws(() => iterator.takeCurrent(),
                    new PreConditionError(join("\n", [
                        "Expression: iterator.hasCurrent()",
                        "Expected: true",
                        "Actual: false",
                    ])));
                assert.strictEqual(iterator.hasStarted(), false);
                assert.strictEqual(iterator.hasCurrent(), false);

            iterator.start();
            for (let i = 0; i < values.length; i++)
            {
                assert.strictEqual(iterator.takeCurrent(), values[i]);
                assert.strictEqual(iterator.hasStarted(), true);
                assert.strictEqual(iterator.hasCurrent(), (i < values.length - 1));
            }

            for (let i = 0; i < 2; i++)
            {
                assert.throws(() => iterator.takeCurrent(),
                    new PreConditionError(join("\n", [
                        "Expression: iterator.hasCurrent()",
                        "Expected: true",
                        "Actual: false",
                    ])));
                assert.strictEqual(iterator.hasStarted(), true);
                assert.strictEqual(iterator.hasCurrent(), false);
            }
        });

        suite("next()", () =>
        {
            function nextTest<T>(values: T[]): void
            {
                test(`with "${JSON.stringify(values)}"`, () =>
                {
                    const iterator: ArrayIterator<T> = ArrayIterator.create(values);

                    for (let i = 0; i < values.length; i++)
                    {
                        assert.strictEqual(iterator.next(), true);
                        assert.strictEqual(iterator.hasStarted(), true);
                        assert.strictEqual(iterator.hasCurrent(), true);
                        assert.strictEqual(iterator.getCurrentIndex(), i);
                        assert.strictEqual(iterator.getCurrent(), values[i]);
                    }

                    for (let i = 0; i < 2; i++)
                    {
                        assert.strictEqual(iterator.next(), false);
                        assert.strictEqual(iterator.hasStarted(), true);
                        assert.strictEqual(iterator.hasCurrent(), false);
                        assert.throws(() => iterator.getCurrentIndex(),
                            new PreConditionError([
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ].join("\n")));
                        assert.throws(() => iterator.getCurrent(),
                            new PreConditionError([
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ].join("\n")));
                    }
                });
            }

            nextTest(["a"]);
            nextTest(["a", "b", "c"]);
        });

        suite("for...of()", () =>
        {
            function forOfTest<T>(values: T[]): void
            {
                test(`with "${JSON.stringify(values)}"`, () =>
                {
                    const iterator: ArrayIterator<T> = ArrayIterator.create(values);

                    let expectedIndex: number = 0;
                    for (const c of iterator)
                    {
                        assert.strictEqual(iterator.hasStarted(), true);
                        assert.strictEqual(iterator.hasCurrent(), true);
                        assert.strictEqual(iterator.getCurrentIndex(), expectedIndex);
                        assert.strictEqual(iterator.getCurrent(), values[expectedIndex]);
                        assert.strictEqual(c, values[expectedIndex]);
                        expectedIndex++;
                    }

                    for (let i = 0; i < 2; i++)
                    {
                        assert.strictEqual(iterator.next(), false);
                        assert.strictEqual(iterator.hasStarted(), true);
                        assert.strictEqual(iterator.hasCurrent(), false);
                        assert.throws(() => iterator.getCurrentIndex(),
                            new PreConditionError([
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ].join("\n")));
                        assert.throws(() => iterator.getCurrent(),
                            new PreConditionError([
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ].join("\n")));
                    }
                });
            }

            forOfTest([]);
            forOfTest(["a"]);
            forOfTest(["a", "b", "c"]);
        });

        suite("toArray()", () =>
        {
            function toArrayTest<T>(values: T[]): void
            {
                test(`with ${JSON.stringify(values)}`, () =>
                {
                    const iterator: ArrayIterator<T> = ArrayIterator.create(values);
                    assert.strictEqual(iterator.hasStarted(), false);
                    assert.strictEqual(iterator.hasCurrent(), false);

                    const iteratorValues: T[] = iterator.toArray();
                    assert.deepStrictEqual(iteratorValues, values);
                    assert.strictEqual(iterator.hasStarted(), true);
                    assert.strictEqual(iterator.hasCurrent(), false);
                });
            }

            toArrayTest([]);
            toArrayTest([1]);
            toArrayTest(["a", "b", "c"]);
        });
    });
});