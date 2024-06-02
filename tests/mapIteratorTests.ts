import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Iterator, MapIterator, PreConditionError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("mapIterator.ts", () =>
    {
        runner.testType(MapIterator.name, () =>
        {
            runner.testFunction("create(Iterator<TInput>,(TInput)=>TOutput)", () =>
            {
                function createErrorTest<TInput,TOutput>(testName: string, innerIterator: Iterator<TInput>, mapping: (value: TInput) => TOutput, expected: Error): void
                {
                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => MapIterator.create(innerIterator, mapping), expected);
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
        
                runner.test("with valid values", (test: Test) =>
                {
                    const inputIterator: Iterator<number> = Iterator.create([1, 2, 3]);
                    test.assertFalse(inputIterator.hasStarted());
                    test.assertFalse(inputIterator.hasCurrent());
        
                    const iterator: MapIterator<number,string> = MapIterator.create(inputIterator, (value: number) => value.toString());
                    test.assertFalse(iterator.hasStarted());
                    test.assertFalse(iterator.hasCurrent());
                });
            });
        });
    });
}
test(TestRunner.create());