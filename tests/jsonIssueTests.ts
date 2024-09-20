import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { DocumentPosition, DocumentRange, JsonIssue, PreConditionError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonIssue.ts", () =>
    {
        runner.testType(JsonIssue.name, () =>
        {
            runner.testFunction("create(string,DocumentRange)", () =>
            {
                function createErrorTest(message: string, range: DocumentRange, expected: Error): void
                {
                    runner.test(`with ${runner.andList([message, range])}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonIssue.create(message, range), expected);
                    });
                }

                createErrorTest(
                    undefined!,
                    DocumentRange.create(DocumentPosition.create(4, 3, 2)),
                    new PreConditionError(
                        "Expression: message",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                createErrorTest(
                    null!,
                    DocumentRange.create(DocumentPosition.create(4, 3, 2)),
                    new PreConditionError(
                        "Expression: message",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );
                createErrorTest(
                    "",
                    DocumentRange.create(DocumentPosition.create(4, 3, 2)),
                    new PreConditionError(
                        "Expression: message",
                        "Expected: not empty",
                        "Actual: \"\"",
                    ),
                );
                createErrorTest(
                    "fake message",
                    undefined!,
                    new PreConditionError(
                        "Expression: range",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ),
                );
                createErrorTest(
                    "fake message",
                    null!,
                    new PreConditionError(
                        "Expression: range",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ),
                );

                function createTest(message: string, range: DocumentRange): void
                {
                    runner.test(`with ${runner.andList([message, range])}`, (test: Test) =>
                    {
                        const issue: JsonIssue = JsonIssue.create(message, range);
                        test.assertNotUndefinedAndNotNull(issue);
                        test.assertSame(message, issue.getMessage());
                        test.assertSame(range, issue.getRange());
                    });
                }

                createTest(
                    "abc",
                    DocumentRange.create(DocumentPosition.create(1, 2, 3)),
                );
                createTest(
                    "de",
                    DocumentRange.create(DocumentPosition.create(4, 5, 6)),
                );
            });
        });
    });
}
test(createTestRunner());