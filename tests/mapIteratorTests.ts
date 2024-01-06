import * as assert from "assert";

import { Iterator, MapIterator, PreConditionError } from "../sources";

suite(MapIterator.name, () =>
{
    suite("create(Iterator<TInput>,(TInput)=>TOutput)", () =>
    {
        function createErrorTest<TInput,TOutput>(testName: string, innerIterator: Iterator<TInput>, mapping: (value: TInput) => TOutput, expected: Error): void
        {
            test(testName, () =>
            {
                assert.throws(() => MapIterator.create(innerIterator, mapping), expected);
            });
        }

        createErrorTest(
            "with undefined inputIterator",
            undefined!,
            (value: number) => value.toString(),
            new PreConditionError(
                "Expression: inputIterator",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
        createErrorTest(
            "with null inputIterator",
            null!,
            (value: number) => value.toString(),
            new PreConditionError(
                "Expression: inputIterator",
                "Expected: not undefined and not null",
                "Actual: null",
            ));

        test("with valid values", () =>
        {
            const inputIterator: Iterator<number> = Iterator.create([1, 2, 3]);
            assert.strictEqual(inputIterator.hasStarted(), false);
            assert.strictEqual(inputIterator.hasCurrent(), false);

            const iterator: MapIterator<number,string> = MapIterator.create(inputIterator, (value: number) => value.toString());
            assert.strictEqual(iterator.hasStarted(), false);
            assert.strictEqual(iterator.hasCurrent(), false);
        });
    });
});