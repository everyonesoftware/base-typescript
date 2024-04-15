import { orList } from "./english";
import { JavascriptIterable } from "./javascript";
import { Pre } from "./pre";
import { join } from "./strings";
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
}

/**
 * A {@link ParseError} that is thrown when a value is expected but none are found.
 */
export class MissingValueParseError extends ParseError
{
    private readonly missingValue: string;

    public constructor(missingValue: string);
    public constructor(parameters: { missingValue: string });
    constructor(missingValueOrParameters: string | { missingValue: string })
    {
        let missingValue: string;
        if (isString(missingValueOrParameters))
        {
            missingValue = missingValueOrParameters;
        }
        else
        {
            missingValue = missingValueOrParameters.missingValue;
        }

        Pre.condition.assertNotEmpty(missingValue, "missingValue");

        super(`Missing ${missingValue}.`);

        this.missingValue = missingValue;
    }

    /**
     * Get the value that is missing.
     */
    public getMissingValue(): string
    {
        return this.missingValue;
    }
}

/**
 * A {@link ParseError} that is thrown when one value is expected but a different value
 * is found.
 */
export class WrongValueParseError extends ParseError
{
    private readonly expected: string | JavascriptIterable<string>;
    private readonly actual: string;

    public constructor(expected: string | JavascriptIterable<string>, actual: string);
    public constructor(parameters: { expected: string | JavascriptIterable<string>, actual: string });
    constructor(expectedOrParameters: string | JavascriptIterable<string> | { expected: string | JavascriptIterable<string>, actual: string }, actual?: string)
    {
        let expected: string | JavascriptIterable<string>;
        if (isString(expectedOrParameters) || isJavascriptIterable(expectedOrParameters))
        {
            expected = expectedOrParameters;
        }
        else
        {
            expected = expectedOrParameters.expected;
            actual = expectedOrParameters.actual;
        }

        Pre.condition.assertNotUndefinedAndNotNull(expected, "expected");
        Pre.condition.assertNotUndefinedAndNotNull(actual, "actual");

        if (isString(expected))
        {
            expected = [expected];
        }

        super(`Expected ${orList(expected)}, but found ${actual} instead.`);

        this.expected = expected;
        this.actual = actual;
    }

    /**
     * Get the value or values that were expected.
     */
    public getExpected(): string | JavascriptIterable<string>
    {
        return this.expected;
    }

    /**
     * Get the value that was actually found.
     */
    public getActual(): string
    {
        return this.actual;
    }
}

/**
 * A {@link ParseError} that is thrown when a value is read when no value is expected.
 */
export class UnexpectedValueParseError extends ParseError
{
    private readonly unexpectedValue: string;

    public constructor(unexpectedValue: string);
    public constructor(parameters: { unexpectedValue: string });
    constructor(unexpectedValueOrParameters: string | { unexpectedValue: string })
    {
        let unexpectedValue: string;
        if (isString(unexpectedValueOrParameters))
        {
            unexpectedValue = unexpectedValueOrParameters;
        }
        else
        {
            unexpectedValue = unexpectedValueOrParameters.unexpectedValue;
        }

        Pre.condition.assertNotEmpty(unexpectedValue, "unexpectedValue");

        super(`Unexpected value: ${unexpectedValue}`);

        this.unexpectedValue = unexpectedValue;
    }

    /**
     * Get the unexpected value.
     */
    public getUnexpectedValue(): string
    {
        return this.unexpectedValue;
    }
}