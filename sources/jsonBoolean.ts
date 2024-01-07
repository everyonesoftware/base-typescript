import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { Pre } from "./pre";

export class JsonBoolean implements JsonSegment
{
    private readonly value: boolean;

    private constructor(value: boolean)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.value = value;
    }

    public static create(value: boolean): JsonBoolean
    {
        return new JsonBoolean(value);
    }

    public getValue(): boolean
    {
        return this.value;
    }

    public getType(): JsonSegmentType.Boolean
    {
        return JsonSegmentType.Boolean;
    }

    public toString(): string
    {
        return JSON.stringify(this.value);
    }
}