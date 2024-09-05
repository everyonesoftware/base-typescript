import { Iterator } from "./iterator";
import { JsonDataArray } from "./jsonDataArray";
import { asJsonArray, asJsonBoolean, asJsonNull, asJsonNumber, asJsonObject, asJsonString, JsonDataRawObject, JsonDataType } from "./jsonDataType";
import { JsonDataProperty } from "./jsonDataProperty";
import { Map } from "./map";
import { Pre } from "./pre";
import { Result } from "./result";
import { NotFoundError } from "./notFoundError";

export class JsonDataObject
{
    private readonly properties: Map<string, JsonDataType>;

    public constructor(properties?: JsonDataObject | JsonDataRawObject)
    {
        this.properties = Map.create();
        if (properties)
        {
            this.setAll(properties);
        }
    }

    public static create(properties?: JsonDataObject | JsonDataRawObject): JsonDataObject
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

    public getProperty(propertyName: string): JsonDataProperty
    {
        return JsonDataProperty.create(this, propertyName);
    }

    public get(propertyName: string): Result<JsonDataType>
    {
        Pre.condition.assertNotUndefinedAndNotNull(propertyName, "name");

        return this.properties.get(propertyName)
            .convertError(NotFoundError, () =>
            {
                return new NotFoundError(`The JSON object doesn't contain a property named "${propertyName}".`);
            });
    }

    public getNull(propertyName: string): Result<null>
    {
        return Result.create(() =>
        {
            const json: JsonDataType = this.get(propertyName).await();
            return asJsonNull(json).await();
        });
    }

    public getString(propertyName: string): Result<string>
    {
        return Result.create(() =>
        {
            const json: JsonDataType = this.get(propertyName).await();
            return asJsonString(json).await();
        });
    }

    public getBoolean(propertyName: string): Result<boolean>
    {
        return Result.create(() =>
        {
            const json: JsonDataType = this.get(propertyName).await();
            return asJsonBoolean(json).await();
        });
    }

    public getNumber(propertyName: string): Result<number>
    {
        return Result.create(() =>
        {
            const json: JsonDataType = this.get(propertyName).await();
            return asJsonNumber(json).await();
        });
    }

    public getObject(propertyName: string): Result<JsonDataObject>
    {
        return Result.create(() =>
        {
            const json: JsonDataType = this.get(propertyName).await();
            return asJsonObject(json).await();
        });
    }

    public getArray(propertyName: string): Result<JsonDataArray>
    {
        return Result.create(() =>
        {
            const json: JsonDataType = this.get(propertyName).await();
            return asJsonArray(json).await();
        });
    }

    public set(propertyName: string, propertyValue: JsonDataType): JsonDataObject
    {
        Pre.condition.assertNotUndefinedAndNotNull(propertyName, "propertyName");
        Pre.condition.assertNotUndefined(propertyValue, "propertyValue");

        this.properties.set(propertyName, propertyValue);

        return this;
    }

    public setAll(properties: JsonDataObject | JsonDataRawObject): JsonDataObject
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

    public toString(): string
    {
        return this.properties.toString();
    }
}