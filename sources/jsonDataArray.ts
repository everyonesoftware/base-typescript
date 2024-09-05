import { JavascriptIterable } from "./javascript";
import { List } from "./list";
import { Result } from "./result";
import { JsonDataObject } from "./jsonDataObject";
import { asJsonArray, asJsonBoolean, asJsonNull, asJsonNumber, asJsonObject, asJsonString, JsonDataType } from "./jsonDataType";
import { ListDecorator } from "./listDecorator";
import { Pre } from "./pre";

/**
 * A data-only representation of a JSON array.
 */
export class JsonDataArray extends ListDecorator<JsonDataType>
{
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

    public getNull(index: number): Result<null>
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");

        return Result.create(() =>
        {
            const json: JsonDataType = this.get(index);
            return asJsonNull(json).await();
        });
    }

    public getString(index: number): Result<string>
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");

        return Result.create(() =>
        {
            const json: JsonDataType = this.get(index);
            return asJsonString(json).await();
        });
    }

    public getBoolean(index: number): Result<boolean>
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");

        return Result.create(() =>
        {
            const json: JsonDataType = this.get(index);
            return asJsonBoolean(json).await();
        });
    }

    public getNumber(index: number): Result<number>
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");

        return Result.create(() =>
        {
            const json: JsonDataType = this.get(index);
            return asJsonNumber(json).await();
        });
    }

    public getObject(index: number): Result<JsonDataObject>
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");

        return Result.create(() =>
        {
            const json: JsonDataType = this.get(index);
            return asJsonObject(json).await();
        });
    }

    public getArray(index: number): Result<JsonDataArray>
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");

        return Result.create(() =>
        {
            const json: JsonDataType = this.get(index);
            return asJsonArray(json).await();
        });
    }

    public override insert(index: number, value: JsonDataType): this
    {
        Pre.condition.assertInsertIndex(index, this.getCount(), "index");
        Pre.condition.assertNotUndefined(value, "value");

        return super.insert(index, value);
    }
}