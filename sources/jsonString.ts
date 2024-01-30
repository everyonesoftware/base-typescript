import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { JsonToken } from "./jsonToken";
import { JsonTokenType } from "./jsonTokenType";
import { Pre } from "./pre";

export class JsonString implements JsonSegment, JsonToken
{
    private readonly quote: string;
    private readonly value: string;

    private constructor(value: string, quote: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");
        Pre.condition.assertNotUndefinedAndNotNull(quote, "quote");
        Pre.condition.assertSame(1, quote.length, "quote.length");

        this.quote = quote;
        this.value = value;
    }

    public static create(value: string, quote: string = `"`): JsonString
    {
        return new JsonString(value, quote);
    }

    public getTokenType(): JsonTokenType.String
    {
        return JsonTokenType.String;
    }
    
    public getText(): string
    {
        return `${this.quote}${this.value}${this.quote}`;
    }

    public getSegmentType(): JsonSegmentType.String
    {
        return JsonSegmentType.String;
    }

    public getQuote(): string
    {
        return this.quote;
    }

    public getValue(): string
    {
        return this.value;
    }

    public toString(): string
    {
        return this.getText();
    }
}