import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { MissingValueParseError, StringIterator, WrongValueParseError, join, readNumber } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("numbers.ts", () =>
    {
        runner.testFunction("readNumber(Iterator<string>)", () =>
        {
            function readNumberErrorTest(text: string, expected: Error, expectedRemainder: string = ""): void
            {
                runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                {
                    const characters: StringIterator = StringIterator.create(text);
                    test.assertThrows(() => readNumber(characters).await(), expected);
                    test.assertEqual(join("", characters.toArray()), expectedRemainder);
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
                runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                {
                    const characters: StringIterator = StringIterator.create(text);
                    const value: number = readNumber(characters).await();
                    test.assertEqual(value, expected);
                    test.assertEqual(join("", characters.toArray()), expectedRemainder);
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
}
test(createTestRunner());