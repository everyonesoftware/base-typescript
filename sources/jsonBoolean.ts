import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { JsonToken } from "./jsonToken";
import { JsonTokenType } from "./jsonTokenType";
import { Pre } from "./pre";

export class JsonBoolean implements JsonSegment, JsonToken
{
    private readonly value: boolean;

    public constructor(value: boolean)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.value = value;
    }

    public static create(value: boolean): JsonBoolean
    {
        return new JsonBoolean(value);
    }

    public getTokenType(): JsonTokenType.Boolean
    {
        return JsonTokenType.Boolean;
    }

    public getText(): string
    {
        return `${this.value}`;
    }

    public getValue(): boolean
    {
        return this.value;
    }

    public getSegmentType(): JsonSegmentType.Boolean
    {
        return JsonSegmentType.Boolean;
    }

    public toString(): string
    {
        return this.getText();
    }
}