import { AssertMessageParameters } from "./assertMessageParameters";
import { Bytes } from "./bytes";
import { Comparer } from "./comparer";
import { Comparison } from "./comparison";
import { Condition } from "./condition";
import { Iterable } from "./iterable";
import { JavascriptIterable } from "./javascript";
import { hasFunction, hasProperty, instanceOf, isJavascriptIterable, isString, isUndefinedOrNull, Type } from "./types";

/**
 * A collection of condition methods that can be used to assert the state of an application.
 */
export abstract class ConditionBase implements Condition
{
    protected constructor()
    {
    }

    /**
     * Get the {@link String} representation of the provided value.
     * @param value The value to get the {@link String} representation of.
     */
    public abstract toString(value: unknown): string;

    /**
     * Get whether the provided values are equal.
     * @param left The left part of the comparison.
     * @param right The right part of the comparison.
     */
    public abstract areEqual(left: unknown, right: unknown): boolean;

    /**
     * Create an {@link Error} based on the provided {@link AssertMessageParameters}.
     * @param parameters The {@link AssertMessageParameters} that define how the should be made.
     */
    public abstract createError(parameters: AssertMessageParameters): Error;

    /**
     * Create an error message based on the provided parameters.
     * @param parameters The parameters to use to create the error message.
     */
    public static createErrorMessage(parameters: AssertMessageParameters): string
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

