import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Token } from "./token";
import { Post } from "./post";
import { JavascriptIterable } from "./javascript";
import { Iterable } from "./iterable";
import { Tokenizer } from "./tokenizer";
import { DocumentIssue } from "./documentIssue";
import { JsonDocumentParser } from "./jsonDocumentParser";
import { Result } from "./result";

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

    /**
     * Parse a {@link JsonDocumentString} from the provided text.
     * @param text The text to parse.
     * @param onIssue The function that will be invoked when an issue is encountered.
     * @param expected The context that describes what kind of JSON string is expected.
     */
    public static parse(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected: string = "JSON string"): Result<JsonDocumentString | undefined>
    {
        return JsonDocumentParser.create().parseString(text, onIssue, expected);
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