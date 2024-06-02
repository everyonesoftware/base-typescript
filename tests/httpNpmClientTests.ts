import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { HttpClient, HttpNpmClient, Pre, PreConditionError } from "../sources";
import { npmClientTests } from "./npmClientTests";

export function test(runner: TestRunner): void
{
    runner.testFile("httpNpmClient.ts", () =>
    {
        runner.testType(HttpNpmClient.name, () =>
        {
            runner.testFunction("create(HttpClient)", () =>
            {
                function createErrorTest(testName: string, httpClient: HttpClient, expected: Error): void
                {
                    Pre.condition.assertNotEmpty(testName, "testName");

                    runner.test(testName, (test: Test) =>
                    {
                        test.assertThrows(() => HttpNpmClient.create(httpClient),
                            expected);
                    });
                }

                createErrorTest(
                    "with undefined",
                    undefined!,
                    new PreConditionError(
                        "Expression: httpClient",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));
                createErrorTest(
                    "with null",
                    null!,
                    new PreConditionError(
                        "Expression: httpClient",
                        "Expected: not undefined and not null",
                        "Actual: null"));

                runner.test("with defined", (test: Test) =>
                {
                    const httpClient: HttpClient = HttpClient.create();
                    const npmClient: HttpNpmClient = HttpNpmClient.create(httpClient);
                    test.assertNotUndefinedAndNotNull(npmClient);
                });
            });

            npmClientTests(runner, () => HttpNpmClient.create(HttpClient.create()));
        });
    });
}
test(TestRunner.create());