import * as assert from "assert";
import { HttpClient, HttpNpmClient, Pre, PreConditionError } from "../sources";
import { npmClientTests } from "./npmClientTests";

suite("httpNpmClient.ts", () =>
{
    suite("HttpNpmClient", () =>
    {
        suite("create(HttpClient)", () =>
        {
            function createErrorTest(testName: string, httpClient: HttpClient, expected: Error): void
            {
                Pre.condition.assertNotEmpty(testName, "testName");

                test(testName, () =>
                {
                    assert.throws(() => HttpNpmClient.create(httpClient),
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

            test("with defined", () =>
            {
                const httpClient: HttpClient = HttpClient.create();
                const npmClient: HttpNpmClient = HttpNpmClient.create(httpClient);
                assert.notStrictEqual(npmClient, undefined);
            });
        });

        npmClientTests(() => HttpNpmClient.create(HttpClient.create()));
    });
});