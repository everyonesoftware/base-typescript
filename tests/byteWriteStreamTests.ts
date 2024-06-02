import { TestRunner, Test } from "@everyonesoftware/test-typescript";
import { ByteWriteStream, PreConditionError } from "../sources";

export function byteWriteStreamTests(runner: TestRunner, creator: () => ByteWriteStream): void
{
    runner.testType(ByteWriteStream.name, () =>
    {
        runner.testFunction("writeByte(number)", () =>
        {
            function writeByteErrorTest(value: number, expected: Error): void
            {
                runner.test(`with ${value}`, (test: Test) =>
                {
                    const writeStream: ByteWriteStream = creator();
                    test.assertThrows(() => writeStream.writeByte(value).await(), expected);
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

        runner.testFunction("writeBytes(number[]|Uint8Array, number?, number?)", () =>
        {
            function writeBytesErrorTest(values: number[] | Uint8Array, startIndex: number | undefined, length: number | undefined, expected: Error): void
            {
                runner.test(`with ${runner.andList([values, startIndex, length])}`, (test: Test) =>
                {
                    const writeStream: ByteWriteStream = creator();
                    test.assertThrows(() => writeStream.writeBytes(values, startIndex, length).await(), expected);
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

