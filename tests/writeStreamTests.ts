import * as assert from "assert";
import { PreConditionError, WriteStream, andList, toString } from "../sources";

suite("writeStream.ts", () =>
{
    suite("getStartIndex(number | undefined)", () =>
    {
        function getStartIndexErrorTest(value: number | undefined, expectedError: Error): void
        {
            test(`with ${value}`, () =>
            {
                assert.throws(() => WriteStream.getStartIndex(value), expectedError);
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
            test(`with ${value}`, () =>
            {
                assert.strictEqual(WriteStream.getStartIndex(value), expected);
            });
        }

        getStartIndexTest(undefined, 0);
        getStartIndexTest(null!, 0);
        getStartIndexTest(0, 0);
        getStartIndexTest(1, 1);
    });

    suite("getLength(number, number, number | undefined)", () =>
    {
        function getLengthErrorTest(maximumLength: number, startIndex: number, length: number | undefined, expectedError: Error): void
        {
            test(`with ${andList([maximumLength, startIndex, length].map(toString))}`, () =>
            {
                assert.throws(() => WriteStream.getLength(maximumLength, startIndex, length), expectedError);
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
            test(`with ${andList([maximumLength, startIndex, length].map(toString))}`, () =>
            {
                assert.strictEqual(WriteStream.getLength(maximumLength, startIndex, length), expectedLength);
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