import { JsonNull, JsonSegmentType, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonNull.ts", () =>
    {
        runner.testType(JsonNull, () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const json: JsonNull = JsonNull.create();
                test.assertEqual(json.getSegmentType(), JsonSegmentType.Null);
                test.assertEqual(json.toString(), "null");
            });
        });
    });
}
test(MochaTestRunner.create());
