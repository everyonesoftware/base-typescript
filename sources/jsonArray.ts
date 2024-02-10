import { Iterable } from "./iterable";
import { JavascriptIterable } from "./javascript";
import { JsonBoolean } from "./jsonBoolean";
import { JsonNull } from "./jsonNull";
import { JsonNumber } from "./jsonNumber";
import { JsonObject } from "./jsonObject";
import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { JsonString } from "./jsonString";
import { List } from "./list";
import { ListDecorator } from "./listDecorator";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type } from "./types";
import { WrongTypeError } from "./wrongTypeError";

export class JsonArray extends ListDecorator<JsonSegment> implements JsonSegment
{
    public constructor()
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

    protected getAs<T extends JsonSegment>(index: number, propertyValueType: Type<T>): Result<T>
    {
        return Result.create(() =>
        {
            const value: JsonSegment = this.get(index);
            if (!(value instanceof propertyValueType))
            {
                throw new WrongTypeError(`Expected ${propertyValueType.name} but found ${value.constructor.name}.`);
            }
            return value as T;
        });
    }

    public getNull(index: number): Result<JsonNull>
    {
        return this.getAs(index, JsonNull);
    }

    public getString(index: number): Result<JsonString>
    {
        return this.getAs(index, JsonString);
    }

    public getStringValue(index: number): Result<string>
    {
        return this.getString(index)
            .then((element: JsonString) => element.getValue());
    }

    public getBoolean(index: number): Result<JsonBoolean>
    {
        return this.getAs(index, JsonBoolean);
    }

    public getBooleanValue(index: number): Result<boolean>
    {
        return this.getBoolean(index)
            .then((element: JsonBoolean) => element.getValue());
    }

    public getNumber(index: number): Result<JsonNumber>
    {
        return this.getAs(index, JsonNumber);
    }

    public getNumberValue(index: number): Result<number>
    {
        return this.getNumber(index)
            .then((element: JsonNumber) => element.getValue());
    }

    public getObject(index: number): Result<JsonObject>
    {
        return this.getAs(index, JsonObject);
    }

    public getArray(index: number): Result<JsonArray>
    {
        return this.getAs(index, JsonArray);
    }
}