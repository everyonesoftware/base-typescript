import { BasicJsonToken } from "./basicJsonToken";
import { JsonBoolean } from "./jsonBoolean";
import { JsonNull } from "./jsonNull";
import { JsonNumber } from "./jsonNumber";
import { JsonString as JsonString } from "./jsonString";
import { JsonTokenType } from "./jsonTokenType";
import { Pre } from "./pre";

/**
 * An individual token within a Json stream.
 */
export abstract class JsonToken
{
    protected constructor()
    {
    }

    private static create(tokenType: JsonTokenType, text: string): JsonToken
    {
        return BasicJsonToken.create(tokenType, text);
    }

    public static leftCurlyBrace(): JsonToken
    {
        return JsonToken.create(JsonTokenType.LeftCurlyBrace, "{");
    }

    public static rightCurlyBrace(): JsonToken
    {
        return JsonToken.create(JsonTokenType.RightCurlyBrace, "}");
    }

    public static leftSquareBracket(): JsonToken
    {
        return JsonToken.create(JsonTokenType.LeftSquareBracket, "[");
    }

    public static rightSquareBracket(): JsonToken
    {
        return JsonToken.create(JsonTokenType.RightSquareBracket, "]");
    }

    public static whitespace(text: string): JsonToken
    {
        Pre.condition.assertNotEmpty(text, "text");

        return JsonToken.create(JsonTokenType.Whitespace, text);
    }

    public static string(value: string, quote: string = `"`): JsonString
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");
        Pre.condition.assertNotUndefinedAndNotNull(quote, "quote");
        Pre.condition.assertSame(1, quote.length, "quote.length");

        return JsonString.create(value, quote);
    }

    public static comma(): JsonToken
    {
        return JsonToken.create(JsonTokenType.Comma, ",");
    }

    public static number(value: number): JsonToken
    {
        return JsonNumber.create(value);
    }

    public static false(): JsonToken
    {
        return JsonBoolean.create(false);
    }

    public static true(): JsonToken
    {
        return JsonBoolean.create(true);
    }

    public static null(): JsonNull
    {
        return JsonNull.create();
    }

    public static unknown(value: string): JsonToken
    {
        return JsonToken.create(JsonTokenType.Unknown, value);
    }

    /**
     * Get the {@link JsonTokenType} of this {@link JsonToken}.
     */
    public abstract getTokenType(): JsonTokenType;

    /**
     * Get the text that makes up this {@link JsonToken}.
     */
    public abstract getText(): string;
}