import { JsonDataArray } from "./jsonDataArray";
import { JsonDataObject } from "./jsonDataObject";
import { JsonDataType } from "./jsonDataType";
import { Pre } from "./pre";
import { Result } from "./result";

export class JsonDataProperty
{
    private readonly source: JsonDataObject;
    private readonly propertyName: string;

    private constructor(source: JsonDataObject, propertyName: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(source, "source");
        Pre.condition.assertNotUndefinedAndNotNull(propertyName, "propertyName");

        this.source = source;
        this.propertyName = propertyName;
    }

    public static create(source: JsonDataObject, name: string): JsonDataProperty
    {
        return new JsonDataProperty(source, name);
    }

    public getName(): string
    {
        return this.propertyName;
    }

    public getValue(): Result<JsonDataType>
    {
        return this.source.get(this.propertyName);
    }

    public getValueAsString(): Result<string>
    {
        return this.source.getString(this.propertyName);
    }

    public getValueAsBoolean(): Result<boolean>
    {
        return this.source.getBoolean(this.propertyName);
    }

    public getValueAsNull(): Result<null>
    {
        return this.source.getNull(this.propertyName);
    }

    public getValueAsNumber(): Result<number>
    {
        return this.source.getNumber(this.propertyName);
    }

    public getValueAsObject(): Result<JsonDataObject>
    {
        return this.source.getObject(this.propertyName);
    }

    public getValueAsArray(): Result<JsonDataArray>
    {
        return this.source.getArray(this.propertyName);
    }

    public setValue(value: JsonDataType): JsonDataProperty
    {
        Pre.condition.assertNotUndefined(value, "value");

        this.source.set(this.propertyName, value);

        return this;
    }
}