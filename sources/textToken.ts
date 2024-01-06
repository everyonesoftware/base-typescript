import { Pre } from "./pre";
import { TextTokenType } from "./textTokenType";

export class TextToken
{
    private readonly type: TextTokenType;
    private readonly text: string;

    private constructor(type: TextTokenType, text: string)
    {
        this.type = type;
        this.text = text;
    }

    /**
     * Create a new Letters {@link TextToken}.
     * @param text The text of the new {@link TextToken}.
     */
    public static word(text: string): TextToken
    {
        Pre.condition.assertNotEmpty(text, "text");

        return new TextToken(TextTokenType.Word, text);
    }

    /**
     * Create a new Digits {@link TextToken}.
     * @param text The text of the new {@link TextToken}.
     */
    public static digits(text: string): TextToken
    {
        Pre.condition.assertNotEmpty(text, "text");

        return new TextToken(TextTokenType.Digits, text);
    }

    /**
     * Create a new Whitespace {@link TextToken}.
     * @param text The text of the new {@link TextToken}.
     */
    public static whitespace(text: string): TextToken
    {
        Pre.condition.assertNotEmpty(text, "text");

        return new TextToken(TextTokenType.Whitespace, text);
    }

    /**
     * Create a new Underscore {@link TextToken}.
     */
    public static underscore(): TextToken
    {
        return new TextToken(TextTokenType.Underscore, "_");
    }

    /**
     * Create a new Dash {@link TextToken}.
     */
    public static dash(): TextToken
    {
        return new TextToken(TextTokenType.Dash, "-");
    }

    /**
     * Create a new Other {@link TextToken}.
     * @param text The text of the new {@link TextToken}.
     */
    public static other(text: string): TextToken
    {
        Pre.condition.assertNotEmpty(text, "text");

        return new TextToken(TextTokenType.Other, text);
    }

    /**
     * Get the type of this {@link TextToken}.
     */
    public getType(): TextTokenType
    {
        return this.type;
    }

    /**
     * Get the text of this {@link TextToken}.
     */
    public getText(): string
    {
        return this.text;
    }
}