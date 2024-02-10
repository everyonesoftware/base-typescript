import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { JsonToken } from "./jsonToken";
import { JsonTokenType } from "./jsonTokenType";

export class JsonNull implements JsonSegment, JsonToken
{
    public constructor()
    {
    }

    public static create(): JsonNull
    {
        return new JsonNull();
    }

    public getTokenType(): JsonTokenType.Null
    {
        return JsonTokenType.Null;
    }

    public getText(): string
    {
        return "null";
    }

    public getSegmentType(): JsonSegmentType.Null
    {
        return JsonSegmentType.Null;
    }

    public toString(): string
    {
        return "null";
    }
}