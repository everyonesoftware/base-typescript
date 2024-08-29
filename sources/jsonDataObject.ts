import { Iterator } from "./iterator";
import { JsonDataArray } from "./jsonDataArray";
import { JsonDataBoolean } from "./jsonDataBoolean";
import { JsonDataNull } from "./jsonDataNull";
import { JsonDataNumber } from "./jsonDataNumber";
import { JsonDataType } from "./jsonDataType";
import { JsonDataValue } from "./jsonDataValue";
import { JsonDataProperty } from "./jsonProperty";
import { JsonDataString } from "./jsonDataString";
import { Map } from "./map";
import { Pre } from "./pre";
import { Result } from "./result";
import { isString, isUndefinedOrNull, Type } from "./types";
import { NotFoundError } from "./notFoundError";

export class JsonDataObject implements JsonDataValue
{
    public static readonly typeDisplayName: string = "object";

    private readonly properties: Map<string, JsonDataValue>;

    public constructor(properties?: JsonDataObject | { [propertyName: string]: JsonDataType })
    {
        this.properties = Map.create();
        if (!isUndefinedOrNull(properties))
        {
            this.setAll(properties);
        }
    }

    public static create(properties?: JsonDataObject | { [propertyName: string]: JsonDataType }): JsonDataObject
    {
        return new JsonDataObject(properties);
    }

    public any(): boolean
    {
        return this.properties.any();
    }

    public getPropertyCount(): number
    {
        return this.properties.getCount();
    }

    public iteratePropertyNames(): Iterator<string>
    {
        return this.properties.iterateKeys();
    }

    public iterateProperties(): Iterator<JsonDataProperty>
    {
        return this.iteratePropertyNames().map((propertyName: string) => this.getProperty(propertyName));
    }

    public getProperty(name: string): JsonDataProperty
    {
        return JsonDataProperty.create(this, name);
    }

    public get(name: string): Result<JsonDataValue>
    {
        Pre.condition.assertNotUndefinedAndNotNull(name, "name");

        return this.properties.get(name)
            .convertError(NotFoundError, () =>
            {
                return new NotFoundError(`The JSON object doesn't contain a property named "${name}".`);
            });
    }

    protected getAs<T extends JsonDataValue>(propertyName: string, type: Type<T>, typeDisplayName: string): Result<T>
    {
        return this.get(propertyName)
            .then((value: JsonDataValue) => value.as(type, typeDisplayName).await());
    }

    public getTypeDisplayName(): string
    {
        return JsonDataObject.typeDisplayName;
    }

    public getString(propertyName: string): Result<JsonDataString>
    {
        return this.getAs(propertyName, JsonDataString, JsonDataString.typeDisplayName);
    }

    public getStringValue(propertyName: string): Result<string>
    {
        return this.getString(propertyName)
            .then((element: JsonDataString) => element.getValue());
    }

    public getBoolean(name: string): Result<JsonDataBoolean>
    {
        return this.getAs(name, JsonDataBoolean, JsonDataBoolean.typeDisplayName);
    }

    public getBooleanValue(name: string): Result<boolean>
    {
        return this.getBoolean(name)
            .then((element: JsonDataBoolean) => element.getValue());
    }

    public getNull(name: string): Result<JsonDataNull>
    {
        return this.getAs(name, JsonDataNull, JsonDataNull.typeDisplayName);
    }

    public getNullValue(name: string): Result<null>
    {
        return this.getNull(name)
            .then((element: JsonDataNull) => element.getValue());
    }

    public getNumber(name: string): Result<JsonDataNumber>
    {
        return this.getAs(name, JsonDataNumber, JsonDataNumber.typeDisplayName);
    }

    public getNumberValue(name: string): Result<number>
    {
        return this.getNumber(name)
            .then((element: JsonDataNumber) => element.getValue());
    }

    public getObject(name: string): Result<JsonDataObject>
    {
        return this.getAs(name, JsonDataObject, JsonDataObject.typeDisplayName);
    }

    public getArray(name: string): Result<JsonDataArray>
    {
        return this.getAs(name, JsonDataArray, JsonDataArray.typeDisplayName);
    }

    public set(name: string, value: JsonDataType): JsonDataObject
    {
        Pre.condition.assertTrue(isString(name), "isString(name)");
        Pre.condition.assertNotUndefined(value, "value");

        this.properties.set(name, JsonDataValue.toJsonDataValue(value));

        return this;
    }

    public setAll(properties: JsonDataObject | { [propertyName: string]: JsonDataType }): JsonDataObject
    {
        Pre.condition.assertNotUndefinedAndNotNull(properties, "properties");

        if (properties instanceof JsonDataObject)
        {
            for (const property of properties.iterateProperties())
            {
                this.set(property.getName(), property.getValue().await());
            }
        }
        else
        {
            for (const propertyName of Object.keys(properties))
            {
                this.set(propertyName, properties[propertyName]);
            }
        }

        return this;
    }

    public as<T extends JsonDataValue>(type: Type<T>, typeDisplayName: string): Result<T>
    {
        return JsonDataValue.as(this, type, typeDisplayName);
    }

    public toString(): string
    {
        return this.properties.toString();
    }
}