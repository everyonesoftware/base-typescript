import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { Pre } from "./pre";

export class JsonString implements JsonSegment
{
    private readonly quote: string;
    private readonly value: string;
    private readonly endQuote: boolean;

    private constructor(value: string, quote: string, endQuote: boolean)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");
        Pre.condition.assertNotUndefinedAndNotNull(quote, "quote");
        Pre.condition.assertSame(1, quote.length, "quote.length");
        Pre.condition.assertNotUndefinedAndNotNull(endQuote, "endQuote");

        this.quote = quote;
        this.value = value;
        this.endQuote = endQuote;
    }

    public static create(value: string, quote: string = `"`, endQuote: boolean = true): JsonString
    {
        return new JsonString(value, quote, endQuote);
    }

    public getType(): JsonSegmentType.String
    {
        return JsonSegmentType.String;
    }

    public getQuote(): string
    {
        return this.quote;
    }

    public hasEndQuote(): boolean
    {
        return this.endQuote;
    }

    public getValue(): string
    {
        return this.value;
    }

    public toString(): string
    {
        return `${this.quote}${this.value}${this.endQuote ? this.quote : ""}`;
    }
}