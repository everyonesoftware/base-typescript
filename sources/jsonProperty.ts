import { JsonSegment } from "./jsonSegment";
import { Pre } from "./pre";

export class JsonProperty
{
    private readonly name: string;
    private readonly value: JsonSegment;

    private constructor(name: string, value: JsonSegment)
    {
        Pre.condition.assertNotEmpty(name, "name");
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.name = name;
        this.value = value;
    }

    public static create(name: string, value: JsonSegment): JsonProperty
    {
        return new JsonProperty(name, value);
    }

    public getName(): string
    {
        return this.name;
    }

    public getValue(): JsonSegment
    {
        return this.value;
    }
}