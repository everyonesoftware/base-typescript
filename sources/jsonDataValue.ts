import { JsonDataBoolean } from "./jsonDataBoolean";
import { JsonDataType } from "./jsonDataType";
import { JsonDataNull } from "./jsonDataNull";
import { JsonDataNumber } from "./jsonDataNumber";
import { JsonDataString } from "./jsonDataString";
import { Pre } from "./pre";
import { Result } from "./result";
import { Type, hasFunction, isArray, isBoolean, isNumber, isObject, isString } from "./types";
import { WrongTypeError } from "./wrongTypeError";
import { JsonDataArray } from "./jsonDataArray";
import { JsonDataObject } from "./jsonDataObject";

/**
 * The abstract base class of the different JSON data values.
 */
export abstract class JsonDataValue
{
    public static isJsonDataValue(dataValue: JsonDataType): dataValue is JsonDataValue
    {
        return hasFunction(dataValue, "as", 2);
    }

    public static toJsonDataValue(dataValue: JsonDataType): JsonDataValue
    {
        Pre.condition.assertNotUndefined(dataValue, "value");

        if (JsonDataValue.isJsonDataValue(dataValue))
        {
            // Nothing to do.
        }
        else if (isString(dataValue))
        {
            dataValue = JsonDataString.create(dataValue);
        }
        else if (isNumber(dataValue))
        {
            dataValue = JsonDataNumber.create(dataValue);
        }
        else if (isBoolean(dataValue))
        {
            dataValue = JsonDataBoolean.create(dataValue);
        }
        else if (isArray(dataValue))
        {
            dataValue = JsonDataArray.create(dataValue);
        }
        else if (isObject(dataValue))
        {
            dataValue = JsonDataObject.create(dataValue);
        }
        else if (dataValue === null)
        {
            dataValue = JsonDataNull.create();
        }

        return dataValue;
    }

    public as<T extends JsonDataValue>(type: Type<T>, typeDisplayName: string): Result<T>
    {
        return JsonDataValue.as(this, type, typeDisplayName);
    }

    public static as<T extends JsonDataValue>(jsonDataValue: JsonDataValue, type: Type<T>, typeDisplayName: string): Result<T>
    {
        return Result.create(() =>
        {
            if (!(jsonDataValue instanceof type))
            {
                if (!typeDisplayName)
                {
                    typeDisplayName = type.name;
                }
                throw new WrongTypeError(`Expected ${typeDisplayName} but found ${jsonDataValue.getTypeDisplayName()}.`);
            }
            return jsonDataValue as T;
        });
    }

    /**
     * Get the display name of this JSON type that will be used in error messages.
     */
    public abstract getTypeDisplayName(): string;

    /**
     * Get the {@link string} representation of this {@link JsonDataValue}.
     */
    public abstract toString(): string;
}