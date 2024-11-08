import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Token } from "./token";
import { Post } from "./post";
import { JavascriptIterable } from "./javascript";
import { Iterable } from "./iterable";

export class JsonDocumentString implements JsonDocumentValue
{
    private readonly tokens: JavascriptIterable<Token>;
    private readonly endQuote: boolean;
    
    private constructor(tokens: JavascriptIterable<Token>, hasEndQuote: boolean)
    {
        Pre.condition.assertNotEmpty(tokens, "tokens");
        Pre.condition.assertNotUndefinedAndNotNull(hasEndQuote, "endQuote");
        Pre.condition.assertOneOf([Token.singleQuote(), Token.doubleQuote(), Token.backtick()], Iterable.first(tokens).await(), "Iterable.first(tokens).await()");

        this.tokens = tokens;
        this.endQuote = hasEndQuote;
    }

    public static create(tokens: JavascriptIterable<Token>, hasEndQuote: boolean): JsonDocumentString
    {
        return new JsonDocumentString(tokens, hasEndQuote);
    }

    public getLength(): number
    {
        return JsonDocumentValue.getLength(this.tokens);
    }

    public getText(): string
    {
        return JsonDocumentValue.getText(this.tokens);
    }

    public toString(): string
    {
        return JsonDocumentValue.toString(this);
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