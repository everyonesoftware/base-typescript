import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JsonDataNull } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDataNull.ts", () =>
    {
        runner.testType(JsonDataNull.name, () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const json: JsonDataNull = JsonDataNull.create();
                test.assertEqual(json.toString(), "null");
                test.assertSame(json, JsonDataNull.create());
                test.assertEqual(json.getTypeDisplayName(), "null");
            });
        });
    });
}
test(createTestRunner());
