import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { ByteListByteWriteStream } from "../sources";
import { byteWriteStreamTests } from "./byteWriteStreamTests";

function test(runner: TestRunner): void
{
    runner.testFile("byteListByteWriteStream.ts", () =>
    {
        runner.testType(ByteListByteWriteStream.name, () =>
        {
            runner.test("create()", (test: Test) =>
            {
                const writeStream: ByteListByteWriteStream = ByteListByteWriteStream.create();
                test.assertNotUndefinedAndNotNull(writeStream);
            });

            byteListByteWriteStreamTests(runner, ByteListByteWriteStream.create);
        });
    });
}
test(TestRunner.create());

export function byteListByteWriteStreamTests(runner: TestRunner, creator: () => ByteListByteWriteStream): void
{
    runner.testType(ByteListByteWriteStream.name, () =>
    {
        byteWriteStreamTests(runner, creator);

        runner.testFunction("create()", (test: Test) =>
        {
            const writeStream: ByteListByteWriteStream = creator();
            test.assertEqual(writeStream.getBytes(), Uint8Array.of());
        });

        runner.testFunction("writeByte(number)", () =>
        {
            runner.test("with valid byte values", (test: Test) =>
            {
                const writeStream: ByteListByteWriteStream = creator();
                test.assertEqual(writeStream.getBytes(), Uint8Array.of());

                test.assertEqual(writeStream.writeByte(200).await(), 1);
                test.assertEqual(writeStream.getBytes(), Uint8Array.of(200));

                test.assertEqual(writeStream.writeByte(123).await(), 1);
                test.assertEqual(writeStream.getBytes(), Uint8Array.of(200, 123));

                test.assertEqual(writeStream.writeByte(166).await(), 1);
                test.assertEqual(writeStream.getBytes(), Uint8Array.of(200, 123, 166));
            });
        });

        runner.testFunction("writeBytes(number[]|Uint8Array, number?, number?)", () =>
        {
            runner.test("with empty number[], no startIndex, no length", (test: Test) =>
            {
                const writeStream: ByteListByteWriteStream = creator();
                test.assertEqual(writeStream.getBytes(), Uint8Array.of());

                test.assertEqual(writeStream.writeBytes([]).await(), 0);
                test.assertEqual(writeStream.getBytes(), Uint8Array.of());
            });

            runner.test("with non-empty number[], no startIndex, no length", (test: Test) =>
            {
                const writeStream: ByteListByteWriteStream = creator();
                test.assertEqual(writeStream.getBytes(), Uint8Array.of());

                test.assertEqual(writeStream.writeBytes([1, 2, 3]).await(), 3);
                test.assertEqual(writeStream.getBytes(), Uint8Array.of(1, 2, 3));
            });
        });
    });
}