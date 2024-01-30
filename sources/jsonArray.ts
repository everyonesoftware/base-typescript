import { Iterable } from "./iterable";
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

    public static create(elements?: JavascriptIterable<JsonSegment|number|boolean|string|null>): JsonArray
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

    public override add(value: JsonSegment|number|boolean|string|null): this
    {
        Pre.condition.assertNotUndefined(value, "value");

        return this.insert(this.getCount(), value);
    }

    public override addAll(values: JavascriptIterable<JsonSegment|number|boolean|string|null>): this
    {
        return List.addAll(this, Iterable.create(values).map(JsonSegment.toJsonSegment));
    }

    public override insert(index: number, value: JsonSegment|number|boolean|string|null): this
    {
        Pre.condition.assertInsertIndex(index, this.getCount(), "index");
        Pre.condition.assertNotUndefined(value, "value");

        value = JsonSegment.toJsonSegment(value);

        return super.insert(index, value);
    }

    public override insertAll(index: number, values: JavascriptIterable<JsonSegment|number|boolean|string|null>): this
    {
        return List.insertAll(this, index, Iterable.create(values).map(JsonSegment.toJsonSegment));
    }
}