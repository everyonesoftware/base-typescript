import * as assert from "assert";

import { ByteListByteWriteStream } from "../sources";

import { byteWriteStreamTests } from "./byteWriteStreamTests";

export function byteListByteWriteStreamTests(creator: () => ByteListByteWriteStream): void
{
    suite("ByteListByteWriteStream", () =>
    {
        byteWriteStreamTests(creator);

        test("create()", () =>
        {
            const writeStream: ByteListByteWriteStream = creator();
            assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());
        });

        suite("writeByte(number)", () =>
        {
            test("with valid byte values", () =>
            {
                const writeStream = creator();
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());

                assert.strictEqual(writeStream.writeByte(200).await(), 1);
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of(200));

                assert.strictEqual(writeStream.writeByte(123).await(), 1);
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of(200, 123));

                assert.strictEqual(writeStream.writeByte(166).await(), 1);
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of(200, 123, 166));
            });
        });

        suite("writeBytes(number[]|Uint8Array, number?, number?)", () =>
        {
            test("with empty number[], no startIndex, no length", () =>
            {
                const writeStream = creator();
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());

                assert.strictEqual(writeStream.writeBytes([]).await(), 0);
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());
            });

            test("with non-empty number[], no startIndex, no length", () =>
            {
                const writeStream = creator();
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of());

                assert.strictEqual(writeStream.writeBytes([1, 2, 3]).await(), 3);
                assert.deepStrictEqual(writeStream.getBytes(), Uint8Array.of(1, 2, 3));
            });
        });
    });
}

suite("byteListByteWriteStream.ts", () =>
{
    byteListByteWriteStreamTests(ByteListByteWriteStream.create);
});