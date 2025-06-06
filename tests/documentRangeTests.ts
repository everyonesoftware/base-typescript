import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { DocumentPosition, DocumentRange, PreConditionError } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("documentRange.ts", () =>
    {
        runner.testType(DocumentRange.name, () =>
        {
            runner.testFunction("create(DocumentPosition,DocumentPosition?)", () =>
            {
                function createErrorTest(start: DocumentPosition, expected: Error): void
                {
                    runner.test(`with ${runner.toString(start)} and no afterEnd argument`, (test: Test) =>
                    {
                        test.assertThrows(() => DocumentRange.create(start), expected);
                    });
                }

                createErrorTest(undefined!, new PreConditionError(
                    "Expression: start",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, new PreConditionError(
                    "Expression: start",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function createTest(start: DocumentPosition): void
                {
                    runner.test(`with ${runner.toString(start)} and no afterEnd argument`, (test: Test) =>
                    {
                        const range: DocumentRange = DocumentRange.create(start);
                        test.assertNotUndefinedAndNotNull(range);
                        test.assertSame(start, range.getStart());
                        test.assertSame(start, range.getAfterEnd());
                        test.assertFalse(range.contains(start));
                    });
                }

                createTest(DocumentPosition.create());
                createTest(DocumentPosition.create(1, 2, 3));
            });
        });
    });
}
test(createTestRunner());