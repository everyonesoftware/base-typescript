import * as assert from "assert";

import { ByteWriteStream, PreConditionError, andList, toString } from "../sources";

export function byteWriteStreamTests(creator: () => ByteWriteStream): void
{
    suite("ByteWriteStream", () =>
    {
        suite("writeByte(number)", () =>
        {
            function writeByteErrorTest(value: number, expected: Error): void
            {
                test(`with ${value}`, () =>
                {
                    const writeStream: ByteWriteStream = creator();
                    assert.throws(() => writeStream.writeByte(value).await(), expected);
                });
            }

            writeByteErrorTest(-2, new PreConditionError(
                "Expression: byte",
                "Expected: between 0 and 255",
                "Actual: -2"));
            writeByteErrorTest(-1, new PreConditionError(
                "Expression: byte",
                "Expected: between 0 and 255",
                "Actual: -1"));

            writeByteErrorTest(256, new PreConditionError(
                "Expression: byte",
                "Expected: between 0 and 255",
                "Actual: 256"));
            writeByteErrorTest(257, new PreConditionError(
                "Expression: byte",
                "Expected: between 0 and 255",
                "Actual: 257"));
        });

        suite("writeBytes(number[]|Uint8Array, number?, number?)", () =>
        {
            function writeBytesErrorTest(values: number[] | Uint8Array, startIndex: number | undefined, length: number | undefined, expected: Error): void
            {
                test(`with ${andList([values, startIndex, length].map(toString))}`, () =>
                {
                    const writeStream: ByteWriteStream = creator();
                    assert.throws(() => writeStream.writeBytes(values, startIndex, length).await(), expected);
                });
            }

            writeBytesErrorTest(undefined!, undefined, undefined, new PreConditionError(
                "Expression: bytes",
                "Expected: not undefined and not null",
                "Actual: undefined"));
            writeBytesErrorTest([], -1, undefined, new PreConditionError(
                "Expression: startIndex === undefined || startIndex === null || 0 <= startIndex",
                "Expected: true",
                "Actual: false"));
        });
    });
}

