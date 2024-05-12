import { Pre } from "./pre";
import { Result } from "./result";

/**
 * A stream that writes characters.
 */
export abstract class CharacterWriteStream
{
    public writeCharacter(character: string): Result<void>
    {
        return CharacterWriteStream.writeCharacter(this, character);
    }

    public static writeCharacter(writeStream: CharacterWriteStream, character: string): Result<void>
    {
        Pre.condition.assertNotUndefinedAndNotNull(writeStream, "writeStream");
        Pre.condition.assertNotUndefinedAndNotNull(character, "character");
        Pre.condition.assertEqual(1, character.length, "character.length");

        return writeStream.writeString(character);
    }

    /**
     * Write the provided text to this {@link CharacterWriteStream}.
     * @param value The text to write.
     * @param startIndex The character index to start writing from. Defaults to 0.
     * @param length The number of characters to write. Defaults to text.length - startIndex.
     */
    public abstract writeString(text: string, startIndex?: number, length?: number): Result<void>;

    /**
     * Write the provided text and an additional newline character to this {@link CharacterWriteStream}.
     * @param text The text to write to the {@link CharacterWriteStream}.
     * @param startIndex The character index to start writing from. Defaults to 0.
     * @param length The number of characters to write. Defaults to text.length - startIndex.
     */
    public writeLine(text: string, startIndex?: number, length?: number): Result<void>
    {
        return CharacterWriteStream.writeLine(this, text, startIndex, length);
    }

    /**
     * Write the provided text and an additional newline character to the {@link CharacterWriteStream}.
     * @param writeStream The {@link CharacterWriteStream} to write the provided text and newline to.
     * @param text The text to write to the {@link CharacterWriteStream}.
     * @param startIndex The character index to start writing from. Defaults to 0.
     * @param length The number of characters to write. Defaults to text.length - startIndex.
     */
    public static writeLine(writeStream: CharacterWriteStream, text: string, startIndex?: number, length?: number): Result<void>
    {
        Pre.condition.assertNotUndefinedAndNotNull(writeStream, "writeStream");
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            writeStream.writeString(text, startIndex, length).await();
            writeStream.writeString("\n").await();
        });
    }
}