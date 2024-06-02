import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { join, ArrayIterator, PreConditionError } from "../sources/";
import { iteratorTests } from "./iteratorTests";

function test(runner: TestRunner): void
{
    runner.testFile("arrayIterator.ts", () =>
    {
        runner.testType(ArrayIterator.name, () =>
        {
            iteratorTests(runner, () => ArrayIterator.create<number>([]));

            runner.testFunction("create(T[])", () =>
            {
                function createErrorTest<T>(value: T[], expectedError: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => ArrayIterator.create(value), expectedError);
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
                    runner.test(`with "${runner.andList(values)}"`, (test: Test) =>
                    {
                        const iterator: ArrayIterator<T> = ArrayIterator.create(values);

                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                        test.assertThrows(() => iterator.getCurrentIndex(),
                            new PreConditionError(join("\n", [
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ])));
                        test.assertThrows(() => iterator.getCurrent(),
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

            runner.testFunction("start()", (test: Test) =>
            {
                const iterator: ArrayIterator<string> = ArrayIterator.create(["a", "b", "c"]);
                test.assertFalse(iterator.hasStarted());

                for (let i: number = 0; i < 2; i++)
                {
                    const startResult = iterator.start();
                    test.assertSame(startResult, iterator);
                    test.assertTrue(iterator.hasStarted());
                    test.assertTrue(iterator.hasCurrent());
                    test.assertSame(iterator.getCurrent(), "a");
                    test.assertSame(iterator.getCurrentIndex(), 0);
                }
            });

            runner.testFunction("takeCurrent()", (test: Test) =>
            {
                const values: string[] = ["a", "b", "c"];
                const iterator: ArrayIterator<string> = ArrayIterator.create(values);

                test.assertThrows(() => iterator.takeCurrent(),
                        new PreConditionError(join("\n", [
                            "Expression: iterator.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ])));
                    test.assertFalse(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());

                iterator.start();
                for (let i = 0; i < values.length; i++)
                {
                    test.assertSame(iterator.takeCurrent(), values[i]);
                    test.assertTrue(iterator.hasStarted());
                    test.assertSame(iterator.hasCurrent(), (i < values.length - 1));
                }

                for (let i = 0; i < 2; i++)
                {
                    test.assertThrows(() => iterator.takeCurrent(),
                        new PreConditionError(join("\n", [
                            "Expression: iterator.hasCurrent()",
                            "Expected: true",
                            "Actual: false",
                        ])));
                    test.assertTrue(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                }
            });

            runner.testFunction("next()", () =>
            {
                function nextTest<T>(values: T[]): void
                {
                    runner.test(`with "${runner.andList(values)}"`, (test: Test) =>
                    {
                        const iterator: ArrayIterator<T> = ArrayIterator.create(values);

                        for (let i = 0; i < values.length; i++)
                        {
                            test.assertTrue(iterator.next());
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertSame(iterator.getCurrentIndex(), i);
                            test.assertSame(iterator.getCurrent(), values[i]);
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(iterator.next());
                            test.assertTrue(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                            test.assertThrows(() => iterator.getCurrentIndex(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected: true",
                                    "Actual: false"));
                            test.assertThrows(() => iterator.getCurrent(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected: true",
                                    "Actual: false"));
                        }
                    });
                }

                nextTest(["a"]);
                nextTest(["a", "b", "c"]);
            });

            runner.testGroup("for...of()", () =>
            {
                function forOfTest<T>(values: T[]): void
                {
                    runner.test(`with "${runner.andList(values)}"`, (test: Test) =>
                    {
                        const iterator: ArrayIterator<T> = ArrayIterator.create(values);

                        let expectedIndex: number = 0;
                        for (const c of iterator)
                        {
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertSame(iterator.getCurrentIndex(), expectedIndex);
                            test.assertSame(iterator.getCurrent(), values[expectedIndex]);
                            test.assertSame(c, values[expectedIndex]);
                            expectedIndex++;
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(iterator.next());
                            test.assertTrue(iterator.hasStarted());
                            test.assertFalse(iterator.hasCurrent());
                            test.assertThrows(() => iterator.getCurrentIndex(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected: true",
                                    "Actual: false"));
                            test.assertThrows(() => iterator.getCurrent(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected: true",
                                    "Actual: false"));
                        }
                    });
                }

                forOfTest([]);
                forOfTest(["a"]);
                forOfTest(["a", "b", "c"]);
            });

            runner.testFunction("any()", () =>
            {
                function anyTest<T>(values: T[], expected: boolean): void
                {
                    runner.test(`with ${runner.andList(values)}`, (test: Test) =>
                    {
                        const iterator: ArrayIterator<T> = ArrayIterator.create(values);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(iterator.any(), expected);
                        }
                    });
                }

                anyTest([], false);
                anyTest([1], true);
                anyTest(["a", "b"], true);
                anyTest([false, false, true, true], true);
            });

            runner.testFunction("getCount()", () =>
            {
                function getCountTest<T>(values: T[], expected: number): void
                {
                    runner.test(`with ${runner.andList(values)}`, (test: Test) =>
                    {
                        const iterator: ArrayIterator<T> = ArrayIterator.create(values);
                        test.assertSame(iterator.getCount(), expected);
                        for (let i = 0; i < 3; i++)
                        {
                            test.assertSame(iterator.getCount(), 0);
                        }
                    });
                }

                getCountTest([], 0);
                getCountTest([1], 1);
                getCountTest(["a", "b"], 2);
                getCountTest([false, false, true, true], 4);
            });

            runner.testFunction("toArray()", () =>
            {
                function toArrayTest<T>(values: T[]): void
                {
                    runner.test(`with ${runner.andList(values)}`, (test: Test) =>
                    {
                        const iterator: ArrayIterator<T> = ArrayIterator.create(values);
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());

                        const iteratorValues: T[] = iterator.toArray();
                        test.assertEqual(iteratorValues, values);
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                    });
                }

                toArrayTest([]);
                toArrayTest([1]);
                toArrayTest(["a", "b", "c"]);
            });
        });
    });
}

test(TestRunner.create());