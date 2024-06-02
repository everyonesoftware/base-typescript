import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { join, PreConditionError, StringIterator } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("stringIterator.ts", () =>
    {
        runner.testType(StringIterator.name, () =>
        {
            runner.testFunction("create(string)", () =>
            {
                function createErrorTest(value: string | undefined | null, expectedError: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        test.assertThrows(() => StringIterator.create(value!),
                            expectedError);
                    });
                }

                createErrorTest(
                    undefined,
                    new PreConditionError(
                        "Expression: value",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                createErrorTest(
                    null,
                    new PreConditionError(
                        "Expression: value",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));

                function createTest(value: string): void
                {
                    runner.test(`with "${runner.toString(value)}"`, (test: Test) =>
                    {
                        const iterator: StringIterator = StringIterator.create(value);
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                        test.assertThrows(() => iterator.getCurrentIndex(),
                            new PreConditionError(
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ));
                        test.assertThrows(() => iterator.getCurrent(),
                            new PreConditionError(
                                "Expression: this.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ));
                    });
                }

                createTest("");
                createTest("abc");
            });

            runner.testFunction("start()", () =>
            {
                runner.test("with empty iterator", (test: Test) =>
                {
                    const iterator = StringIterator.create("");
                    test.assertFalse(iterator.hasStarted());

                    for (let i: number = 0; i < 2; i++)
                    {
                        const startResult = iterator.start();
                        test.assertSame(startResult, iterator);
                        test.assertTrue(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                    }
                });

                runner.test("with non-empty iterator", (test: Test) =>
                {
                    const iterator = StringIterator.create("abc");
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
            });

            runner.testFunction("takeCurrent()", () =>
            {
                runner.test("when the Iterator doesn't have a current value", (test: Test) =>
                {
                    const iterator: StringIterator = StringIterator.create("");
                    for (let i = 0; i < 2; i++)
                    {
                        test.assertThrows(() => iterator.takeCurrent(),
                            new PreConditionError(join("\n", [
                                "Expression: iterator.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ])));
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());
                    }
                });

                runner.test("when the Iterator has a current value", (test: Test) =>
                {
                    const value: string = "abc";
                    const iterator: StringIterator = StringIterator.create(value);

                    test.assertThrows(() => iterator.takeCurrent(),
                            new PreConditionError(join("\n", [
                                "Expression: iterator.hasCurrent()",
                                "Expected: true",
                                "Actual: false",
                            ])));
                        test.assertFalse(iterator.hasStarted());
                        test.assertFalse(iterator.hasCurrent());

                    iterator.start();
                    for (let i = 0; i < value.length; i++)
                    {
                        test.assertSame(iterator.takeCurrent(), value[i]);
                        test.assertTrue(iterator.hasStarted());
                        test.assertSame(iterator.hasCurrent(), (i < value.length - 1));
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
            });

            runner.testFunction("next()", () =>
            {
                function nextTest(value: string): void
                {
                    runner.test(`with "${runner.toString(value)}"`, (test: Test) =>
                    {
                        const iterator: StringIterator = StringIterator.create(value);

                        for (let i = 0; i < value.length; i++)
                        {
                            test.assertTrue(iterator.next());
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertSame(iterator.getCurrentIndex(), i);
                            test.assertSame(iterator.getCurrent(), value[i]);
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
                                    "Actual: false",
                                ));
                            test.assertThrows(() => iterator.getCurrent(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected: true",
                                    "Actual: false",
                                ));
                        }
                    });
                }

                nextTest("");
                nextTest("a");
                nextTest("abc");
            });

            runner.testGroup("for...of", () =>
            {
                function forOfTest(value: string): void
                {
                    runner.test(`with "${runner.toString(value)}"`, (test: Test) =>
                    {
                        const iterator: StringIterator = StringIterator.create(value);

                        let expectedIndex: number = 0;
                        for (const c of iterator)
                        {
                            test.assertTrue(iterator.hasStarted());
                            test.assertTrue(iterator.hasCurrent());
                            test.assertSame(iterator.getCurrentIndex(), expectedIndex);
                            test.assertSame(iterator.getCurrent(), value[expectedIndex]);
                            test.assertSame(c, value[expectedIndex]);
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
                                    "Actual: false",
                                ));
                            test.assertThrows(() => iterator.getCurrent(),
                                new PreConditionError(
                                    "Expression: this.hasCurrent()",
                                    "Expected: true",
                                    "Actual: false",
                                ));
                        }
                    });
                }

                forOfTest("");
                forOfTest("a");
                forOfTest("abc");
            });
        });
    });
}
test(TestRunner.create());