import { JsonDataValue } from "./jsonDataValue";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type } from "./types";

export class JsonDataString implements JsonDataValue
{
    public static readonly typeDisplayName: string = "string";

    private readonly value: string;

    public constructor(value: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.value = value;
    }

    public static create(value: string): JsonDataString
    {
        return new JsonDataString(value);
    }

    public getValue(): string
    {
        return this.value;
    }

    public as<T extends JsonDataValue>(type: Type<T>, typeDisplayName: string): Result<T>
    {
        return JsonDataValue.as(this, type, typeDisplayName);
    }

    public getTypeDisplayName(): string
    {
        return JsonDataString.typeDisplayName;
    }

    public toString(): string
    {
        return this.value;
    }
}