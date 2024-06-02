import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { PreConditionError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("preConditionError.ts", () =>
    {
        runner.testType(PreConditionError.name, () =>
        {
            runner.testFunction("constructor(string|undefined)", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const error: PreConditionError = new PreConditionError();
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