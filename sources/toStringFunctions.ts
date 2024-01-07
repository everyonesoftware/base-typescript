import { List } from "./list";
import { Pre } from "./pre";
import { escapeAndQuote, join } from "./strings";
import { isArray, isObject, isString } from "./types";

/**
 * A function that determines if a the value is a match.
 */
export type MatchFunction = (value: unknown) => boolean;

/**
 * A function that converts the value into a {@link String}.
 */
export type ToStringFunction<T> = (value: T) => string;

/**
 * A collection of {@link ToStringFunction}s.
 */
export class ToStringFunctions
{
    private readonly functions: List<[MatchFunction, ToStringFunction<any>]>;
    private defaultToStringFunction: ToStringFunction<unknown>;

    private constructor()
    {
        this.functions = List.create();
        this.defaultToStringFunction = (value: any) => this.defaultToString(value);
    }

    public static create(): ToStringFunctions
    {
        return new ToStringFunctions();
    }

    private defaultToString(value: unknown): string
    {
        let result: string;
        if (value === undefined)
        {
            result = "undefined";
        }
        else if (value === null)
        {
            result = "null";
        }
        else if (isString(value))
        {
            result = escapeAndQuote(value);
        }
        else if (isArray(value))
        {
            result = `[${join(",", value.map(x => this.toString(x)))}]`;
        }
        else if (isObject(value))
        {
            result = `{${join(",", Object.keys(value).map(x => `${this.toString(x)}:${this.toString((value as any)[x])}`))}}`;
        }
        else
        {
            result = JSON.stringify(value);
        }
        return result;
    }

    /**
     * Get the {@link String} representation of the value with the registered
     * {@link ToStringFunction}s.
     * @param value The value to get the {@link String} representation of.
     */
    public toString(value: unknown): string
    {
        let toStringFunction: ToStringFunction<unknown> = this.defaultToStringFunction;
        for (const [match, toString] of this.functions)
        {
            if (match(value))
            {
                toStringFunction = toString;
                break;
            }
        }
        return toStringFunction(value);
    }

    public add<T>(matchFunction: MatchFunction, toStringFunction: ToStringFunction<T>): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(matchFunction, "matchFunction");
        Pre.condition.assertNotUndefinedAndNotNull(toStringFunction, "toStringFunction");

        this.functions.insert(0, [matchFunction, toStringFunction]);

        return this;
    }
}