import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JavascriptMapMap } from "../sources";
import { mapTests } from "./mapTests";

export function test(runner: TestRunner): void
{
    runner.testFile("javascriptMapMap.ts", () =>
    {
        runner.testType("JavascriptMapMap<TKey,TValue>", () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const map: JavascriptMapMap<number,string> = JavascriptMapMap.create();
                test.assertEqual(map.getCount(), 0);
            });

            mapTests(runner, JavascriptMapMap.create);
        });
    });
}
test(TestRunner.create());
