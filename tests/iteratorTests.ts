import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Iterator, JavascriptIterable, JavascriptIterator, JavascriptIteratorResult, MapIterator, NotFoundError, PreConditionError } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("iterator.ts", () =>
    {
        runner.testType("Iterator<T>", () =>
        {
            runner.testFunction("create(T[])", () =>
            {
                function createErrorTest<T>(values: T[], expected: Error): void
                {
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        test.assertThrows(() => Iterator.create(values), expected);
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
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        const iterator: Iterator<T> = Iterator.create(values);
                        test.assertEqual(iterator.toArray(), values);
                    });
                }

                createTest([]);
                createTest([1, 2, 3]);
                createTest([false, true]);
            });
        });
    });
}
test(createTestRunner());

export function iteratorTests<T>(runner: TestRunner, creator: () => Iterator<T>): void
{
    runner.testType(Iterator.name, () =>
    {
        runner.testFunction("create()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertNotUndefinedAndNotNull(iterator);
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());
            test.assertThrows(() => iterator.getCurrent(), new PreConditionError(
                "Expression: this.hasCurrent()",
                "Expected: true",
                "Actual: false",
            ));
        });

        runner.testFunction("start()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            for (let i: number = 0; i < 2; i++)
            {
                const startResult: Iterator<T> = iterator.start();
                test.assertSame(startResult, iterator);
                test.assertTrue(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            }
        });

        runner.testFunction("takeCurrent()", () =>
        {
            runner.test("with not started", (test: Test) =>
            {
                const iterator: Iterator<T> = creator();
                test.assertFalse(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());

                for (let i = 0; i < 2; i++)
                {
                    test.assertThrows(() => iterator.takeCurrent(),
                        new PreConditionError(
                            "Expression: iterator.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ));
                    test.assertFalse(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                }
            });

            runner.test("when the Iterator doesn't have a current value", (test: Test) =>
            {
                const iterator: Iterator<T> = creator().start();
                test.assertTrue(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());

                for (let i = 0; i < 2; i++)
                {
                    test.assertThrows(() => iterator.takeCurrent(),
                        new PreConditionError(
                            "Expression: iterator.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ));
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                }
            });
        });

        runner.testFunction("next()", () =>
        {
            runner.test("with not started", (test: Test) =>
            {
                const iterator: Iterator<T> = creator();
                test.assertFalse(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());

                for (let i = 0; i < 2; i++)
                {
                    test.assertFalse(iterator.next());
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                }
            });

            runner.test("with started", (test: Test) =>
            {
                const iterator: Iterator<T> = creator().start();
                test.assertTrue(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());

                for (let i = 0; i < 2; i++)
                {
                    test.assertFalse(iterator.next());
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                }
            });
        });

        runner.testFunction("[Symbol.iterator]()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            const jsIterator: JavascriptIterator<T> = iterator[Symbol.iterator]();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            for (let i = 0; i < 2; i++)
            {
                const result: JavascriptIteratorResult<T> = jsIterator.next();
                test.assertEqual(result.done, true);
                test.assertUndefined(result.value);
                test.assertTrue(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            }
        });

        runner.testFunction("any()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            test.assertFalse(iterator.any());

            test.assertTrue(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());
        });

        runner.testFunction("getCount()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            test.assertEqual(iterator.getCount(), 0);

            test.assertTrue(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());
        });

        runner.testFunction("toArray()", (test: Test) =>
        {
            const iterator: Iterator<T> = creator();
            test.assertFalse(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());

            const array: T[] = iterator.toArray();
            test.assertEqual(array, []);
            test.assertTrue(iterator.hasStarted());
            test.assertFalse(iterator.hasCurrent());
        });

        runner.testFunction("map((TInput)=>TOutput)", () =>
        {
            runner.test("with undefined", (test: Test) =>
            {
                const iterator: Iterator<T> = creator();
                test.assertThrows(() => iterator.map(undefined!), new PreConditionError(
                    "Expression: mapping",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                test.assertFalse(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            });

            runner.test("with null", (test: Test) =>
            {
                const iterator: Iterator<T> = creator();
                test.assertThrows(() => iterator.map(null!), new PreConditionError(
                    "Expression: mapping",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                test.assertFalse(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            });

            runner.test("with not started", (test: Test) =>
            {
                const iterator: Iterator<T> = creator();
                test.assertFalse(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());

                const mapIterator: MapIterator<T,number> = iterator.map(_ => 5);
                test.assertFalse(mapIterator.hasStarted());
                test.assertFalse(mapIterator.hasCurrent());
                test.assertFalse(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            });

            runner.test("with started", (test: Test) =>
            {
                const iterator: Iterator<T> = creator().start();
                test.assertTrue(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());

                const mapIterator: MapIterator<T,number> = iterator.map(_ => 5);
                test.assertTrue(mapIterator.hasStarted());
                test.assertFalse(mapIterator.hasCurrent());
                test.assertTrue(iterator.hasStarted());
                test.assertFalse(iterator.hasCurrent());
            });
        });

        runner.testFunction("first()", () =>
        {
            runner.testGroup("with no condition", () =>
            {
                function firstErrorTest(iterable: JavascriptIterable<string>, expected: Error): void
                {
                    runner.test(`with ${runner.toString(iterable)}`, (test: Test) =>
                    {
                        const iterator: Iterator<string> = Iterator.create(iterable);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(() => { iterator.first().await(); }, expected);
                        }
                    });
                }

                firstErrorTest(
                    [],
                    new NotFoundError("No value was found in the Iterator."),
                );

                function firstTest<T>(iterable: JavascriptIterable<T>, expected: T): void
                {
                    runner.test(`with ${runner.toString(iterable)}`, (test: Test) =>
                    {
                        const iterator: Iterator<T> = Iterator.create(iterable);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertEqual(iterator.first().await(), expected);
                        }
                    });
                }

                firstTest([1], 1);
                firstTest([2, 3], 2);
                firstTest([4, 5, 6, 7, 8], 4);
            });

            runner.testGroup("with condition argument", () =>
            {
                function firstErrorTest<T>(iterable: JavascriptIterable<T>, condition: (value: T) => boolean, expected: Error): void
                {
                    runner.test(`with ${runner.toString(iterable)} and ${condition?.name} condition`, (test: Test) =>
                    {
                        const iterator: Iterator<T> = Iterator.create(iterable);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertThrows(() =>
                            {
                                iterator.first(condition).await();
                            }, expected);
                        }
                    });
                }

                function isOdd(value: number): boolean
                {
                    return value % 2 === 1;
                }

                function isEven(value: number): boolean
                {
                    return value % 2 === 0;
                }

                firstErrorTest(
                    [],
                    undefined!,
                    new NotFoundError("No value was found in the Iterator."),
                );
                firstErrorTest(
                    [],
                    null!,
                    new NotFoundError("No value was found in the Iterator."),
                );
                firstErrorTest(
                    [1],
                    isEven,
                    new NotFoundError("No value was found in the Iterator that matched the provided condition."),
                );
                firstErrorTest(
                    [2, 4],
                    isOdd,
                    new NotFoundError("No value was found in the Iterator that matched the provided condition."),
                );

                function firstTest<T>(iterable: JavascriptIterable<T>, condition: (value: T) => boolean, expected: T): void
                {
                    runner.test(`with ${runner.toString(iterable)} and ${condition?.name} condition`, (test: Test) =>
                    {
                        const iterator: Iterator<T> = Iterator.create(iterable);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertEqual(iterator.first(condition).await(), expected);
                        }
                    });
                }

                firstTest([1], isOdd, 1);
                firstTest([2, 3], isEven, 2);
                firstTest([2, 3], isOdd, 3);
                firstTest([4, 6, 7, 8], isEven, 4);
                firstTest([4, 6, 7, 8], isOdd, 7);
            });
        });

        runner.testFunction("skip(number)", () =>
        {
            function skipErrorTest(iterable: JavascriptIterable<string>, maximumToSkip: number, expected: Error): void
            {
                runner.test(`with ${runner.andList([iterable, maximumToSkip])}`, (test: Test) =>
                {
                    const iterator: Iterator<string> = Iterator.create(iterable);
                    test.assertThrows(() => iterator.skip(maximumToSkip), expected);
                });
            }

            skipErrorTest([], undefined!, new PreConditionError(
                "Expression: maximumToSkip",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            skipErrorTest([], null!, new PreConditionError(
                "Expression: maximumToSkip",
                "Expected: not undefined and not null",
                "Actual: null",
            ));
            skipErrorTest([], 0.5, new PreConditionError(
                "Expression: maximumToSkip",
                "Expected: integer",
                "Actual: 0.5",
            ));
            skipErrorTest([], -1, new PreConditionError(
                "Expression: maximumToSkip",
                "Expected: greater than or equal to 0",
                "Actual: -1",
            ));

            function skipTest(iterable: JavascriptIterable<string>, maximumToSkip: number, expected: JavascriptIterable<string>): void
            {
                runner.test(`with ${runner.andList([iterable, maximumToSkip])}`, (test: Test) =>
                {
                    const iterator: Iterator<string> = Iterator.create(iterable);
                    const skipIterator: Iterator<string> = iterator.skip(maximumToSkip);
                    test.assertEqual(expected, skipIterator.toArray());
                });
            }

            skipTest([], 0, []);
            skipTest([], 1, []);
            skipTest([], 2, []);
            skipTest(["a", "b", "c"], 0, ["a", "b", "c"]);
            skipTest(["a", "b", "c"], 1, ["b", "c"]);
            skipTest(["a", "b", "c"], 2, ["c"]);
            skipTest(["a", "b", "c"], 3, []);
            skipTest(["a", "b", "c"], 4, []);
        });
    });
}