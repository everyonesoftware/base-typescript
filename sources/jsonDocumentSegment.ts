import { DocumentIssue } from "./documentIssue";
import { Result } from "./result";
import { Iterator } from "./iterator";
import { Token } from "./token";
import { Tokenizer } from "./tokenizer";
import { JsonDocumentParser } from "./jsonDocumentParser";
import { Pre } from "./pre";

/**
 * An individual segment from a {@link JsonDocument} that is composed of one or more {@link Token}s.
 */
export abstract class JsonDocumentSegment
{
    protected constructor()
    {
    }

    /**
     * Parse a {@link JsonDocumentSegment} from the provided text.
     * @param text The text to parse.
     * @param onIssue The {@link Function} that will be invoked when an issue is encountered.
     */
    public static parse(text: string | Iterator<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocumentSegment | undefined>
    {
        return JsonDocumentParser.create().parseSegment(text, onIssue);
    }

    /**
     * Get the number of characters in this {@link JsonDocumentSegment}.
     */
    public abstract getLength(): number;

    /**
     * Get the combined length of the provided {@link Token}s and {@link JsonDocumentSegment}s.
     * @param tokensAndSegments The {@link Token}s and {@link JsonDocumentSegment}s to get the
     * combined length of.
     */
    public static getLength(tokensAndSegments: Iterable<Token | JsonDocumentSegment>): number
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
     * Get the text that this {@link JsonDocumentSegment} was parsed from.
     */
    public abstract getText(): string;

    /**
     * Get the combined text of the provided {@link Token}s and {@link JsonDocumentSegment}s.
     * @param tokensAndSegments The {@link Token}s and {@link JsonDocumentSegment}s to get the
     * combined text of.
     */
    public static getText(tokensAndSegments: Iterable<Token | JsonDocumentSegment>): string
    {
        Pre.condition.assertNotEmpty(tokensAndSegments, "tokensAndSegments");

        let text: string = "";
        for (const tokenOrSegment of tokensAndSegments)
        {
            text += tokenOrSegment.getText();
        }
        return text;
    }

    /**
     * Get the {@link String} representation of this {@link JsonDocumentSegment}.
     */
    public toString(): string
    {
        return JsonDocumentSegment.toString(this);
    }

    /**
     * Get the {@link String} representation of the provided {@link JsonDocumentSegment}.
     * @param segment The {@link JsonDocumentSegment} to get the {@link String} representation of.
     */
    public static toString(segment: JsonDocumentSegment): string
    {
        Pre.condition.assertNotUndefinedAndNotNull(segment, "segment");

        return segment.getText();
    }
}