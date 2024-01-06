import { Pre } from "./pre";

/**
 * Join the provided values with the provided separator in between each value.
 * @param separator The value to use to separate the individual values.
 * @param values The values to join.
 * @returns The joined {@link string}.
 */
export function join(separator: string, values: string[]): string
{
    if (separator === undefined || separator === null)
    {
        separator = "";
    }
    return values.join(separator);
}

export function escape(value: string | undefined | null, dontEscape?: string[]): string
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
export function quote(value: string | undefined | null, quote?: string): string
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
export function escapeAndQuote(value: string | undefined | null, quoteString?: string, dontEscape?: string[]): string
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