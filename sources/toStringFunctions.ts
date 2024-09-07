import { Iterable } from "./iterable";
import { List } from "./list";
import { isMap, Map } from "./map";
import { Pre } from "./pre";
import { escapeAndQuote, join } from "./strings";
import { isArray, isIterable, isObject, isString } from "./types";

/**
 * A collection of {@link ToStringFunction}s.
 */
export class ToStringFunctions
{
    private readonly functions: List<[(value: unknown) => boolean, (value: unknown) => string]>;
    private defaultToStringFunction: (value: unknown) => string;

    private constructor()
    {
        this.functions = List.create();
        this.defaultToStringFunction = (value: unknown) => this.defaultToString(value);
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
        let toStringFunction: ((value: unknown) => string) = this.defaultToStringFunction;
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

    public add<T>(matchFunction: (value: unknown) => value is T, toStringFunction: (value: T) => string): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(matchFunction, "matchFunction");
        Pre.condition.assertNotUndefinedAndNotNull(toStringFunction, "toStringFunction");

        this.functions.insert(0, [matchFunction, toStringFunction as (value: unknown) => string]);

        return this;
    }

    public addIterable(): this
    {
        return this.add(isIterable, (value: Iterable<unknown>) => value.toString(this));
    }

    public addMap(): this
    {
        return this.add(isMap, (value: Map<unknown,unknown>) => value.toString(this));
    }
}