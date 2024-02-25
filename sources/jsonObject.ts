import { JsonArray } from "./jsonArray";
import { JsonBoolean } from "./jsonBoolean";
import { JsonNull } from "./jsonNull";
import { JsonNumber } from "./jsonNumber";
import { JsonProperty } from "./jsonProperty";
import { JsonSegment } from "./jsonSegment";
import { JsonSegmentType } from "./jsonSegmentType";
import { JsonString } from "./jsonString";
import { Map } from "./map";
import { MapDecorator } from "./mapDecorator";
import { Pre } from "./pre";
import { Result } from "./result";
import { join } from "./strings";
import { Type, isString } from "./types";

export class JsonObject extends MapDecorator<string,JsonSegment> implements JsonSegment
{
    public constructor()
    {
        super(Map.create());
    }

    public static create(): JsonObject
    {
        return new JsonObject();
    }

    public getSegmentType(): JsonSegmentType.Object
    {
        return JsonSegmentType.Object;
    }

    public override toString(): string
    {
        return `{${join(",", this.iterate().map(entry => entry.toString()))}}`;
    }

    public override set(propertyName: string, propertyValue: JsonSegment|number|boolean|string|null): this;
    public override set(property: JsonProperty): this;
    public override set(propertyOrName: string|JsonProperty, propertyValue?: JsonSegment|number|boolean|string|null): this
    {
        let propertyName: string;
        if (propertyValue === undefined)
        {
            Pre.condition.assertNotUndefinedAndNotNull(propertyOrName, "property");
            Pre.condition.assertTrue(propertyOrName instanceof JsonProperty, "property instanceof JsonProperty");
            Pre.condition.assertSame(propertyValue, undefined, "propertyValue");

            const property: JsonProperty = propertyOrName as JsonProperty;
            propertyValue = property.getValue();
            propertyName = property.getName();
        }
        else
        {
            propertyName = propertyOrName as string;
            
            Pre.condition.assertTrue(isString(propertyName), "isString(propertyName)");
            Pre.condition.assertNotUndefinedAndNotNull(propertyName, "propertyName");
            Pre.condition.assertNotEmpty(propertyName, "propertyName");
            Pre.condition.assertNotUndefined(propertyValue, "propertyValue");

            propertyValue = JsonSegment.toJsonSegment(propertyValue);
        }

        return super.set(propertyName, propertyValue);
    }

    protected getAs<T extends JsonSegment>(propertyName: string, propertyValueType: Type<T>): Result<T>
    {
        return Result.create(() =>
        {
            const value: JsonSegment = this.get(propertyName).await();
            return JsonSegment.as(value, propertyValueType).await();
        });
    }

    public getNull(propertyName: string): Result<JsonNull>
    {
        return this.getAs(propertyName, JsonNull);
    }

    public getString(propertyName: string): Result<JsonString>
    {
        return this.getAs(propertyName, JsonString);
    }

    public getStringValue(propertyName: string): Result<string>
    {
        return this.getString(propertyName)
            .then((propertyValue: JsonString) => propertyValue.getValue());
    }

    public getBoolean(propertyName: string): Result<JsonBoolean>
    {
        return this.getAs(propertyName, JsonBoolean);
    }

    public getBooleanValue(propertyName: string): Result<boolean>
    {
        return this.getBoolean(propertyName)
            .then((propertyValue: JsonBoolean) => propertyValue.getValue());
    }

    public getNumber(propertyName: string): Result<JsonNumber>
    {
        return this.getAs(propertyName, JsonNumber);
    }

    public getNumberValue(propertyName: string): Result<number>
    {
        return this.getNumber(propertyName)
            .then((propertyValue: JsonNumber) => propertyValue.getValue());
    }

    public getObject(propertyName: string): Result<JsonObject>
    {
        return this.getAs(propertyName, JsonObject);
    }

    public getArray(propertyName: string): Result<JsonArray>
    {
        return this.getAs(propertyName, JsonArray);
    }

    public as<T extends JsonSegment>(type: Type<T>): Result<T>
    {
        return JsonSegment.as(this, type);
    }
}