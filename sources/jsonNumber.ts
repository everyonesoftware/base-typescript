import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { Pre } from "./pre";

export class JsonNumber implements JsonSegment
{
    private readonly value: number;

    private constructor(value: number)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.value = value;
    }

    public static create(value: number): JsonNumber
    {
        return new JsonNumber(value);
    }

    public getValue(): number
    {
        return this.value;
    }

    public getType(): JsonSegmentType.Number
    {
        return JsonSegmentType.Number;
    }

    public toString(): string
    {
        return JSON.stringify(this.value);
    }
}