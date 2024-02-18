import { orList } from "./english";
import { JavascriptIterable } from "./javascript";
import { Pre } from "./pre";
import { escapeAndQuote, join } from "./strings";
import { isJavascriptIterable, isString } from "./types";

/**
 * An {@link Error} that is thrown when a parser fails.
 */
export class ParseError extends Error
{
    public constructor(...message: string[])
    {
        super(join({ separator: "\n", values: message }));
    }

    public static unexpectedToken(tokenText: string): ParseError
    {
        return new ParseError(`Unexpected token: ${tokenText}`);
    }

    public static expectedButFoundInstead(expected: string | JavascriptIterable<string>, foundInstead: string): ParseError;
    public static expectedButFoundInstead(parameters: { expected: string | JavascriptIterable<string>, foundInstead: string }): ParseError;
    static expectedButFoundInstead(expectedOrParameters: string | JavascriptIterable<string> | { expected: string | JavascriptIterable<string>, foundInstead: string }, foundInstead?: string): ParseError
    {
        let expected: string | JavascriptIterable<string>;
        if (isString(expectedOrParameters) || isJavascriptIterable(expectedOrParameters))
        {
            expected = expectedOrParameters;
        }
        else
        {
            expected = expectedOrParameters.expected;
            foundInstead = expectedOrParameters.foundInstead;
        }

        Pre.condition.assertNotUndefinedAndNotNull(expected, "expected");
        Pre.condition.assertNotUndefinedAndNotNull(foundInstead, "foundInstead");

        if (isString(expected))
        {
            expected = [expected];
        }
        return new ParseError(`Expected ${orList(expected)}, but found ${foundInstead} instead.`);
    }

    public static missing(description: string, expected?: string): ParseError;
    public static missing(parameters: { description: string, expected?: string }): ParseError;
    static missing(descriptionOrParameters: string | { description: string, expected?: string }, expected?: string): ParseError
    {
        let description: string;
        if (isString(descriptionOrParameters))
        {
            description = descriptionOrParameters;
        }
        else
        {
            description = descriptionOrParameters.description;
            expected = descriptionOrParameters.expected;
        }

        Pre.condition.assertNotEmpty(description, "description");

        let message: string = `Missing ${description}`;
        if (expected === undefined)
        {
            message += ".";
        }
        else
        {
            message += `: ${escapeAndQuote(expected)}`;
            if (expected.length === 1)
            {
                message += ` (${expected.codePointAt(0)})`;
            }
        }
        return new ParseError(message);
    }
}