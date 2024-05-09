import * as assert from "assert";
import { IndexableIteratorDecorator, Iterator, PreConditionError } from "../sources";

suite("indexableIteratorDecorator.ts", () =>
{
    suite("IndexableIteratorDecorator<T>", () =>
    {
        suite("create<T>(Iterator<T>)", () =>
        {
            function createErrorTest<T>(testName: string, innerIterator: Iterator<T>, expected: Error): void
            {
                test(testName, () =>
                {
                    assert.throws(() => IndexableIteratorDecorator.create(innerIterator),
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
                test(`with ${JSON.stringify(innerValues)}`, () =>
                {
                    const innerIterator: Iterator<T> = Iterator.create(innerValues);
                    const indexableIterator: IndexableIteratorDecorator<T> = IndexableIteratorDecorator.create(innerIterator);
                    assert.strictEqual(indexableIterator.hasStarted(), false);
                    assert.strictEqual(indexableIterator.hasCurrent(), false);

                    for (let i = 0; i < innerValues.length; i++)
                    {
                        assert.strictEqual(indexableIterator.next(), true);
                        assert.strictEqual(indexableIterator.hasStarted(), true);
                        assert.strictEqual(indexableIterator.hasCurrent(), true);
                        assert.strictEqual(indexableIterator.getCurrentIndex(), i);
                        assert.strictEqual(indexableIterator.getCurrent(), innerValues[i]);
                    }

                    for (let i = 0; i < 2; i++)
                    {
                        assert.strictEqual(indexableIterator.next(), false);
                        assert.strictEqual(indexableIterator.hasStarted(), true);
                        assert.strictEqual(indexableIterator.hasCurrent(), false);
                    }
                });
            }

            createTest([]);
            createTest([1]);
            createTest([false, true, false]);
        });
    });
});