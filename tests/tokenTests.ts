import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { PreConditionError, Token, TokenType } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("token.ts", () =>
    {
        runner.testType(Token.name, () =>
        {
            runner.testFunction("create(TokenType,string)", () =>
            {
                function createErrorTest(type: TokenType, text: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([type, text])}`, (test: Test) =>
                    {
                        test.assertThrows(() => Token.create(type, text), expected);
                    });
                }

                createErrorTest(undefined!, "oops", new PreConditionError(
                    "Expression: type",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(null!, "oops", new PreConditionError(
                    "Expression: type",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                createErrorTest(TokenType.Period, undefined!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                createErrorTest(TokenType.Period, null!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                createErrorTest(TokenType.Period, "", new PreConditionError(
                    "Expression: text",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));

                function createTest(type: TokenType, text: string): void
                {
                    runner.test(`with ${runner.andList([type, text])}`, (test: Test) =>
                    {
                        const token: Token = Token.create(type, text);
                        test.assertNotUndefinedAndNotNull(token);
                        test.assertSame(type, token.getType());
                        test.assertSame(text, token.getText());
                        test.assertSame(text, token.toString());
                        test.assertNotSame(token, Token.create(type, text));
                    });
                }

                createTest(TokenType.Ampersand, "&");
                createTest(TokenType.Ampersand, "oops");
                createTest(TokenType.Digits, "50");
                createTest(TokenType.Digits, "abc");
            });

            function constantTokenTest(signature: string, tokenCreator: () => Token, expectedType: TokenType, expectedText: string): void
            {
                runner.testFunction(signature, (test: Test) =>
                {
                    const token: Token = tokenCreator();
                    test.assertNotUndefinedAndNotNull(token);
                    test.assertSame(expectedType, token.getType());
                    test.assertEqual(expectedText, token.getText());
                    test.assertEqual(expectedText, token.toString());
                    test.assertNotSame(token, tokenCreator());
                });
            }

            function textTokenTests(signature: string, tokenCreator: (text: string) => Token, expectedType: TokenType): void
            {
                runner.testFunction(signature, () =>
                {
                    function errorTest(text: string, expected: Error): void
                    {
                        runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                        {
                            test.assertThrows(() => tokenCreator(text), expected);
                        });
                    }

                    errorTest(undefined!, new PreConditionError(
                        "Expression: text",
                        "Expected: not undefined and not null",
                        "Actual: undefined",
                    ));
                    errorTest(null!, new PreConditionError(
                        "Expression: text",
                        "Expected: not undefined and not null",
                        "Actual: null",
                    ));
                    errorTest("", new PreConditionError(
                        "Expression: text",
                        "Expected: not empty",
                        "Actual: \"\"",
                    ));

                    function successfulTest(text: string): void
                    {
                        runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                        {
                            const token: Token = tokenCreator(text);
                            test.assertNotUndefinedAndNotNull(token);
                            test.assertSame(expectedType, token.getType());
                            test.assertSame(text, token.getText());
                            test.assertSame(text, token.toString());
                            test.assertNotSame(token, tokenCreator(text));
                        });
                    }

                    successfulTest(" ");
                    successfulTest("\t");
                    successfulTest("abc");
                });
            }

            textTokenTests("whitespace(string)", Token.whitespace, TokenType.Whitespace);

            constantTokenTest("carriageReturn()", Token.carriageReturn, TokenType.CarriageReturn, "\r");

            constantTokenTest("newLine()", Token.newLine, TokenType.NewLine, "\n");

            textTokenTests("letters(string)", Token.letters, TokenType.Letters);

            textTokenTests("digits(string)", Token.digits, TokenType.Digits);

            constantTokenTest("period()", Token.period, TokenType.Period, ".");
            
            constantTokenTest("comma()", Token.comma, TokenType.Comma, ",");

            constantTokenTest("colon()", Token.colon, TokenType.Colon, ":");

            constantTokenTest("semicolon()", Token.semicolon, TokenType.Semicolon, ";");

            constantTokenTest("exclamationPoint()", Token.exclamationPoint, TokenType.ExclamationPoint, "!");
            
            constantTokenTest("questionMark()", Token.questionMark, TokenType.QuestionMark, "?");
            
            constantTokenTest("leftCurlyBracket()", Token.leftCurlyBracket, TokenType.LeftCurlyBracket, "{");

            constantTokenTest("rightCurlyBracket()", Token.rightCurlyBracket, TokenType.RightCurlyBracket, "}");

            constantTokenTest("leftSquareBrace()", Token.leftSquareBrace, TokenType.LeftSquareBrace, "[");

            constantTokenTest("rightSquareBrace()", Token.rightSquareBrace, TokenType.RightSquareBrace, "]");

            constantTokenTest("leftParenthesis()", Token.leftParenthesis, TokenType.LeftParenthesis, "(");

            constantTokenTest("rightParenthesis()", Token.rightParenthesis, TokenType.RightParenthesis, ")");

            constantTokenTest("hyphen()", Token.hyphen, TokenType.Hyphen, "-");

            constantTokenTest("underscore()", Token.underscore, TokenType.Underscore, "_");

            constantTokenTest("equalsSign()", Token.equalsSign, TokenType.EqualsSign, "=");

            constantTokenTest("plusSign()", Token.plusSign, TokenType.PlusSign, "+");

            constantTokenTest("asterisk()", Token.asterisk, TokenType.Asterisk, "*");

            constantTokenTest("percentSign()", Token.percentSign, TokenType.PercentSign, "%");

            constantTokenTest("ampersand()", Token.ampersand, TokenType.Ampersand, "&");

            constantTokenTest("poundSign()", Token.poundSign, TokenType.PoundSign, "#");

            constantTokenTest("backslash()", Token.backslash, TokenType.Backslash, "\\");

            constantTokenTest("forwardSlash()", Token.forwardSlash, TokenType.ForwardSlash, "/");

            constantTokenTest("leftAngleBracket()", Token.leftAngleBracket, TokenType.LeftAngleBracket, "<");

            constantTokenTest("rightAngleBracket()", Token.rightAngleBracket, TokenType.RightAngleBracket, ">");

            constantTokenTest("verticalBar()", Token.verticalBar, TokenType.VerticalBar, "|");

            constantTokenTest("dollarSign()", Token.dollarSign, TokenType.DollarSign, "$");

            constantTokenTest("caret()", Token.caret, TokenType.Caret, "^");

            constantTokenTest("atSign()", Token.atSign, TokenType.AtSign, "@");

            constantTokenTest("tilde()", Token.tilde, TokenType.Tilde, "~");

            constantTokenTest("backtick()", Token.backtick, TokenType.Backtick, "`");

            constantTokenTest("singleQuote()", Token.singleQuote, TokenType.SingleQuote, "'");

            constantTokenTest("doubleQuote()", Token.doubleQuote, TokenType.DoubleQuote, "\"");

            textTokenTests("unknown(string)", Token.unknown, TokenType.Unknown);
        });
    });
}
test(createTestRunner());