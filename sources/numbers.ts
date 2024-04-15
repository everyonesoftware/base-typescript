import { Iterator } from "./iterator";
import { MissingValueParseError, WrongValueParseError } from "./parseError";
import { Pre } from "./pre";
import { Result } from "./result";
import { escapeAndQuote, isDigit } from "./strings";

export function readDigits(characters: Iterator<string>): Result<string>
{
    Pre.condition.assertNotUndefinedAndNotNull(characters, "characters");

    return Result.create(() =>
    {
        characters.start();

        if (!characters.hasCurrent())
        {
            throw new MissingValueParseError("digits");
        }
        else if (!isDigit(characters.getCurrent()))
        {
            throw new WrongValueParseError("digits", escapeAndQuote(characters.getCurrent()));
        }

        let result: string = "";
        do
        {
            result += characters.takeCurrent();
        }
        while (characters.hasCurrent() && isDigit(characters.getCurrent()));

        return result;
    });
}

/**
 * Read an unsigned integer from the provided {@link Iterator}.
 * @param characters The characters to read the unsigned integer from.
 */
export function readUnsignedInteger(characters: Iterator<string>): Result<number>
{
    Pre.condition.assertNotUndefinedAndNotNull(characters, "characters");

    return readDigits(characters)
        .convertError(MissingValueParseError, () => new MissingValueParseError("unsigned integer"))
        .convertError(WrongValueParseError, error => new WrongValueParseError("unsigned integer", error.getActual()))
        .then(Number.parseInt);
}

/**
 * Read a number from the provided {@link Iterator}. The number can be signed, contain a
 * fractional component, and contain an exponent component.
 * @param characters The characters to read a number from.
 */
export function readNumber(characters: Iterator<string>): Result<number>
{
    Pre.condition.assertNotUndefinedAndNotNull(characters, "characters");

    return Result.create(() =>
    {
        characters.start();

        if (!characters.hasCurrent())
        {
            throw new MissingValueParseError("integer portion of number");
        }

        let text: string = "";
        if (characters.getCurrent() === "-")
        {
            text += characters.takeCurrent();

            if (!characters.hasCurrent())
            {
                throw new MissingValueParseError("integer portion of number");
            }
        }

        if (!isDigit(characters.getCurrent()))
        {
            throw new WrongValueParseError({
                expected: "integer portion of number",
                actual: escapeAndQuote(characters.getCurrent()),
            });
        }

        text += characters.takeCurrent();
        if (!text.endsWith("0"))
        {
            while (characters.hasCurrent() && isDigit(characters.getCurrent()))
            {
                text += characters.takeCurrent();
            }
        }

        if (characters.hasCurrent() && characters.getCurrent() === ".")
        {
            text += characters.takeCurrent();

            if (!characters.hasCurrent())
            {
                throw new MissingValueParseError("fractional portion of number");
            }
            else if (!isDigit(characters.getCurrent()))
            {
                throw new WrongValueParseError({
                    expected: "fractional portion of number",
                    actual: escapeAndQuote(characters.getCurrent()),
                });
            }

            do
            {
                text += characters.takeCurrent();
            }
            while (characters.hasCurrent() && isDigit(characters.getCurrent()));
        }

        if (characters.hasCurrent() && (characters.getCurrent() === "e" || characters.getCurrent() === "E"))
        {
            text += characters.takeCurrent();

            if (!characters.hasCurrent())
            {
                throw new MissingValueParseError("exponent portion of number");
            }
            else if (characters.getCurrent() === "-" || characters.getCurrent() === "+")
            {
                text += characters.takeCurrent();
            }

            if (!characters.hasCurrent())
            {
                throw new MissingValueParseError("exponent portion of number");
            }
            else if (!isDigit(characters.getCurrent()))
            {
                throw new WrongValueParseError({
                    expected: "exponent portion of number",
                    actual: escapeAndQuote(characters.getCurrent()),
                });
            }
            
            do
            {
                text += characters.takeCurrent();
            }
            while (characters.hasCurrent() && isDigit(characters.getCurrent()));
        }

        return Number.parseFloat(text);
    });
}