import { DocumentRange } from "./documentRange";
import { orList } from "./english";
import { JavascriptIterable } from "./javascript";
import { Pre } from "./pre";
import { join } from "./strings";
import { isString } from "./types";

/**
 * An {@link Error} that is thrown when a parser fails.
 */
export class ParseError extends Error
{
    private readonly range: DocumentRange;

    public constructor(range: DocumentRange, ...message: string[])
    {
        Pre.condition.assertNotUndefinedAndNotNull(range, "range");
        Pre.condition.assertNotUndefinedAndNotNull(message, "message");

        super(join({ separator: "\n", values: message }));

        this.range = range;
    }

    public getRange(): DocumentRange
    {
        return this.range;
    }
}

/**
 * A {@link ParseError} that is thrown when a value is expected but none are found.
 */
export class MissingValueParseError extends ParseError
{
    private readonly missingValue: string;

    public constructor(range: DocumentRange, missingValue: string);
    public constructor(parameters: { range: DocumentRange, missingValue: string });
    constructor(rangeOrParameters: DocumentRange | { range: DocumentRange, missingValue: string }, missingValue?: string)
    {
        let range: DocumentRange;
        if (rangeOrParameters instanceof DocumentRange)
        {
            range = rangeOrParameters;
        }
        else
        {
            range = rangeOrParameters.range;
            missingValue = rangeOrParameters.missingValue;
        }

        Pre.condition.assertNotUndefinedAndNotNull(range, "range");
        Pre.condition.assertNotEmpty(missingValue, "missingValue");

        super(range, `Missing ${missingValue}.`);

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

    public constructor(range: DocumentRange, expected: string | JavascriptIterable<string>, actual: string);
    public constructor(parameters: { range: DocumentRange, expected: string | JavascriptIterable<string>, actual: string });
    constructor(rangeOrParameters: DocumentRange | { range: DocumentRange, expected: string | JavascriptIterable<string>, actual: string }, expected?: string | JavascriptIterable<string>, actual?: string)
    {
        let range: DocumentRange;
        if (rangeOrParameters instanceof DocumentRange)
        {
            range = rangeOrParameters;
        }
        else
        {
            range = rangeOrParameters.range;
            expected = rangeOrParameters.expected;
            actual = rangeOrParameters.actual;
        }

        Pre.condition.assertNotUndefinedAndNotNull(range, "range");
        Pre.condition.assertNotUndefinedAndNotNull(expected, "expected");
        Pre.condition.assertNotUndefinedAndNotNull(actual, "actual");

        if (isString(expected))
        {
            expected = [expected];
        }

        super(range, `Expected ${orList(expected)}, but found ${actual} instead.`);

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