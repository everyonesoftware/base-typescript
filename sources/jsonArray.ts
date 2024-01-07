import { JavascriptIterable } from "./javascript";
import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { List } from "./list";
import { ListDecorator } from "./listDecorator";

export class JsonArray extends ListDecorator<JsonSegment> implements JsonSegment
{
    private constructor()
    {
        super(List.create());
    }

    public static create(elements?: JavascriptIterable<JsonSegment>): JsonArray
    {
        const result: JsonArray = new JsonArray();
        if (elements)
        {
            result.addAll(elements);
        }
        return result;
    }

    public getType(): JsonSegmentType.Array
    {
        return JsonSegmentType.Array;
    }
}