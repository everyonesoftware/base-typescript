import { BasicTokenizer } from "./basicTokenizer";
import { Iterator } from "./iterator";
import { Post } from "./post";
import { Pre } from "./pre";
import { StringIterator } from "./stringIterator";
import { isLowercasedLetter, isUppercasedLetter } from "./strings";
import { TokenCreator } from "./tokenCreator";
import { isString, isUndefinedOrNull } from "./types";

export class TextTokenizer extends BasicTokenizer
{
    protected constructor(innerIterator: Iterator<string>, tokenCreator: TokenCreator)
    {
        super(innerIterator, tokenCreator);
    }

    public static override create(text: string | Iterator<string>, tokenCreator?: TokenCreator): TextTokenizer
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        if (isString(text))
        {
            text = StringIterator.create(text);
        }
        if (isUndefinedOrNull(tokenCreator))
        {
            tokenCreator = TokenCreator.create();
        }
        return new TextTokenizer(text, tokenCreator);
    }

    protected override readLetters(): string
    {
        Pre.condition.assertTrue(this.isLetter(this.getCurrentCharacter()), "this.isLetter(this.getCurrentCharacter())");

        let result: string = "";

        if (isUppercasedLetter(this.getCurrentCharacter()))
        {
            result += this.readWhile(isUppercasedLetter);
        }

        if (this.hasCurrentCharacter() && isLowercasedLetter(this.getCurrentCharacter()))
        {
            result += this.readWhile(isLowercasedLetter);
        }

        Post.condition.assertNotEmpty(result, "result");

        return result;
    }
}