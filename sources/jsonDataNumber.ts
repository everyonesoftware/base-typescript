import { JsonDataValue } from "./jsonDataValue";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type } from "./types";

export class JsonDataNumber implements JsonDataValue
{
    public static readonly typeDisplayName: string = "number";

    private readonly value: number;

    public constructor(value: number)
    {
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        this.value = value;
    }

    public static create(value: number): JsonDataNumber
    {
        return new JsonDataNumber(value);
    }

    public getValue(): number
    {
        return this.value;
    }

    public getTypeDisplayName(): string
    {
        return JsonDataNumber.typeDisplayName;
    }

    public toString(): string
    {
        return JSON.stringify(this.value);
    }

    public as<T extends JsonDataValue>(type: Type<T>, typeDisplayName: string): Result<T>
    {
        return JsonDataValue.as(this, type, typeDisplayName);
    }
}