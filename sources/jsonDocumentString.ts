import { JsonDocumentSegment } from "./jsonDocumentSegment";
import { Pre } from "./pre";
import { Token } from "./token";
import { Iterable } from "./iterable";
import { Post } from "./post";

export class JsonDocumentString implements JsonDocumentSegment
{
    private readonly tokens: Iterable<Token>;
    private readonly endQuote: boolean;
    
    private constructor(tokens: Iterable<Token>, hasEndQuote: boolean)
    {
        Pre.condition.assertNotEmpty(tokens, "tokens");
        Pre.condition.assertNotUndefinedAndNotNull(hasEndQuote, "endQuote");
        Pre.condition.assertOneOf([Token.singleQuote(), Token.doubleQuote(), Token.backtick()], tokens.first().await(), "tokens.first().await()");

        this.tokens = tokens;
        this.endQuote = hasEndQuote;
    }

    public static create(tokens: Iterable<Token>, hasEndQuote: boolean): JsonDocumentString
    {
        return new JsonDocumentString(tokens, hasEndQuote);
    }

    public getLength(): number
    {
        return JsonDocumentSegment.getLength(this.tokens);
    }

    public getText(): string
    {
        return JsonDocumentSegment.getText(this.tokens);
    }

    public toString(): string
    {
        return JsonDocumentSegment.toString(this);
    }

    /**
     * Get whether this {@link JsonDocumentString} has a closing end quote.
     */
    public hasEndQuote(): boolean
    {
        return this.endQuote;
    }

    /**
     * Get the {@link string} value of this {@link JsonDocumentString}.
     */
    public getValue(): string
    {
        let result: string = this.getText().substring(1);
        if (this.hasEndQuote())
        {
            result = result.substring(0, result.length - 1);
        }

        Post.condition.assertNotUndefinedAndNotNull(result, "result");

        return result;
    }
}