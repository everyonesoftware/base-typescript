import { Iterable, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("iterable.ts", () =>
    {
        runner.testType("Iterable<T>", () =>
        {
            runner.testFunction("create(JavascriptIterable<T>|undefined)", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create();
                    test.assertNotUndefinedAndNotNull(iterable);
                    test.assertEqual(iterable.toArray(), []);
                    test.assertEqual(iterable.getCount(), 0);
                });

                runner.test("with empty array", (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create<number>([]);
                    test.assertNotUndefinedAndNotNull(iterable);
                    test.assertEqual(iterable.toArray(), []);
                    test.assertEqual(iterable.getCount(), 0);
                });

                runner.test("with non-empty array", (test: Test) =>
                {
                    const iterable: Iterable<number> = Iterable.create([1, 2, 3]);
                    test.assertNotUndefinedAndNotNull(iterable);
                    test.assertEqual(iterable.toArray(), [1, 2, 3]);
                    test.assertEqual(iterable.getCount(), 3);
                });
            });
        });
    });
}
test(MochaTestRunner.create());