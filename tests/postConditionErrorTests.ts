import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { PostConditionError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("postConditionError.ts", () =>
    {
        runner.testType(PostConditionError.name, () =>
        {
            runner.testFunction("constructor(string|undefined)", () =>
            {
                runner.test("with no arguments", (test: Test) =>
                {
                    const error: PostConditionError = new PostConditionError();
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
