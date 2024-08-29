import { JsonDataObject } from "./jsonDataObject";
import { JsonDataValue } from "./jsonDataValue";
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

    public getValue(): Result<JsonDataValue>
    {
        return this.source.get(this.propertyName);
    }
}