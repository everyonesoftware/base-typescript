import { JavascriptIterable } from "./javascript";
import { Pre } from "./pre";
import { Post } from "./post";
import { isString } from "./types";

export function getLength(value: string | undefined | null): number
{
    return value !== undefined && value !== null ? value.length : 0;
}

export function toString(value: undefined | null | { toString(): string }): string
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
    else
    {
        result = value.toString();
    }

    Post.condition.assertNotUndefinedAndNotNull(result, "result");

    return result;
}

/**
 * Join the provided values with the provided separator in between each value.
 * @param separator The value to use to separate the individual values.
 * @param values The values to join.
 * @returns The joined {@link string}.
 */
export function join(separator: string, values: JavascriptIterable<string>): string;
export function join(parameters: { separator: string, values: JavascriptIterable<string> }): string;
export function join(separatorOrParameters: string | { separator: string, values: JavascriptIterable<string> }, values?: JavascriptIterable<string>): string
{
    let separator: string;
    if (isString(separatorOrParameters) || separatorOrParameters === undefined || separatorOrParameters === null)
    {
        separator = separatorOrParameters;
    }
    else
    {
        separator = separatorOrParameters.separator;
        values = separatorOrParameters.values;
    }

    Pre.condition.assertNotUndefinedAndNotNull(separator, "separator");
    Pre.condition.assertNotUndefinedAndNotNull(values, "values");

    return Array.from(values).join(separator);
}

export function escape(value: string | undefined | null, dontEscape?: string[]): string;
export function escape(parameters: { value: string | undefined | null, dontEscape?: string[] }): string;
export function escape(valueOrParameters: string | undefined | null | { value: string | undefined | null, dontEscape?: string[] }, dontEscape?: string[]): string
{
    let value: string | undefined | null;
    if (isString(valueOrParameters) || valueOrParameters === undefined || valueOrParameters === null)
    {
        value = valueOrParameters;
    }
    else
    {
        value = valueOrParameters.value;
        dontEscape = valueOrParameters.dontEscape;
    }

    let result: string;
    if (value === undefined)
    {
        result = "undefined";
    }
    else if (value === null)
    {
        result = "null";
    }
    else
    {
        if (!dontEscape)
        {
            dontEscape = [];
        }

        result = "";
        for (const character of value)
        {
            if (dontEscape.includes(character))
            {
                result += character;
            }
            else
            {
                switch (character)
                {
                    case "\n":
                        result += "\\n";
                        break;

                    case "\r":
                        result += "\\r";
                        break;

                    case "\t":
                        result += "\\t";
                        break;

                    case "\'":
                        result += "\\\'";
                        break;

                    case "\"":
                        result += "\\\"";
                        break;

                    default:
                        result += character;
                        break;
                }
            }
        }
    }
    return result;
}

/**
 * Get a version of the provided value that is quoted with the provided quote.
 * @param value The value to quote.
 * @param quote The quotes to surround the provided value with.
 */
export function quote(value: string | undefined | null, quote?: string): string;
/**
 * Get a version of the provided value that is quoted with the provided quote.
 * @param parameters The parameters to use to invoke this function.
 */
export function quote(parameters: { value: string | undefined | null, quote?: string }): string;
export function quote(valueOrParameters: string | undefined | null | { value: string | undefined | null, quote?: string }, quote?: string): string
{
    let value: string | undefined | null;
    if (isString(valueOrParameters) || valueOrParameters === undefined || valueOrParameters === null)
    {
        value = valueOrParameters;
    }
    else
    {
        value = valueOrParameters.value;
        quote = valueOrParameters.quote;
    }

    let result: string;
    if (value === undefined)
    {
        result = "undefined";
    }
    else if (value === null)
    {
        result = "null";
    }
    else
    {
        if (quote === undefined)
        {
            quote = "\"";
        }
        result = `${quote}${value}${quote}`;
    }
    return result;
}

