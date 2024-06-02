import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { NotFoundError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("notFoundError.ts", () =>
    {
        runner.testType(NotFoundError.name, () =>
        {
            runner.testFunction("constructor(...string[])", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const error: NotFoundError = new NotFoundError();
                    test.assertNotUndefinedAndNotNull(error);
                    test.assertEqual(error.name, "Error");
                    test.assertEqual(error.message, "");
                    test.assertNotUndefinedAndNotNull(error.stack);
                });
            });
        });
    });
}
test(TestRunner.create());
