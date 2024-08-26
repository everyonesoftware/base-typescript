import { JsonDataValue } from "./jsonDataValue";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type } from "./types";

/**
 * A data-only representation of a JSON boolean.
 */
export class JsonDataBoolean implements JsonDataValue
{
    public static readonly typeDisplayName: string = "boolean";

    private static readonly falseValue: JsonDataBoolean = new JsonDataBoolean(false);
    private static readonly trueValue: JsonDataBoolean = new JsonDataBoolean(true);

    private readonly value: boolean;

    private constructor(value: boolean)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.value = value;
    }

    public static create(value: boolean): JsonDataBoolean
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        return value ? JsonDataBoolean.trueValue : JsonDataBoolean.falseValue;
    }

    public getValue(): boolean
    {
        return this.value;
    }

    public getTypeDisplayName(): string
    {
        return JsonDataBoolean.typeDisplayName;
    }

    public toString(): string
    {
        return this.value ? "true" : "false";
    }

    public as<T extends JsonDataValue>(type: Type<T>, typeDisplayName: string): Result<T>
    {
        return JsonDataValue.as(this, type, typeDisplayName);
    }
}