import { CharacterList } from "./characterList";
import { CharacterWriteStream } from "./characterWriteStream";
import { Pre } from "./pre";
import { Result } from "./result";
import { WriteStream } from "./writeStream";

export class CharacterListCharacterWriteStream implements CharacterWriteStream
{
    private readonly characterList: CharacterList;

    protected constructor()
    {
        this.characterList = CharacterList.create();
    }

    public static create(): CharacterListCharacterWriteStream
    {
        return new CharacterListCharacterWriteStream();
    }

    public writeCharacter(character: string): Result<void>
    {
        return CharacterWriteStream.writeCharacter(this, character);
    }

    public writeString(text: string, startIndex?: number | undefined, length?: number | undefined): Result<void>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            startIndex = WriteStream.getStartIndex(startIndex);
            length = WriteStream.getLength(text.length, startIndex, length);
            text = text.substring(startIndex, startIndex + length);

            this.characterList.addAll(text);
        });
    }

    public writeLine(text: string, startIndex?: number | undefined, length?: number | undefined): Result<void>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            startIndex = WriteStream.getStartIndex(startIndex);
            length = WriteStream.getLength(text.length, startIndex, length);
            text = text.substring(startIndex, startIndex + length);

            this.characterList.addAll(text + "\n");
        });
    }
}