/**
 * Get a version of the provided value where the characters are escaped and quoted.
 * @param value The value to escape and quote.
 * @param quoteString The quote to surround the value with.
 * @param dontEscape The characters to not escape.
 */
export function escapeAndQuote(value: string | undefined | null, quoteString?: string, dontEscape?: string[]): string;
export function escapeAndQuote(parameters: { value: string | undefined | null, quoteString?: string, dontEscape?: string[] }): string;
export function escapeAndQuote(valueOrParameters: string | undefined | null | { value: string | undefined | null, quoteString?: string, dontEscape?: string[] }, quoteString?: string, dontEscape?: string[]): string
{
    let value: string | undefined | null;
    if (isString(valueOrParameters) || valueOrParameters === undefined || valueOrParameters === null)
    {
        value = valueOrParameters;
    }
    else
    {
        value = valueOrParameters.value;
        quoteString = valueOrParameters.quoteString;
        dontEscape = valueOrParameters.dontEscape;
    }

    let result: string;
    if (value === undefined)
    {
        result = "undefined";
    }
    else if (value === null)
    {
        result = "null";
    }
    else
    {
        result = escape(value, dontEscape);
        result = quote(result, quoteString);
    }
    return result;
}

/**
 * Get whether the provided value only contains whitespace characters.
 * @param value The value to check.
 */
export function isWhitespace(value: string): boolean
{
    Pre.condition.assertNotUndefinedAndNotNull(value, "value");
    Pre.condition.assertSame(1, value.length, "value.length");

    let result: boolean = true;
    switch (value[0])
    {
        case " ":
        case "\r":
        case "\n":
        case "\t":
            result = true;
            break;

        default:
            result = false;
            break;
    }
    return result;
}

/**
 * Get whether the provided value only contains letters.
 * @param value The value to check.
 */
export function isLetter(value: string): boolean
{
    Pre.condition.assertNotUndefinedAndNotNull(value, "value");
    Pre.condition.assertSame(1, value.length, "value.length");
    
    const character: string = value[0];
    let result: boolean = false;
    if ("A" <= character)
    {
        result = (character <= "Z");
        if (!result && "a" <= character)
        {
            result = (character <= "z");
        }
    }
    return result;
}

/**
 * Get whether the provided value only contains letters.
 * @param value The value to check.
 */
export function isLowercasedLetter(value: string): boolean
{
    Pre.condition.assertNotUndefinedAndNotNull(value, "value");
    Pre.condition.assertSame(1, value.length, "value.length");

    const character: string = value[0];
    return ("a" <= character && character <= "z");
}

/**
 * Get whether the provided value only contains letters.
 * @param value The value to check.
 */
export function isUppercasedLetter(value: string): boolean
{
    Pre.condition.assertNotUndefinedAndNotNull(value, "value");
    Pre.condition.assertSame(1, value.length, "value.length");

    const character: string = value[0];
    return ("A" <= character && character <= "Z");
}

/**
 * Get whether the provided value only contains digits.
 * @param value The value to check.
 */
export function isDigit(value: string): boolean
{
    Pre.condition.assertNotUndefinedAndNotNull(value, "value");
    Pre.condition.assertSame(1, value.length, "value.length");

    const character: string = value[0];
    return ("0" <= character && character <= "9");
}

/**
 * Get whether the provided value only contains letters and digits.
 * @param value The value to check.
 */
export function isLetterOrDigit(value: string): boolean
{
    Pre.condition.assertNotUndefinedAndNotNull(value, "value");
    Pre.condition.assertSame(1, value.length, "value.length");

    const character: string = value[0];
    let result: boolean = false;
    if ("0" <= character)
    {
        result = (character <= "9");
        if (!result && "A" <= character)
        {
            result = (character <= "Z");
            if (!result && "a" <= character)
            {
                result = (character <= "z");
            }
        }
    }
    return result;
}