import { DocumentIssue } from "./documentIssue";
import { Result } from "./result";
import { Token } from "./token";
import { Tokenizer } from "./tokenizer";
import { JsonDocumentParser } from "./jsonDocumentParser";
import { Pre } from "./pre";
import { JavascriptIterable } from "./javascript";

/**
 * An individual value from a {@link JsonDocument} that is composed of one or more {@link Token}s.
 */
export abstract class JsonDocumentValue
{
    protected constructor()
    {
    }

    /**
     * Parse a {@link JsonDocumentValue} from the provided text.
     * @param text The text to parse.
     * @param onIssue The {@link Function} that will be invoked when an issue is encountered.
     */
    public static parse(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocumentValue | undefined>
    {
        return JsonDocumentParser.create().parseValue(text, onIssue);
    }

    /**
     * Get the number of characters in this {@link JsonDocumentValue}.
     */
    public abstract getLength(): number;

    /**
     * Get the combined length of the provided {@link Token}s and {@link JsonDocumentValue}s.
     * @param tokensAndSegments The {@link Token}s and {@link JsonDocumentValue}s to get the
     * combined length of.
     */
    public static getLength(tokensAndSegments: JavascriptIterable<Token | JsonDocumentValue>): number
    {
        Pre.condition.assertNotEmpty(tokensAndSegments, "tokensAndSegments");

        let length: number = 0;
        for (const tokenOrSegment of tokensAndSegments)
        {
            length += tokenOrSegment.getLength();
        }
        return length;
    }

    /**
     * Get the text that this {@link JsonDocumentValue} was parsed from.
     */
    public abstract getText(): string;

    /**
     * Get the combined text of the provided {@link Token}s and {@link JsonDocumentValue}s.
     * @param tokensAndValues The {@link Token}s and {@link JsonDocumentValue}s to get the
     * combined text of.
     */
    public static getText(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>): string
    {
        Pre.condition.assertNotEmpty(tokensAndValues, "tokensAndValues");

        let text: string = "";
        for (const tokenOrValue of tokensAndValues)
        {
            text += tokenOrValue.getText();
        }
        return text;
    }

    /**
     * Get the {@link String} representation of this {@link JsonDocumentValue}.
     */
    public toString(): string
    {
        return JsonDocumentValue.toString(this);
    }

    /**
     * Get the {@link String} representation of the provided {@link JsonDocumentValue}.
     * @param value The {@link JsonDocumentValue} to get the {@link String} representation of.
     */
    public static toString(value: JsonDocumentValue): string
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        return value.getText();
    }
}