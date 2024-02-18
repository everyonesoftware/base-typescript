import { JsonBoolean } from "./jsonBoolean";
import { JsonNull } from "./jsonNull";
import { JsonNumber } from "./jsonNumber";
import { JsonObject } from "./jsonObject";
import { JsonSegmentType } from "./jsonSegmentType";
import { JsonString } from "./jsonString";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type, isBoolean, isNumber, isString } from "./types";
import { WrongTypeError } from "./wrongTypeError";

export abstract class JsonSegment
{
    public static toJsonSegment(value: JsonSegment|number|boolean|string|null): JsonSegment
    {
        Pre.condition.assertNotUndefined(value, "value");

        if (isNumber(value))
        {
            value = JsonNumber.create(value);
        }
        else if (isBoolean(value))
        {
            value = JsonBoolean.create(value);
        }
        else if (isString(value))
        {
            value = JsonString.create(value);
        }
        else if (value === null)
        {
            value = JsonNull.create();
        }

        return value;
    }

    public static boolean(value: boolean): JsonBoolean
    {
        return JsonBoolean.create(value);
    }

    public static number(value: number): JsonNumber
    {
        return JsonNumber.create(value);
    }

    public static string(value: string, quote: string = `"`): JsonString
    {
        return JsonString.create(value, quote);
    }

    public static null(): JsonNull
    {
        return JsonNull.create();
    }

    public static object(): JsonObject
    {
        return JsonObject.create();
    }

    public static as<T>(jsonSegment: JsonSegment, type: Type<T>): Result<T>
    {
        return Result.create(() =>
        {
            if (!(jsonSegment instanceof type))
            {
                throw new WrongTypeError(`Expected ${type.name} but found ${jsonSegment.constructor.name}.`);
            }
            return jsonSegment as T;
        });
    }

    public abstract getSegmentType(): JsonSegmentType;

    public abstract toString(): string;
}