import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Pre } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("pre.ts", () =>
    {
        runner.testType(Pre.name, () =>
        {
            runner.test("Condition is not undefined and not null", (test: Test) =>
            {
                test.assertNotUndefinedAndNotNull(Pre.condition);
                Pre.condition.assertTrue(true);
            });
        });
    });
}
test(createTestRunner());