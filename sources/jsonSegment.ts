import { JsonBoolean } from "./jsonBoolean";
import { JsonNull } from "./jsonNull";
import { JsonNumber } from "./jsonNumber";
import { JsonObject } from "./jsonObject";
import { JsonSegmentType } from "./jsonSegmentType";
import { JsonString } from "./jsonString";

export abstract class JsonSegment
{
    public static boolean(value: boolean): JsonBoolean
    {
        return JsonBoolean.create(value);
    }

    public static number(value: number): JsonNumber
    {
        return JsonNumber.create(value);
    }

    public static string(value: string, quote: string = `"`, endQuote: boolean = true): JsonString
    {
        return JsonString.create(value, quote, endQuote);
    }

    public static null(): JsonNull
    {
        return JsonNull.create();
    }

    public static object(): JsonObject
    {
        return JsonObject.create();
    }

    public abstract getType(): JsonSegmentType;

    public abstract toString(): string;
}