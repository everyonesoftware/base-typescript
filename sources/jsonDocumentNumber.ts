import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Token } from "./token";
import { JavascriptIterable } from "./javascript";
import { Tokenizer } from "./tokenizer";
import { DocumentIssue } from "./documentIssue";
import { Result } from "./result";
import { JsonDocumentParser } from "./jsonDocumentParser";

export class JsonDocumentNumber implements JsonDocumentValue
{
    private readonly tokens: JavascriptIterable<Token>;
    
    private constructor(tokens: JavascriptIterable<Token>)
    {
        Pre.condition.assertNotEmpty(tokens, "tokens");

        this.tokens = tokens;
    }

    public static create(tokens: JavascriptIterable<Token>): JsonDocumentNumber
    {
        return new JsonDocumentNumber(tokens);
    }

    /**
     * Parse a {@link JsonDocumentNumber} from the provided text. If a number can't be parsed, then
     * undefined will be returned.
     * @param text The text to parse.
     * @param onIssue The function that will be invoked if any issues are encountered.
     * @param expected A description of what is expected.
     */
    public static parse(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected: string = "JSON number"): Result<JsonDocumentValue | undefined>
    {
        return JsonDocumentParser.create().parseNumber(text, onIssue, expected);
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
     * Get the numeric value of this {@link JsonDocumentNumber}.
     */
    public getValue(): number
    {
        return parseFloat(this.getText());
    }
}