    public assertUndefined(value: unknown, expression?: string, message?: string): asserts value is undefined
    {
        if (value !== undefined)
        {
            throw this.createError({
                expected: this.toString(undefined),
                actual: this.toString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertNotUndefined<T>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>
    {
        if (value === undefined)
        {
            throw this.createError({
                expected: `not ${this.toString(undefined)}`,
                actual: this.toString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertNotUndefinedAndNotNull<T>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>
    {
        if (value === undefined || value === null)
        {
            throw this.createError({
                expected: `not ${this.toString(undefined)} and not ${this.toString(null)}`,
                actual: this.toString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertTrue(value: boolean, expression?: string, message?: string): asserts value is true
    {
        if (value !== true)
        {
            throw this.createError({
                expected: this.toString(true),
                actual: this.toString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertFalse(value: boolean, expression?: string, message?: string): asserts value is false
    {
        if (value !== false)
        {
            throw this.createError({
                expected: this.toString(false),
                actual: this.toString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertSame<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        if (expected !== actual)
        {
            throw this.createError({
                expected: this.toString(expected),
                actual: this.toString(actual),
                expression: expression,
                message: message,
            });
        }
    }

    public assertNotSame<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        if (expected === actual)
        {
            throw this.createError({
                expected: `not ${this.toString(expected)}`,
                actual: this.toString(actual),
                expression: expression,
                message: message,
            });
        }
    }

    public assertEqual<T>(expected: T, actual: T, expression?: string, message?: string): void
    {
        let comparison: Comparison | undefined = Comparer.compareSameUndefinedNull(expected, actual);
        if (comparison === undefined && this.areEqual(expected, actual))
        {
            comparison = Comparison.Equal;
        }

        if (comparison !== Comparison.Equal)
        {
            throw this.createError({
                expected: this.toString(expected),
                actual: this.toString(actual),
                expression: expression,
                message: message,
            });
        }
    }

    public assertNotEqual<T>(notExpected: T, actual: T, expression?: string, message?: string): void
    {
        let comparison: Comparison | undefined = Comparer.compareSameUndefinedNull(notExpected, actual);
        if (comparison === undefined && this.areEqual(notExpected, actual))
        {
            comparison = Comparison.Equal;
        }

        if (comparison === Comparison.Equal)
        {
            throw this.createError({
                expected: `not ${this.toString(notExpected)}`,
                actual: this.toString(actual),
                expression: expression,
                message: message,
            });
        }
    }

    public assertNotEmpty<T extends JavascriptIterable<unknown> | string>(value: T, expression?: string, message?: string): asserts value is NonNullable<T>
    {
        this.assertNotUndefinedAndNotNull(value, expression, message);
        if ((isString(value) && value.length === 0) ||
            (isJavascriptIterable(value) && !Iterable.create(value).any()))
        {
            throw this.createError({
                expected: "not empty",
                actual: this.toString(value),
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
                expected: `less than ${this.toString(upperBound)}`,
                actual: this.toString(value),
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
                expected: `less than or equal to ${this.toString(upperBound)}`,
                actual: this.toString(value),
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
                expected: `greater than or equal to ${this.toString(lowerBound)}`,
                actual: this.toString(value),
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
                expected: `greater than ${this.toString(lowerBound)}`,
                actual: this.toString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertBetween(lowerBound: number, value: number, upperBound: number, expression?: string, message?: string): void
    {
        this.assertLessThanOrEqualTo(lowerBound, upperBound, "lowerBound");
        if (isUndefinedOrNull(value) || !(lowerBound <= value && value <= upperBound))
        {
            throw this.createError({
                expected: (lowerBound === upperBound
                    ? this.toString(lowerBound)
                    : `between ${this.toString(lowerBound)} and ${this.toString(upperBound)}`),
                actual: this.toString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertAccessIndex(index: number, count: number, expression?: string, message?: string): void
    {
        this.assertGreaterThanOrEqualTo(count, 1, "count");
        this.assertInteger(index, expression);
        this.assertBetween(0, index, count - 1, expression, message);
    }

    public assertInsertIndex(index: number, count: number, expression?: string, message?: string): void
    {
        this.assertGreaterThanOrEqualTo(count, 0, "count");
        this.assertInteger(index, expression);
        this.assertBetween(0, index, count, expression, message);
    }

    public assertOneOf<T>(possibilities: JavascriptIterable<T>, value: T, expression?: string, message?: string): void
    {
        this.assertNotUndefinedAndNotNull(possibilities, "possibilities");

        let found: boolean = false;
        for (const possibility of possibilities)
        {
            if (this.areEqual(possibility, value))
            {
                found = true;
                break;
            }
        }

        if (!found)
        {
            throw this.createError({
                expected: `one of ${this.toString(possibilities)}`,
                actual: this.toString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertByte(value: number, expression?: string, message?: string): void
    {
        this.assertBetween(Bytes.minimumValue, value, Bytes.maximumValue, expression, message);
        this.assertInteger(value, "value");
    }

    public assertInteger(value: number, expression?: string, message?: string): void
    {
        if (value % 1 !== 0)
        {
            throw this.createError({
                expected: `integer`,
                actual: this.toString(value),
                expression: expression,
                message: message,
            });
        }
    }

    public assertInstanceOf<T>(value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string): asserts value is T;
    public assertInstanceOf<T>(parameters: { value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string }): void;
    public assertInstanceOf<T>(parametersOrValue: unknown | { value: unknown, type: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string }, type?: Type<T>, typeCheck?: (value: unknown) => value is T, expression?: string, message?: string): void
    {
        let value: unknown;
        if (hasProperty(parametersOrValue, "value") &&
            hasProperty(parametersOrValue, "type"))
        {
            value = parametersOrValue.value;
            type = parametersOrValue.type as Type<T>;
            if (hasFunction(parametersOrValue, "typeCheck"))
            {
                typeCheck = parametersOrValue.typeCheck as (value: unknown) => value is T;
            }
            if (hasProperty(parametersOrValue, "expression"))
            {
                expression = parametersOrValue.expression as string;
            }
            if (hasProperty(parametersOrValue, "message"))
            {
                message = parametersOrValue.message as string;
            }
        }
        else
        {
            value = parametersOrValue;
        }

        if (!instanceOf(value, type!, typeCheck))
        {
            throw this.createError({
                expected: `instance of ${type!.name}`,
                actual: this.toString(value),
                expression: expression,
                message: message,
            });
        }
    }
}