import { JsonTokenType } from "./jsonTokenType";
import { Pre } from "./pre";

/**
 * An individual token within a Json stream.
 */
export class JsonToken
{
    private readonly tokenType: JsonTokenType;
    private readonly text: string;

    protected constructor(tokenType: JsonTokenType, text: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokenType, "tokenType");
        Pre.condition.assertNotEmpty(text, "text");

        this.tokenType = tokenType;
        this.text = text;
    }

    private static create(tokenType: JsonTokenType, text: string): JsonToken
    {
        return new JsonToken(tokenType, text);
    }

    private static readonly leftCurlyBraceToken: JsonToken = JsonToken.create(JsonTokenType.LeftCurlyBrace, "{");
    public static leftCurlyBrace(): JsonToken
    {
        return JsonToken.leftCurlyBraceToken;
    }

    private static readonly rightCurlyBraceToken: JsonToken = JsonToken.create(JsonTokenType.RightCurlyBrace, "}");
    public static rightCurlyBrace(): JsonToken
    {
        return JsonToken.rightCurlyBraceToken;
    }

    private static readonly leftSquareBracketToken: JsonToken = JsonToken.create(JsonTokenType.LeftSquareBracket, "[");
    public static leftSquareBracket(): JsonToken
    {
        return JsonToken.leftSquareBracketToken;
    }

    private static readonly rightSquareBracketToken: JsonToken = JsonToken.create(JsonTokenType.RightSquareBracket, "]");
    public static rightSquareBracket(): JsonToken
    {
        return JsonToken.rightSquareBracketToken;
    }

    public static whitespace(text: string): JsonToken
    {
        return JsonToken.create(JsonTokenType.Whitespace, text);
    }

    public static string(text: string): JsonToken
    {
        Pre.condition.assertNotEmpty(text, "text");
        Pre.condition.assertOneOf([`'`, `"`], text[0], "text[0]");

        return JsonToken.create(JsonTokenType.String, text);
    }

    private static readonly commaToken = JsonToken.create(JsonTokenType.Comma, ",");
    public static comma(): JsonToken
    {
        return JsonToken.commaToken;
    }

    private static readonly colonToken = JsonToken.create(JsonTokenType.Colon, ":");
    public static colon(): JsonToken
    {
        return JsonToken.colonToken;
    }

    public static number(text: string): JsonToken
    {
        return JsonToken.create(JsonTokenType.Number, text);
    }

    public static boolean(text: string): JsonToken
    {
        return JsonToken.create(JsonTokenType.Boolean, text);
    }

    public static null(text: string): JsonToken
    {
        return JsonToken.create(JsonTokenType.Null, text);
    }

    public static unknown(text: string): JsonToken
    {
        return JsonToken.create(JsonTokenType.Unknown, text);
    }

    /**
     * Get the {@link JsonTokenType} of this {@link JsonToken}.
     */
    public getTokenType(): JsonTokenType
    {
        return this.tokenType;
    }

    /**
     * Get the text that makes up this {@link JsonToken}.
     */
    public getText(): string
    {
        return this.text;
    }

    /**
     * Get the {@link string} representation of this {@link JsonToken}.
     */
    public toString(): string
    {
        return this.getText();
    }
}