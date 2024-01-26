import { JavascriptIterable } from "./javascript";
import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { List } from "./list";
import { ListDecorator } from "./listDecorator";
import { Pre } from "./pre";

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

    public getSegmentType(): JsonSegmentType.Array
    {
        return JsonSegmentType.Array;
    }

    public override insert(index: number, value: JsonSegment): this
    {
        Pre.condition.assertInsertIndex(index, this.getCount(), "index");
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        return super.insert(index, value);
    }

    public override insertAll(index: number, values: JavascriptIterable<JsonSegment>): this
    {
        return List.insertAll(this, index, values);
    }
}