import { JsonDataValue } from "./jsonDataValue";
import { Result } from "./result";
import { Type } from "./types";

export class JsonDataNull implements JsonDataValue
{
    public static readonly typeDisplayName: string = "null";

    private static readonly value: JsonDataNull = new JsonDataNull();

    private constructor()
    {
    }

    public static create(): JsonDataNull
    {
        return JsonDataNull.value;
    }

    public getValue(): null
    {
        return null;
    }

    public getTypeDisplayName(): string
    {
        return JsonDataNull.typeDisplayName;
    }

    public toString(): string
    {
        return "null";
    }

    public as<T extends JsonDataValue>(type: Type<T>, typeDisplayName: string): Result<T>
    {
        return JsonDataValue.as(this, type, typeDisplayName);
    }
}