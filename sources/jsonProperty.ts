import { JsonDataObject } from "./jsonDataObject";
import { JsonDataValue } from "./jsonDataValue";
import { Pre } from "./pre";
import { Result } from "./result";

export class JsonDataProperty
{
    private readonly source: JsonDataObject;
    private readonly name: string;

    private constructor(source: JsonDataObject, name: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(source, "source");
        Pre.condition.assertNotUndefinedAndNotNull(name, "name");

        this.source = source;
        this.name = name;
    }

    public static create(source: JsonDataObject, name: string): JsonDataProperty
    {
        return new JsonDataProperty(source, name);
    }

    public getName(): string
    {
        return this.name;
    }

    public getValue(): Result<JsonDataValue>
    {
        return this.source.get(this.name);
    }
}