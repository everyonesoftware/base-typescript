import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { Pre } from "./pre";

export class JsonUnknown implements JsonSegment
{
    private readonly text: string;

    private constructor(text: string)
    {
        Pre.condition.assertNotEmpty(text, "text");

        this.text = text;
    }

    public static create(text: string)
    {
        return new JsonUnknown(text);
    }
    
    public getType(): JsonSegmentType.Unknown
    {
        return JsonSegmentType.Unknown;
    }
    
    public toString(): string
    {
        return this.text;
    }
}