import { IndexableIteratorDecorator, Iterator, PreConditionError, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("indexableIteratorDecorator.ts", () =>
    {
        runner.testType("IndexableIteratorDecorator<T>", () =>
        {
            runner.testFunction("create<T>(Iterator<T>)", () =>
            {
                function createErrorTest<T>(testName: string, innerIterator: Iterator<T>, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => IndexableIteratorDecorator.create(innerIterator),
                            expected);
                    });
                }

                createErrorTest("with undefined", undefined!, new PreConditionError(
                    "Expression: innerIterator",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
                createErrorTest("with null", null!, new PreConditionError(
                    "Expression: innerIterator",
                    "Expected: not undefined and not null",
                    "Actual: null"));

                function createTest<T>(innerValues: T[]): void
                {
                    runner.test(`with ${runner.toString(innerValues)}`, (test: Test) =>
                    {
                        const innerIterator: Iterator<T> = Iterator.create(innerValues);
                        const indexableIterator: IndexableIteratorDecorator<T> = IndexableIteratorDecorator.create(innerIterator);
                        test.assertFalse(indexableIterator.hasStarted());
                        test.assertFalse(indexableIterator.hasCurrent());

                        for (let i = 0; i < innerValues.length; i++)
                        {
                            test.assertTrue(indexableIterator.next());
                            test.assertTrue(indexableIterator.hasStarted());
                            test.assertTrue(indexableIterator.hasCurrent());
                            test.assertEqual(indexableIterator.getCurrentIndex(), i);
                            test.assertEqual(indexableIterator.getCurrent(), innerValues[i]);
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertFalse(indexableIterator.next());
                            test.assertTrue(indexableIterator.hasStarted());
                            test.assertFalse(indexableIterator.hasCurrent());
                        }
                    });
                }

                createTest([]);
                createTest([1]);
                createTest([false, true, false]);
            });
        });
    });
}
test(MochaTestRunner.create());