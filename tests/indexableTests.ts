import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Indexable } from "../sources/";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("indexable.ts", () =>
    {
        runner.testType("Indexable<T>", () =>
        {
            runner.testFunction("create(T[]|Iterable<T>)", () =>
            {
                function createTest<T>(values: T[]): void
                {
                    runner.test(`with ${runner.toString(values)}`, (test: Test) =>
                    {
                        const indexable: Indexable<T> = Indexable.create(values);
                        test.assertEqual(indexable.toArray(), values ?? []);
                    });
                }

                createTest(undefined!);
                createTest(null!);
                createTest([]);
                createTest([1, 2, 3]);
            });
        });
    });
}
test(createTestRunner());