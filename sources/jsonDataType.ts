import { JsonDataArray } from "./jsonDataArray";
import { JsonDataObject } from "./jsonDataObject";
import { Post } from "./post";
import { Result } from "./result";
import { asBoolean, asNull, asNumber, asString, isArray, isBoolean, isNull, isNumber, isObject, isString } from "./types";
import { WrongTypeError } from "./wrongTypeError";

export type JsonDataRawObject = { [propertyName: string]: JsonDataType };

export type JsonDataRawArray = JsonDataType[];

/**
 * The type of values that can be used as a JSON data value.
 */
export type JsonDataType = JsonDataArray | JsonDataRawArray | JsonDataObject | JsonDataRawObject |  number | boolean | string | null;

const arrayTypeDisplayName: string = "array";
const objectTypeDisplayName: string = "object";
const numberTypeDisplayName: string = "number";
const stringTypeDisplayName: string = "string";
const nullTypeDisplayName: string = "null";
const booleanTypeDisplayName: string = "boolean";

export function getJsonTypeDisplayName(json: JsonDataType): string
{
    let result: string;
    if (isBoolean(json))
    {
        result = booleanTypeDisplayName;
    }
    else if (isNumber(json))
    {
        result = numberTypeDisplayName;
    }
    else if (isString(json))
    {
        result = stringTypeDisplayName;
    }
    else if (isNull(json))
    {
        result = nullTypeDisplayName;
    }
    else if (json instanceof JsonDataArray || isArray(json))
    {
        result = arrayTypeDisplayName;
    }
    else // if (isJsonDataObject(json))
    {
        result = objectTypeDisplayName;
    }

    Post.condition.assertNotEmpty(result, "result");

    return result;
}

export function asJsonNull(json: JsonDataType): Result<null>
{
    return Result.create(() =>
    {
        const result: null | undefined = asNull(json);
        if (result === undefined)
        {
            throw new WrongTypeError(`Expected null but found ${getJsonTypeDisplayName(json)}.`);
        }
        return result;
    });
}

export function asJsonString(json: JsonDataType): Result<string>
{
    return Result.create(() =>
    {
        const result: string | undefined = asString(json);
        if (result === undefined)
        {
            throw new WrongTypeError(`Expected string but found ${getJsonTypeDisplayName(json)}.`);
        }
        return result;
    });
}

export function asJsonBoolean(json: JsonDataType): Result<boolean>
{
    return Result.create(() =>
    {
        const result: boolean | undefined = asBoolean(json);
        if (result === undefined)
        {
            throw new WrongTypeError(`Expected boolean but found ${getJsonTypeDisplayName(json)}.`);
        }
        return result;
    });
}

export function asJsonNumber(json: JsonDataType): Result<number>
{
    return Result.create(() =>
    {
        const result: number | undefined = asNumber(json);
        if (result === undefined)
        {
            throw new WrongTypeError(`Expected number but found ${getJsonTypeDisplayName(json)}.`);
        }
        return result;
    });
}

export function asJsonObject(json: JsonDataType): Result<JsonDataObject>
{
    return Result.create(() =>
    {
        let result: JsonDataObject;
        if (json instanceof JsonDataObject)
        {
            result = json;
        }
        else if (isObject(json) && !(json instanceof JsonDataArray))
        {
            result = JsonDataObject.create(json as JsonDataRawObject);
        }
        else
        {
            throw new WrongTypeError(`Expected object but found ${getJsonTypeDisplayName(json)}.`);
        }
        return result;
    });
}

export function asJsonArray(json: JsonDataType): Result<JsonDataArray>
{
    return Result.create(() =>
    {
        let result: JsonDataArray;
        if (json instanceof JsonDataArray)
        {
            result = json;
        }
        else if (isArray(json))
        {
            result = JsonDataArray.create(json as JsonDataRawArray);
        }
        else
        {
            throw new WrongTypeError(`Expected array but found ${getJsonTypeDisplayName(json)}.`);
        }
        return result;
    });
}