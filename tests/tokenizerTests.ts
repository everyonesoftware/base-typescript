import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { Iterator, PreConditionError, Token, Tokenizer } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("tokenizer.ts", () =>
    {
        runner.testType(Tokenizer.name, () =>
        {
            function errorTest(testName: string, text: string | Iterator<string>, expected: Error): void
            {
                runner.test(testName, (test: Test) =>
                {
                    test.assertThrows(() => Tokenizer.create(text), expected);
                });
            }

            errorTest("with undefined characters", undefined!, new PreConditionError(
                "Expression: characters",
                "Expected: not undefined and not null",
                "Actual: undefined",
            ));
            errorTest("with null characters", null!, new PreConditionError(
                "Expression: characters",
                "Expected: not undefined and not null",
                "Actual: null",
            ));

            function successTest(characters: string, expected: Token[]): void
            {
                runner.test(`with ${runner.toString(characters)}`, (test: Test) =>
                {
                    const tokenizer: Tokenizer = Tokenizer.create(characters);
                    test.assertNotUndefinedAndNotNull(tokenizer);
                    test.assertFalse(tokenizer.hasStarted());
                    test.assertFalse(tokenizer.hasCurrent());

                    for (const expectedToken of expected)
                    {
                        test.assertTrue(tokenizer.next());
                        test.assertTrue(tokenizer.hasStarted());
                        test.assertTrue(tokenizer.hasCurrent());
                        test.assertEqual(tokenizer.getCurrent(), expectedToken);
                    }

                    for (let i = 0; i < 2; i++)
                    {
                        test.assertFalse(tokenizer.next());
                        test.assertTrue(tokenizer.hasStarted());
                        test.assertFalse(tokenizer.hasCurrent());
                    }
                });
            }

            successTest(
                "",
                []);
            successTest(
                " ",
                [
                    Token.whitespace(" "),
                ]);
            successTest(
                "   ",
                [
                    Token.whitespace("   "),
                ]);
            successTest(
                "a",
                [
                    Token.letters("a"),
                ]);
            successTest(
                "B",
                [
                    Token.letters("B"),
                ]);
            successTest(
                "abc",
                [
                    Token.letters("abc"),
                ]);
            successTest(
                "abcDef",
                [
                    Token.letters("abcDef"),
                ]);
            successTest(
                "abc def",
                [
                    Token.letters("abc"),
                    Token.whitespace(" "),
                    Token.letters("def"),
                ]);
            successTest(
                "abc def ghi",
                [
                    Token.letters("abc"),
                    Token.whitespace(" "),
                    Token.letters("def"),
                    Token.whitespace(" "),
                    Token.letters("ghi"),
                ]);
            successTest(
                "abc DEF ghi",
                [
                    Token.letters("abc"),
                    Token.whitespace(" "),
                    Token.letters("DEF"),
                    Token.whitespace(" "),
                    Token.letters("ghi"),
                ]);
            successTest(
                "HTTP",
                [
                    Token.letters("HTTP"),
                ]);
            successTest(
                "HTTP Client",
                [
                    Token.letters("HTTP"),
                    Token.whitespace(" "),
                    Token.letters("Client"),
                ]);
            successTest(
                "HTTPClient",
                [
                    Token.letters("HTTPClient"),
                ]);
            successTest(
                "httpClient",
                [
                    Token.letters("httpClient"),
                ]);
            successTest(
                "My HTTP Client",
                [
                    Token.letters("My"),
                    Token.whitespace(" "),
                    Token.letters("HTTP"),
                    Token.whitespace(" "),
                    Token.letters("Client"),
                ]);
            successTest(
                "myHTTPClient",
                [
                    Token.letters("myHTTPClient"),
                ]);
            successTest(
                "First Sentence. Second Sentence",
                [
                    Token.letters("First"),
                    Token.whitespace(" "),
                    Token.letters("Sentence"),
                    Token.period(),
                    Token.whitespace(" "),
                    Token.letters("Second"),
                    Token.whitespace(" "),
                    Token.letters("Sentence"),
                ]);
            successTest(
                "I Am Trying",
                [
                    Token.letters("I"),
                    Token.whitespace(" "),
                    Token.letters("Am"),
                    Token.whitespace(" "),
                    Token.letters("Trying"),
                ]);
            successTest(
                "abcDef ghiJkl",
                [
                    Token.letters("abcDef"),
                    Token.whitespace(" "),
                    Token.letters("ghiJkl"),
                ]);
            successTest(
                "lee7 c0d3",
                [
                    Token.letters("lee"),
                    Token.digits("7"),
                    Token.whitespace(" "),
                    Token.letters("c"),
                    Token.digits("0"),
                    Token.letters("d"),
                    Token.digits("3"),
                ]);
            successTest(
                "simple3test",
                [
                    Token.letters("simple"),
                    Token.digits("3"),
                    Token.letters("test"),
                ]);
            successTest(
                "a-kebab-case-example",
                [
                    Token.letters("a"),
                    Token.hyphen(),
                    Token.letters("kebab"),
                    Token.hyphen(),
                    Token.letters("case"),
                    Token.hyphen(),
                    Token.letters("example"),
                ]);
            successTest(
                "a_snake_case_example",
                [
                    Token.letters("a"),
                    Token.underscore(),
                    Token.letters("snake"),
                    Token.underscore(),
                    Token.letters("case"),
                    Token.underscore(),
                    Token.letters("example"),
                ]);
            successTest(
                "APascalCaseExample",
                [
                    Token.letters("APascalCaseExample"),
                ]);
            successTest(
                "AnotherPascalCaseExample",
                [
                    Token.letters("AnotherPascalCaseExample"),
                ]);
            successTest(
                "a b  .  c d",
                [
                    Token.letters("a"),
                    Token.whitespace(" "),
                    Token.letters("b"),
                    Token.whitespace("  "),
                    Token.period(),
                    Token.whitespace("  "),
                    Token.letters("c"),
                    Token.whitespace(" "),
                    Token.letters("d"),
                ]);
        });
    });
}
test(createTestRunner());