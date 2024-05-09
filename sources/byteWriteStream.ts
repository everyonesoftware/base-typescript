import { ByteListByteWriteStream } from "./byteListByteWriteStream";
import { Pre } from "./pre";
import { Result } from "./result";

/**
 * A type that writes bytes.
 */
export abstract class ByteWriteStream
{
    protected constructor()
    {
    }

    public static create(): ByteListByteWriteStream
    {
        return ByteListByteWriteStream.create();
    }

    /**
     * Write the provided byte to this {@link ByteWriteStream}. Return the number of
     * bytes that were written.
     * @param byte The byte to write.
     */
    public writeByte(byte: number): Result<number>
    {
        return ByteWriteStream.writeByte(this, byte);
    }

    /**
     * Write the provided byte to the provided {@link ByteWriteStream}. Return the
     * number of bytes that were written.
     * @param writeStream The {@link ByteWriteStream} to write the byte to.
     * @param byte The byte to write.
     */
    public static writeByte(writeStream: ByteWriteStream, byte: number): Result<number>
    {
        Pre.condition.assertNotUndefinedAndNotNull(writeStream, "writeStream");
        Pre.condition.assertByte(byte, "byte");

        return writeStream.writeBytes(Uint8Array.of(byte), 0, 1);
    }

    /**
     * Write the provided bytes to this {@link ByteWriteStream}. Return the number of
     * bytes that were written.
     * @param bytes The bytes to write.
     * @param startIndex The index in the {@link Uint8Array} to start writing from.
     * Defaults to 0.
     * @param length The number of bytes to write. Defaults to bytes.length - startIndex.
     */
    public abstract writeBytes(bytes: Uint8Array | number[], startIndex?: number, length?: number): Result<number>;
}