import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { TextTokenizer, Token } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("textTokenizer.ts", () =>
    {
        runner.testType(TextTokenizer.name, () =>
        {
            runner.testFunction("create(string|Iterator<string>)", () =>
            {
                function createTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const tokenizer: TextTokenizer = TextTokenizer.create(text);
                        test.assertSame(tokenizer.hasStarted(), false);
                        test.assertSame(tokenizer.hasCurrent(), false);
                    });
                }

                createTest("");
                createTest("a");
                createTest(" abc ");
            });

            runner.testFunction("next()", () =>
            {
                function nextTest(text: string, expected: Token[]): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const tokenizer: TextTokenizer = TextTokenizer.create(text);
                        test.assertSame(tokenizer.hasStarted(), false);
                        test.assertSame(tokenizer.hasCurrent(), false);

                        for (const expectedToken of expected)
                        {
                            test.assertTrue(tokenizer.next());
                            test.assertTrue(tokenizer.hasStarted());
                            test.assertTrue(tokenizer.hasCurrent());
                            test.assertEqual(tokenizer.getCurrent(), expectedToken);
                        }

                        for (let i = 0; i < 2; i++)
                        {
                            test.assertSame(tokenizer.next(), false);
                            test.assertTrue(tokenizer.hasStarted());
                            test.assertSame(tokenizer.hasCurrent(), false);
                        }
                    });
                }

                nextTest(
                    "",
                    []);
                nextTest(
                    " ",
                    [
                        Token.whitespace(" "),
                    ]);
                nextTest(
                    "   ",
                    [
                        Token.whitespace("   "),
                    ]);
                nextTest(
                    "a",
                    [
                        Token.letters("a"),
                    ]);
                nextTest(
                    "B",
                    [
                        Token.letters("B"),
                    ]);
                nextTest(
                    "abc",
                    [
                        Token.letters("abc"),
                    ]);
                nextTest(
                    "abcDef",
                    [
                        Token.letters("abc"),
                        Token.letters("Def"),
                    ]);
                nextTest(
                    "abc def",
                    [
                        Token.letters("abc"),
                        Token.whitespace(" "),
                        Token.letters("def"),
                    ]);
                nextTest(
                    "abc def ghi",
                    [
                        Token.letters("abc"),
                        Token.whitespace(" "),
                        Token.letters("def"),
                        Token.whitespace(" "),
                        Token.letters("ghi"),
                    ]);
                nextTest(
                    "abc DEF ghi",
                    [
                        Token.letters("abc"),
                        Token.whitespace(" "),
                        Token.letters("DEF"),
                        Token.whitespace(" "),
                        Token.letters("ghi"),
                    ]);
                nextTest(
                    "HTTP",
                    [
                        Token.letters("HTTP"),
                    ]);
                nextTest(
                    "HTTP Client",
                    [
                        Token.letters("HTTP"),
                        Token.whitespace(" "),
                        Token.letters("Client"),
                    ]);
                nextTest(
                    "HTTPClient",
                    [
                        Token.letters("HTTPClient"),
                    ]);
                nextTest(
                    "httpClient",
                    [
                        Token.letters("http"),
                        Token.letters("Client"),
                    ]);
                nextTest(
                    "My HTTP Client",
                    [
                        Token.letters("My"),
                        Token.whitespace(" "),
                        Token.letters("HTTP"),
                        Token.whitespace(" "),
                        Token.letters("Client"),
                    ]);
                nextTest(
                    "myHTTPClient",
                    [
                        Token.letters("my"),
                        Token.letters("HTTPClient"),
                    ]);
                nextTest(
                    "First Sentence. Second Sentence",
                    [
                        Token.letters("First"),
                        Token.whitespace(" "),
                        Token.letters("Sentence"),
                        Token.unknown("."),
                        Token.whitespace(" "),
                        Token.letters("Second"),
                        Token.whitespace(" "),
                        Token.letters("Sentence"),
                    ]);
                nextTest(
                    "I Am Trying",
                    [
                        Token.letters("I"),
                        Token.whitespace(" "),
                        Token.letters("Am"),
                        Token.whitespace(" "),
                        Token.letters("Trying"),
                    ]);
                nextTest(
                    "abcDef ghiJkl",
                    [
                        Token.letters("abc"),
                        Token.letters("Def"),
                        Token.whitespace(" "),
                        Token.letters("ghi"),
                        Token.letters("Jkl"),
                    ]);
                nextTest(
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
                nextTest(
                    "simple3test",
                    [
                        Token.letters("simple"),
                        Token.digits("3"),
                        Token.letters("test"),
                    ]);
                nextTest(
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
                nextTest(
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
                nextTest(
                    "APascalCaseExample",
                    [
                        Token.letters("APascal"),
                        Token.letters("Case"),
                        Token.letters("Example"),
                    ]);
                nextTest(
                    "AnotherPascalCaseExample",
                    [
                        Token.letters("Another"),
                        Token.letters("Pascal"),
                        Token.letters("Case"),
                        Token.letters("Example"),
                    ]);
                nextTest(
                    "a b  .  c d",
                    [
                        Token.letters("a"),
                        Token.whitespace(" "),
                        Token.letters("b"),
                        Token.whitespace("  "),
                        Token.unknown("."),
                        Token.whitespace("  "),
                        Token.letters("c"),
                        Token.whitespace(" "),
                        Token.letters("d"),
                    ]);
            });
        });
    });
}
test(createTestRunner());