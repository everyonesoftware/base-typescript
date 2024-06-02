import { PreConditionError, Test, TestRunner, WriteStream } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("writeStream.ts", () =>
    {
        runner.testFunction("getStartIndex(number | undefined)", () =>
        {
            function getStartIndexErrorTest(value: number | undefined, expectedError: Error): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertThrows(() => WriteStream.getStartIndex(value), expectedError);
                });
            }

            getStartIndexErrorTest(-1, new PreConditionError(
                "Expression: startIndex === undefined || startIndex === null || 0 <= startIndex",
                "Expected: true",
                "Actual: false"));
            getStartIndexErrorTest(-2, new PreConditionError(
                "Expression: startIndex === undefined || startIndex === null || 0 <= startIndex",
                "Expected: true", 
                "Actual: false"));

            function getStartIndexTest(value: number | undefined, expected: number): void
            {
                runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                {
                    test.assertEqual(WriteStream.getStartIndex(value), expected);
                });
            }

            getStartIndexTest(undefined, 0);
            getStartIndexTest(null!, 0);
            getStartIndexTest(0, 0);
            getStartIndexTest(1, 1);
        });

        runner.testFunction("getLength(number, number, number | undefined)", () =>
        {
            function getLengthErrorTest(maximumLength: number, startIndex: number, length: number | undefined, expectedError: Error): void
            {
                runner.test(`with ${runner.andList([maximumLength, startIndex, length])}`, (test: Test) =>
                {
                    test.assertThrows(() => WriteStream.getLength(maximumLength, startIndex, length), expectedError);
                });
            }

            getLengthErrorTest(undefined!, 0, 0, new PreConditionError(
                "Expression: sourceLength",
                "Expected: not undefined and not null",
                "Actual: undefined"));
            getLengthErrorTest(null!, 0, 0, new PreConditionError(
                "Expression: sourceLength",
                "Expected: not undefined and not null",
                "Actual: null"));
            getLengthErrorTest(0, undefined!, 0, new PreConditionError(
                "Expression: startIndex",
                "Expected: not undefined and not null",
                "Actual: undefined"));
            getLengthErrorTest(0, null!, 0, new PreConditionError(
                "Expression: startIndex",
                "Expected: not undefined and not null",
                "Actual: null"));
            getLengthErrorTest(0, 1, 0, new PreConditionError(
                "Expression: startIndex",
                "Expected: 0",
                "Actual: 1"));
            getLengthErrorTest(0, 2, 0, new PreConditionError(
                "Expression: startIndex",
                "Expected: 0",
                "Actual: 2"));

            function getLengthTest(maximumLength: number, startIndex: number, length: number | undefined, expectedLength: number): void
            {
                runner.test(`with ${runner.andList([maximumLength, startIndex, length])}`, (test: Test) =>
                {
                    test.assertEqual(WriteStream.getLength(maximumLength, startIndex, length), expectedLength);
                });
            }

            getLengthTest(0, 0, undefined, 0);
            getLengthTest(0, 0, null!, 0);
            getLengthTest(0, 0, 0, 0);

            getLengthTest(1, 0, undefined, 1);
            getLengthTest(1, 0, null!, 1);
            getLengthTest(1, 0, 0, 0);
            getLengthTest(1, 0, 1, 1);

            getLengthTest(1, 1, undefined, 0);
            getLengthTest(1, 1, null!, 0);
            getLengthTest(1, 1, 0, 0);

            getLengthTest(2, 0, undefined, 2);
            getLengthTest(2, 0, null!, 2);
            getLengthTest(2, 0, 0, 0);
            getLengthTest(2, 0, 1, 1);
            getLengthTest(2, 0, 2, 2);
        });
    });
}
test(MochaTestRunner.create());