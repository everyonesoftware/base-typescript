import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { JsonToken } from "./jsonToken";
import { JsonTokenType } from "./jsonTokenType";
import { Pre } from "./pre";

export class JsonNumber implements JsonSegment, JsonToken
{
    private readonly value: number;

    public constructor(value: number)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.value = value;
    }

    public static create(value: number): JsonNumber
    {
        return new JsonNumber(value);
    }

    public getTokenType(): JsonTokenType.Number
    {
        return JsonTokenType.Number;
    }
    
    public getText(): string
    {
        return `${this.value}`;
    }

    public getValue(): number
    {
        return this.value;
    }

    public getSegmentType(): JsonSegmentType.Number
    {
        return JsonSegmentType.Number;
    }

    public toString(): string
    {
        return JSON.stringify(this.value);
    }
}