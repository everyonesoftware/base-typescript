import * as assert from "assert";

import { ByteListByteWriteStream, PreConditionError } from "../sources";

suite("byteListByteWriteStream.ts", () =>
{
    suite("ByteListByteWriteStream", () =>
    {
        test("create()", () =>
        {
            const writeStream: ByteListByteWriteStream = ByteListByteWriteStream.create();
            assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());
        });

        suite("writeByte(number)", () =>
        {
            test("with valid byte values", () =>
            {
                const writeStream = ByteListByteWriteStream.create();
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());

                assert.strictEqual(writeStream.writeByte(200).await(), 1);
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of(200));

                assert.strictEqual(writeStream.writeByte(123).await(), 1);
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of(200, 123));

                assert.strictEqual(writeStream.writeByte(166).await(), 1);
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of(200, 123, 166));
            });

            test("with invalid byte values", () =>
            {
                const writeStream = ByteListByteWriteStream.create();
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());

                assert.throws(() => writeStream.writeByte(-1).await(),
                    new PreConditionError(
                        "Expression: byte",
                        "Expected: between 0 and 255",
                        "Actual: -1"));
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());

                assert.throws(() => writeStream.writeByte(256).await(),
                    new PreConditionError(
                        "Expression: byte",
                        "Expected: between 0 and 255",
                        "Actual: 256"));
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());
            });
        });

        suite("writeBytes(number[]|Uint8Array, number?, number?)", () =>
        {
            test("with empty number[], no startIndex, no length", () =>
            {
                const writeStream = ByteListByteWriteStream.create();
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());

                assert.strictEqual(writeStream.writeBytes([]).await(), 0);
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());
            });

            test("with non-empty number[], no startIndex, no length", () =>
            {
                const writeStream = ByteListByteWriteStream.create();
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());

                assert.strictEqual(writeStream.writeBytes([1, 2, 3]).await(), 3);
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of(1, 2, 3));
            });
        });
    });
});