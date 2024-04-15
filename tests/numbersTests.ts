import * as assert from "assert";

import { MissingValueParseError, StringIterator, WrongValueParseError, escapeAndQuote, join, readNumber } from "../sources";

suite("numbers.ts", () =>
{
    suite("readNumber(Iterator<string>)", () =>
    {
        function readNumberErrorTest(text: string, expected: Error, expectedRemainder: string = ""): void
        {
            test(`with ${escapeAndQuote(text)}`, () =>
            {
                const characters: StringIterator = StringIterator.create(text);
                assert.throws(() => readNumber(characters).await(), expected);
                assert.strictEqual(join("", characters.toArray()), expectedRemainder);
            });
        }

        readNumberErrorTest(
            `-`,
            new MissingValueParseError("integer portion of number"),
        );
        readNumberErrorTest(
            `-a`,
            new WrongValueParseError("integer portion of number", "\"a\""),
            "a",
        );
        readNumberErrorTest(
            `1.`,
            new MissingValueParseError("fractional portion of number"),
        );
        readNumberErrorTest(
            `1.  `,
            new WrongValueParseError("fractional portion of number", "\" \""),
            "  ",
        );
        readNumberErrorTest(
            `1e`,
            new MissingValueParseError("exponent portion of number"),
        );
        readNumberErrorTest(
            `1E`,
            new MissingValueParseError("exponent portion of number"),
        );
        readNumberErrorTest(
            `1e-`,
            new MissingValueParseError("exponent portion of number"),
        );
        readNumberErrorTest(
            `1e+`,
            new MissingValueParseError("exponent portion of number"),
        );
        readNumberErrorTest(
            `1e `,
            new WrongValueParseError("exponent portion of number", "\" \""),
            " ",
        );
        readNumberErrorTest(
            `1e- `,
            new WrongValueParseError("exponent portion of number", "\" \""),
            " ",
        );
        readNumberErrorTest(
            `1e+ `,
            new WrongValueParseError("exponent portion of number", "\" \""),
            " ",
        );

        function readNumberTest(text: string, expected: number, expectedRemainder: string = ""): void
        {
            test(`with ${escapeAndQuote(text)}`, () =>
            {
                const characters: StringIterator = StringIterator.create(text);
                const value: number = readNumber(characters).await();
                assert.strictEqual(value, expected);
                assert.strictEqual(join("", characters.toArray()), expectedRemainder);
            });
        }

        readNumberTest(`0`, 0);
        readNumberTest(`-0`, -0);
        readNumberTest(`1`, 1);
        readNumberTest(`100`, 100);
        readNumberTest(`123`, 123);
        readNumberTest(`-1234`, -1234);
        readNumberTest(`1.2`, 1.2);
        readNumberTest(`12.345`, 12.345);
        readNumberTest(`1e0`, 1);
        readNumberTest(`1e+0`, 1);
        readNumberTest(`1e-0`, 1);
        readNumberTest(`1e10`, 1e10);
        readNumberTest(`1e987`, 1e987);
        readNumberTest(`1.2e2`, 1.2e2);
        readNumberTest(`223.456e7`, 223.456e7);
    });
});