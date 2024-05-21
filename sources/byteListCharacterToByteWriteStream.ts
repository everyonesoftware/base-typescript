import { ByteListByteWriteStream } from "./byteListByteWriteStream";
import { CharacterToByteWriteStream } from "./characterToByteWriteStream";
import { Result } from "./result";

export class ByteListCharacterToByteWriteStream extends ByteListByteWriteStream implements CharacterToByteWriteStream
{
    protected constructor()
    {
        super();
    }

    public static override create(): ByteListCharacterToByteWriteStream
    {
        return new ByteListCharacterToByteWriteStream();
    }

    /**
     * Get the text that has been written to this {@link ByteListCharacterToByteWriteStream}.
     */
    public getText(): string
    {
        return new TextDecoder().decode(this.getBytes());
    }

    public writeCharacter(character: string): Result<void>
    {
        return CharacterToByteWriteStream.writeCharacter(this, character);
    }

    public writeString(text: string, startIndex?: number, length?: number): Result<void>
    {
        return CharacterToByteWriteStream.writeString(this, text, startIndex, length);
    }

    public writeLine(text: string, startIndex?: number, length?: number): Result<void>
    {
        return CharacterToByteWriteStream.writeLine(this, text, startIndex, length);
    }
}