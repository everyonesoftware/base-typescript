import * as assert from "assert";

import { Iterator, JavascriptIterator, JavascriptIteratorResult, MapIterator, PreConditionError } from "../sources/index";

suite("iterator.ts", () =>
{
    suite("Iterator<T>", () =>
    {
        suite("create(T[])", () =>
        {
            function createErrorTest<T>(values: T[], expected: Error): void
            {
                test(`with ${JSON.stringify(values)}`, () =>
                {
                    assert.throws(() => Iterator.create(values), expected);
                });
            }

            createErrorTest(undefined!, new PreConditionError(
                "Expression: values",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            createErrorTest(null!, new PreConditionError(
                "Expression: values",
                "Expected: not undefined and not null",
                "Actual: null",
            ));

            function createTest<T>(values: T[]): void
            {
                test(`with ${JSON.stringify(values)}`, () =>
                {
                    const iterator: Iterator<T> = Iterator.create(values);
                    assert.deepStrictEqual(iterator.toArray(), values);
                });
            }

            createTest([]);
            createTest([1, 2, 3]);
            createTest([false, true]);
        });
    });
});

export function iteratorTests<T>(creator: () => Iterator<T>): void
{
    suite(Iterator.name, () =>
    {
        test("create()", () =>
        {
            const iterator: Iterator<T> = creator();
            assert.notStrictEqual(iterator, undefined);
            assert.strictEqual(iterator.hasStarted(), false);
            assert.strictEqual(iterator.hasCurrent(), false);
            assert.throws(() => iterator.getCurrent(), new PreConditionError(
                "Expression: this.hasCurrent()",
                "Expected: true",
                "Actual: false",
            ));
        });

        test("start()", () =>
        {
            const iterator: Iterator<T> = creator();
            assert.strictEqual(iterator.hasStarted(), false);
            assert.strictEqual(iterator.hasCurrent(), false);

            for (let i: number = 0; i < 2; i++)
            {
                const startResult: Iterator<T> = iterator.start();
                assert.strictEqual(startResult, iterator);
                assert.strictEqual(iterator.hasStarted(), true);
                assert.strictEqual(iterator.hasCurrent(), false);
            }
        });

        suite("takeCurrent()", () =>
        {
            test("with not started", () =>
            {
                const iterator: Iterator<T> = creator();
                assert.strictEqual(iterator.hasStarted(), false);
                assert.strictEqual(iterator.hasCurrent(), false);

                for (let i = 0; i < 2; i++)
                {
                    assert.throws(() => iterator.takeCurrent(),
                        new PreConditionError(
                            "Expression: iterator.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ));
                    assert.strictEqual(iterator.hasStarted(), false);
                    assert.strictEqual(iterator.hasCurrent(), false);
                }
            });

            test("when the Iterator doesn't have a current value", () =>
            {
                const iterator: Iterator<T> = creator().start();
                assert.strictEqual(iterator.hasStarted(), true);
                assert.strictEqual(iterator.hasCurrent(), false);

                for (let i = 0; i < 2; i++)
                {
                    assert.throws(() => iterator.takeCurrent(),
                        new PreConditionError(
                            "Expression: iterator.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ));
                    assert.strictEqual(iterator.hasStarted(), true);
                    assert.strictEqual(iterator.hasCurrent(), false);
                }
            });
        });

        suite("next()", () =>
        {
            test("with not started", () =>
            {
                const iterator: Iterator<T> = creator();
                assert.strictEqual(iterator.hasStarted(), false);
                assert.strictEqual(iterator.hasCurrent(), false);

                for (let i = 0; i < 2; i++)
                {
                    assert.strictEqual(iterator.next(), false);
                    assert.strictEqual(iterator.hasStarted(), true);
                    assert.strictEqual(iterator.hasCurrent(), false);
                }
            });

            test("with started", () =>
            {
                const iterator: Iterator<T> = creator().start();
                assert.strictEqual(iterator.hasStarted(), true);
                assert.strictEqual(iterator.hasCurrent(), false);

                for (let i = 0; i < 2; i++)
                {
                    assert.strictEqual(iterator.next(), false);
                    assert.strictEqual(iterator.hasStarted(), true);
                    assert.strictEqual(iterator.hasCurrent(), false);
                }
            });
        });

        test("[Symbol.iterator]()", () =>
        {
            const iterator: Iterator<T> = creator();
            assert.strictEqual(iterator.hasStarted(), false);
            assert.strictEqual(iterator.hasCurrent(), false);

            const jsIterator: JavascriptIterator<T> = iterator[Symbol.iterator]();
            assert.strictEqual(iterator.hasStarted(), false);
            assert.strictEqual(iterator.hasCurrent(), false);

            for (let i = 0; i < 2; i++)
            {
                const result: JavascriptIteratorResult<T> = jsIterator.next();
                assert.strictEqual(result.done, true);
                assert.strictEqual(result.value, undefined);
                assert.strictEqual(iterator.hasStarted(), true);
                assert.strictEqual(iterator.hasCurrent(), false);
            }
        });

        test("toArray()", () =>
        {
            const iterator: Iterator<T> = creator();
            assert.strictEqual(iterator.hasStarted(), false);
            assert.strictEqual(iterator.hasCurrent(), false);

            const array: T[] = iterator.toArray();
            assert.deepStrictEqual(array, []);
            assert.strictEqual(iterator.hasStarted(), true);
            assert.strictEqual(iterator.hasCurrent(), false);
        });

        suite("map((TInput)=>TOutput)", () =>
        {
            test("with undefined", () =>
            {
                const iterator: Iterator<T> = creator();
                assert.throws(() => iterator.map(undefined!), new PreConditionError(
                    "Expression: mapping",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                assert.strictEqual(iterator.hasStarted(), false);
                assert.strictEqual(iterator.hasCurrent(), false);
            });

            test("with null", () =>
            {
                const iterator: Iterator<T> = creator();
                assert.throws(() => iterator.map(null!), new PreConditionError(
                    "Expression: mapping",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                assert.strictEqual(iterator.hasStarted(), false);
                assert.strictEqual(iterator.hasCurrent(), false);
            });

            test("with not started", () =>
            {
                const iterator: Iterator<T> = creator();
                assert.strictEqual(iterator.hasStarted(), false);
                assert.strictEqual(iterator.hasCurrent(), false);

                const mapIterator: MapIterator<T,number> = iterator.map(_ => 5);
                assert.strictEqual(mapIterator.hasStarted(), false);
                assert.strictEqual(mapIterator.hasCurrent(), false);
                assert.strictEqual(iterator.hasStarted(), false);
                assert.strictEqual(iterator.hasCurrent(), false);
            });

            test("with started", () =>
            {
                const iterator: Iterator<T> = creator().start();
                assert.strictEqual(iterator.hasStarted(), true);
                assert.strictEqual(iterator.hasCurrent(), false);

                const mapIterator: MapIterator<T,number> = iterator.map(_ => 5);
                assert.strictEqual(mapIterator.hasStarted(), true);
                assert.strictEqual(mapIterator.hasCurrent(), false);
                assert.strictEqual(iterator.hasStarted(), true);
                assert.strictEqual(iterator.hasCurrent(), false);
            });
        });
    });
}