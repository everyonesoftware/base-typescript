import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";

export class JsonNull implements JsonSegment
{
    private constructor()
    {
    }

    public static create(): JsonNull
    {
        return new JsonNull();
    }

    public getType(): JsonSegmentType.Null
    {
        return JsonSegmentType.Null;
    }

    public toString(): string
    {
        return "null";
    }
}