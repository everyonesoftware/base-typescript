import { ByteWriteStream } from "./byteWriteStream";
import { CharacterWriteStream } from "./characterWriteStream";
import { Result } from "./result";
import { Pre } from "./pre";
import { WriteStream } from "./writeStream";
import { ByteListCharacterToByteWriteStream } from "./byteListCharacterToByteWriteStream";

/**
 * A write stream that can write both characters and bytes.
 */
export abstract class CharacterToByteWriteStream implements CharacterWriteStream, ByteWriteStream
{
    protected constructor()
    {
    }

    public static create(): CharacterToByteWriteStream
    {
        return ByteListCharacterToByteWriteStream.create();
    }

    public writeByte(byte: number): Result<number>
    {
        return CharacterToByteWriteStream.writeByte(this, byte);
    }

    public static writeByte(writeStream: CharacterToByteWriteStream, byte: number): Result<number>
    {
        return ByteWriteStream.writeByte(writeStream, byte);
    }

    public abstract writeBytes(bytes: number[] | Uint8Array, startIndex?: number, length?: number): Result<number>;

    public writeCharacter(character: string): Result<void>
    {
        return CharacterToByteWriteStream.writeCharacter(this, character);
    }

    public static writeCharacter(writeStream: CharacterToByteWriteStream, character: string): Result<void>
    {
        return CharacterWriteStream.writeCharacter(writeStream, character);
    }

    public writeString(text: string, startIndex?: number, length?: number): Result<void>
    {
        return CharacterToByteWriteStream.writeString(this, text, startIndex, length);
    }

    public static writeString(writeStream: CharacterToByteWriteStream, text: string, startIndex?: number, length?: number): Result<void>
    {
        Pre.condition.assertNotUndefinedAndNotNull(writeStream, "writeStream");
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            startIndex = WriteStream.getStartIndex(startIndex);
            length = WriteStream.getLength(text.length, startIndex, length);

            const encoder = new TextEncoder();
            const bytes: Uint8Array = encoder.encode(text.substring(startIndex, startIndex + length));
            writeStream.writeBytes(bytes).await();
        });
    }

    public writeLine(text: string, startIndex?: number, length?: number): Result<void>
    {
        return CharacterToByteWriteStream.writeLine(this, text, startIndex, length);
    }

    public static writeLine(writeStream: CharacterToByteWriteStream, text: string, startIndex?: number, length?: number): Result<void>
    {
        return CharacterWriteStream.writeLine(writeStream, text, startIndex, length);
    }
}