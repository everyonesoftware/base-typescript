import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Post } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("post.ts", () =>
    {
        runner.testType(Post.name, () =>
        {
            runner.test("Condition is not undefined and not null", (test: Test) =>
            {
                test.assertNotUndefinedAndNotNull(Post.condition);
                Post.condition.assertTrue(true);
            });
        });
    });
}
test(createTestRunner());