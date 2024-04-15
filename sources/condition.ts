import { AssertMessageParameters } from "./assertMessageParameters";
import { JavascriptIterable } from "./javascript";

/**
 * A collection of condition methods that can be used to assert the state of an application.
 */
export class Condition
{
    private readonly createErrorFunction: (message: string) => Error;

    protected constructor(createErrorFunction: (message: string) => Error)
    {
        this.createErrorFunction = createErrorFunction;
    }

    /**
     * Create a new {@link Condition} object.
     * @param createErrorFunction The function to use to create this {@link Condition}'s errors. If
     * no function is provided, then a default function that creates an {@link Error} from the
     * provided message will be used.
     */
    public static create(createErrorFunction?: (message: string) => Error): Condition
    {
        if (createErrorFunction === undefined)
        {
            createErrorFunction = (message: string) => new Error(message);
        }
        return new Condition(createErrorFunction);
    }

    /**
     * Create an error message based on the provided parameters.
     * @param parameters The parameters to use to create the error message.
     */
    private static createErrorMessage(parameters: AssertMessageParameters): string
    {
        let result: string = "";

        if (parameters.message)
        {
            result += `Message: ${parameters.message}`;
        }

        if (parameters.expression)
        {
            if (result)
            {
                result += "\n";
            }
            result += `Expression: ${parameters.expression}`;
        }

        if (result)
        {
            result += "\n";
        }
        result += `Expected: ${parameters.expected}`;

        if (result)
        {
            result += "\n";
        }
        result += `Actual: ${parameters.actual}`;

        return result;
    }

    private createError(parameters: AssertMessageParameters): Error
    {
        const message: string = Condition.createErrorMessage(parameters);
        return this.createErrorFunction(message);
    }

    /**
     * Assert that the provided value is undefined.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public assertUndefined(value: unknown, expression?: string, message?: string): asserts value is undefined
    {
        if (value !== undefined)
        {
            throw this.createError({
                expected: "undefined",
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    /**
     * Assert that the provided value is not undefined and not null.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public assertNotUndefined<T>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>
    {
        if (value === undefined)
        {
            throw this.createError({
                expected: "not undefined",
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    /**
     * Assert that the provided value is not undefined and not null.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public assertNotUndefinedAndNotNull<T>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>
    {
        if (value === undefined || value === null)
        {
            throw this.createError({
                expected: "not undefined and not null",
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    /**
     * Assert that the provided value is true.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public assertTrue(value: boolean, expression?: string, message?: string): asserts value is true
    {
        if (!value)
        {
            throw this.createError({
                expected: `${true}`,
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    /**
     * Assert that the provided value is false.
     * @param value The value to check.
     * @param expression The name of the expression that produced the value.
     * @param message An additional message that will be included with the error.
     */
    public assertFalse(value: boolean, expression?: string, message?: string): asserts value is false
    {
        if (value)
        {
            throw this.createError({
                expected: `${false}`,
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    /**
     * Assert that the provided actual value is the same as the provided expected value.
     * @param expected The expected value.
     * @param actual The actual value.
     * @param expression The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public assertSame<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        if (expected !== actual)
        {
            throw this.createError({
                expected: JSON.stringify(expected),
                actual: JSON.stringify(actual),
                expression: expression,
                message: message,
            });
        }
    }

    /**
     * Assert that the provided actual value is not the same as the provided expected value.
     * @param expected The expected value.
     * @param actual The actual value.
     * @param expression The expression that produced the actual value.
     * @param message An optional message that describes the scenario.
     */
    public assertNotSame<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        if (expected === actual)
        {
            throw this.createError({
                expected: `not ${JSON.stringify(expected)}`,
                actual: JSON.stringify(actual),
                expression: expression,
                message: message,
            });
        }
    }

    public assertNotEmpty(value: string, expression?: string, message?: string): asserts value is string
    {
        this.assertNotUndefinedAndNotNull(value, expression, message);
        if (value.length === 0)
        {
            throw this.createError({
                expected: "not empty",
                actual: `""`,
                expression: expression,
                message: message,
            });
        }
    }

    public assertLessThan(value: number, upperBound: number, expression?: string, message?: string): void
    {
        if (!(value < upperBound))
        {
            throw this.createError({
                expected: `less than ${upperBound}`,
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    public assertLessThanOrEqualTo(value: number, upperBound: number, expression?: string, message?: string): void
    {
        if (!(value <= upperBound))
        {
            throw this.createError({
                expected: `less than or equal to ${upperBound}`,
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    public assertGreaterThanOrEqualTo(value: number, lowerBound: number, expression?: string, message?: string): void
    {
        if (!(lowerBound <= value))
        {
            throw this.createError({
                expected: `greater than or equal to ${lowerBound}`,
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    public assertGreaterThan(value: number, lowerBound: number, expression?: string, message?: string): void
    {
        if (!(lowerBound < value))
        {
            throw this.createError({
                expected: `greater than ${lowerBound}`,
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    public assertBetween(lowerBound: number, value: number, upperBound: number, expression?: string, message?: string): void
    {
        this.assertLessThanOrEqualTo(lowerBound, upperBound, "lowerBound");
        if (!(lowerBound <= value && value <= upperBound))
        {
            throw this.createError({
                expected: (lowerBound === upperBound ? `${lowerBound}` : `between ${lowerBound} and ${upperBound}`),
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    public assertAccessIndex(index: number, count: number, expression?: string, message?: string): void
    {
        this.assertGreaterThanOrEqualTo(count, 1, "count");
        this.assertBetween(0, index, count - 1, expression, message);
    }

    public assertInsertIndex(index: number, count: number, expression?: string, message?: string): void
    {
        this.assertGreaterThanOrEqualTo(count, 0, "count");
        this.assertBetween(0, index, count, expression, message);
    }

    /**
     * Assert that the value is one of the possibilities.
     * @param possibilities The possible values that the value can be.
     * @param value The value to check.
     * @param expression The expression that produced the value.
     * @param message An optional error message.
     */
    public assertOneOf<T>(possibilities: JavascriptIterable<T>, value: T, expression?: string, message?: string): void
    {
        this.assertNotUndefinedAndNotNull(possibilities, "possibilities");

        let found: boolean = false;
        for (const possibility of possibilities)
        {
            if (possibility === value)
            {
                found = true;
                break;
            }
        }

        if (!found)
        {
            throw this.createError({
                expected: `one of ${possibilities}`,
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }

    public assertInteger(value: number, expression?: string, message?: string): void
    {
        if (value % 1 !== 0)
        {
            throw this.createError({
                expected: `integer`,
                actual: `${value}`,
                expression: expression,
                message: message,
            });
        }
    }
}