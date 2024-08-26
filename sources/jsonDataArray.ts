import { Iterable } from "./iterable";
import { JavascriptIterable } from "./javascript";
import { JsonDataBoolean } from "./jsonDataBoolean";
import { JsonDataNull } from "./jsonDataNull";
import { JsonDataNumber } from "./jsonDataNumber";
import { List } from "./list";
import { ListDecorator } from "./listDecorator";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type } from "./types";
import { JsonDataString } from "./jsonDataString";
import { JsonDataObject } from "./jsonDataObject";
import { JsonDataValue } from "./jsonDataValue";
import { JsonDataType } from "./jsonDataType";

/**
 * A data-only representation of a JSON array.
 */
export class JsonDataArray extends ListDecorator<JsonDataValue> implements JsonDataValue
{
    public static readonly typeDisplayName: string = "array";

    private constructor()
    {
        super(List.create());
    }

    public static create(elements?: JavascriptIterable<JsonDataType>): JsonDataArray
    {
        const result: JsonDataArray = new JsonDataArray();
        if (elements)
        {
            result.addAll(elements);
        }
        return result;
    }

    public override add(value: JsonDataType): this
    {
        Pre.condition.assertNotUndefined(value, "value");

        return this.insert(this.getCount(), value);
    }

    public override addAll(values: JavascriptIterable<JsonDataType>): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(values, "values");

        return List.addAll(this, Iterable.create(values).map(JsonDataValue.toJsonDataValue));
    }

    public override insert(index: number, value: JsonDataType): this
    {
        Pre.condition.assertInsertIndex(index, this.getCount(), "index");
        Pre.condition.assertNotUndefined(value, "value");

        return super.insert(index, JsonDataValue.toJsonDataValue(value));
    }

    public override insertAll(index: number, values: JavascriptIterable<JsonDataType>): this
    {
        return List.insertAll(this, index, Iterable.create(values).map(JsonDataValue.toJsonDataValue));
    }

    protected getAs<T extends JsonDataValue>(index: number, elementType: Type<T>, typeDisplayName: string): Result<T>
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");
        Pre.condition.assertNotUndefinedAndNotNull(elementType, "elementType");

        const value: JsonDataValue = this.get(index);
        return JsonDataValue.as(value, elementType, typeDisplayName);
    }

    public getNull(index: number): Result<JsonDataNull>
    {
        return this.getAs(index, JsonDataNull, JsonDataNull.typeDisplayName);
    }

    public getString(index: number): Result<JsonDataString>
    {
        return this.getAs(index, JsonDataString, JsonDataString.typeDisplayName);
    }

    public getStringValue(index: number): Result<string>
    {
        return this.getString(index)
            .then((element: JsonDataString) => element.getValue());
    }

    public getBoolean(index: number): Result<JsonDataBoolean>
    {
        return this.getAs(index, JsonDataBoolean, JsonDataBoolean.typeDisplayName);
    }

    public getBooleanValue(index: number): Result<boolean>
    {
        return this.getBoolean(index)
            .then((element: JsonDataBoolean) => element.getValue());
    }

    public getNumber(index: number): Result<JsonDataNumber>
    {
        return this.getAs(index, JsonDataNumber, JsonDataNumber.typeDisplayName);
    }

    public getNumberValue(index: number): Result<number>
    {
        return this.getNumber(index)
            .then((element: JsonDataNumber) => element.getValue());
    }

    public getObject(index: number): Result<JsonDataObject>
    {
        return this.getAs(index, JsonDataObject, JsonDataObject.typeDisplayName);
    }

    public getArray(index: number): Result<JsonDataArray>
    {
        return this.getAs(index, JsonDataArray, JsonDataArray.typeDisplayName);
    }

    public getTypeDisplayName(): string
    {
        return JsonDataArray.typeDisplayName;
    }

    public as<T extends JsonDataValue>(type: Type<T>, typeDisplayName: string): Result<T>
    {
        return JsonDataValue.as(this, type, typeDisplayName);
    }
}