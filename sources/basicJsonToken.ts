import { JsonToken } from "./jsonToken";
import { JsonTokenType } from "./jsonTokenType";
import { Pre } from "./pre";

/**
 * An individual token within a Json stream.
 */
export class BasicJsonToken implements JsonToken
{
    private readonly tokenType: JsonTokenType;
    private readonly text: string;
    
    private constructor(tokenType: JsonTokenType, text: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokenType, "tokenType");
        Pre.condition.assertNotEmpty(text, "text");

        this.tokenType = tokenType;
        this.text = text;
    }

    public static create(tokenType: JsonTokenType, text: string): BasicJsonToken
    {
        return new BasicJsonToken(tokenType, text);
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
}