import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { createTestRunner } from "./tests";
import { PreConditionError, Token, TokenCreator, TokenType } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("tokenCreator.ts", () =>
    {
        runner.testType(TokenCreator.name, () =>
        {
            runner.testFunction("get(TokenType,string)", () =>
            {
                function getErrorTest(type: TokenType, text: string, expected: Error): void
                {
                    runner.test(`with ${runner.andList([type, text])}`, (test: Test) =>
                    {
                        const creator: TokenCreator = TokenCreator.create();
                        test.assertThrows(() => creator.get(type, text), expected);
                    });
                }

                getErrorTest(undefined!, "oops", new PreConditionError(
                    "Expression: type",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getErrorTest(null!, "oops", new PreConditionError(
                    "Expression: type",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getErrorTest(TokenType.Period, undefined!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                getErrorTest(TokenType.Period, null!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                getErrorTest(TokenType.Period, "", new PreConditionError(
                    "Expression: text",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));

                function getTest(type: TokenType, text: string): void
                {
                    runner.test(`with ${runner.andList([type, text])}`, (test: Test) =>
                    {
                        const creator: TokenCreator = TokenCreator.create();
                        const token: Token = creator.get(type, text);
                        test.assertNotUndefinedAndNotNull(token);
                        test.assertSame(type, token.getType());
                        test.assertSame(text, token.getText());
                        test.assertSame(text, token.toString());
                        test.assertSame(token, creator.get(type, text));
                    });
                }

                getTest(TokenType.Ampersand, "&");
                getTest(TokenType.Ampersand, "oops");
                getTest(TokenType.Digits, "50");
                getTest(TokenType.Digits, "abc");
            });

            function constantTokenTest(signature: string, method: (creator: TokenCreator) => Token, expectedType: TokenType, expectedText: string): void
            {
                runner.testFunction(signature, (test: Test) =>
                {
                    const creator: TokenCreator = TokenCreator.create();
                    const token: Token = method(creator);
                    test.assertNotUndefinedAndNotNull(token);
                    test.assertSame(expectedType, token.getType());
                    test.assertEqual(expectedText, token.getText());
                    test.assertEqual(expectedText, token.toString());
                    test.assertSame(token, method(creator));
                });
            }

            function textTokenTests(signature: string, method: (creator: TokenCreator, text: string) => Token, expectedType: TokenType): void
            {
                runner.testFunction(signature, () =>
                {
                    function errorTest(text: string, expected: Error): void
                    {
                        runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                        {
                            const creator: TokenCreator = TokenCreator.create();
                            test.assertThrows(() => method(creator, text), expected);
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
                            const creator: TokenCreator = TokenCreator.create();
                            const token: Token = method(creator, text);
                            test.assertNotUndefinedAndNotNull(token);
                            test.assertSame(expectedType, token.getType());
                            test.assertSame(text, token.getText());
                            test.assertSame(text, token.toString());
                            test.assertSame(token, method(creator, text));
                        });
                    }

                    successfulTest(" ");
                    successfulTest("\t");
                    successfulTest("abc");
                });
            }

            textTokenTests("whitespace(string)", (creator: TokenCreator, text: string) => creator.whitespace(text), TokenType.Whitespace);

            constantTokenTest("carriageReturn()", (creator: TokenCreator) => creator.carriageReturn(), TokenType.CarriageReturn, "\r");

            constantTokenTest("newLine()", (creator: TokenCreator) => creator.newLine(), TokenType.NewLine, "\n");

            textTokenTests("letters(string)", (creator: TokenCreator, text: string) => creator.letters(text), TokenType.Letters);

            textTokenTests("digits(string)", (creator: TokenCreator, text: string) => creator.digits(text), TokenType.Digits);

            constantTokenTest("period()", (creator: TokenCreator) => creator.period(), TokenType.Period, ".");
            
            constantTokenTest("comma()", (creator: TokenCreator) => creator.comma(), TokenType.Comma, ",");

            constantTokenTest("colon()", (creator: TokenCreator) => creator.colon(), TokenType.Colon, ":");

            constantTokenTest("semicolon()", (creator: TokenCreator) => creator.semicolon(), TokenType.Semicolon, ";");

            constantTokenTest("exclamationPoint()", (creator: TokenCreator) => creator.exclamationPoint(), TokenType.ExclamationPoint, "!");
            
            constantTokenTest("questionMark()", (creator: TokenCreator) => creator.questionMark(), TokenType.QuestionMark, "?");
            
            constantTokenTest("leftCurlyBracket()", (creator: TokenCreator) => creator.leftCurlyBracket(), TokenType.LeftCurlyBracket, "{");

            constantTokenTest("rightCurlyBracket()", (creator: TokenCreator) => creator.rightCurlyBracket(), TokenType.RightCurlyBracket, "}");

            constantTokenTest("leftSquareBrace()", (creator: TokenCreator) => creator.leftSquareBrace(), TokenType.LeftSquareBrace, "[");

            constantTokenTest("rightSquareBrace()", (creator: TokenCreator) => creator.rightSquareBrace(), TokenType.RightSquareBrace, "]");

            constantTokenTest("leftParenthesis()", (creator: TokenCreator) => creator.leftParenthesis(), TokenType.LeftParenthesis, "(");

            constantTokenTest("rightParenthesis()", (creator: TokenCreator) => creator.rightParenthesis(), TokenType.RightParenthesis, ")");

            constantTokenTest("hyphen()", (creator: TokenCreator) => creator.hyphen(), TokenType.Hyphen, "-");

            constantTokenTest("underscore()", (creator: TokenCreator) => creator.underscore(), TokenType.Underscore, "_");

            constantTokenTest("equalsSign()", (creator: TokenCreator) => creator.equalsSign(), TokenType.EqualsSign, "=");

            constantTokenTest("plusSign()", (creator: TokenCreator) => creator.plusSign(), TokenType.PlusSign, "+");

            constantTokenTest("asterisk()", (creator: TokenCreator) => creator.asterisk(), TokenType.Asterisk, "*");

            constantTokenTest("percentSign()", (creator: TokenCreator) => creator.percentSign(), TokenType.PercentSign, "%");

            constantTokenTest("ampersand()", (creator: TokenCreator) => creator.ampersand(), TokenType.Ampersand, "&");

            constantTokenTest("poundSign()", (creator: TokenCreator) => creator.poundSign(), TokenType.PoundSign, "#");

            constantTokenTest("backslash()", (creator: TokenCreator) => creator.backslash(), TokenType.Backslash, "\\");

            constantTokenTest("forwardSlash()", (creator: TokenCreator) => creator.forwardSlash(), TokenType.ForwardSlash, "/");

            constantTokenTest("leftAngleBracket()", (creator: TokenCreator) => creator.leftAngleBracket(), TokenType.LeftAngleBracket, "<");

            constantTokenTest("rightAngleBracket()", (creator: TokenCreator) => creator.rightAngleBracket(), TokenType.RightAngleBracket, ">");

            constantTokenTest("verticalBar()", (creator: TokenCreator) => creator.verticalBar(), TokenType.VerticalBar, "|");

            constantTokenTest("dollarSign()", (creator: TokenCreator) => creator.dollarSign(), TokenType.DollarSign, "$");

            constantTokenTest("caret()", (creator: TokenCreator) => creator.caret(), TokenType.Caret, "^");

            constantTokenTest("atSign()", (creator: TokenCreator) => creator.atSign(), TokenType.AtSign, "@");

            constantTokenTest("tilde()", (creator: TokenCreator) => creator.tilde(), TokenType.Tilde, "~");

            constantTokenTest("backtick()", (creator: TokenCreator) => creator.backtick(), TokenType.Backtick, "`");

            constantTokenTest("singleQuote()", (creator: TokenCreator) => creator.singleQuote(), TokenType.SingleQuote, "'");

            constantTokenTest("doubleQuote()", (creator: TokenCreator) => creator.doubleQuote(), TokenType.DoubleQuote, "\"");

            textTokenTests("unknown(string)", (creator: TokenCreator, text: string) => creator.unknown(text), TokenType.Unknown);
        });
    });
}
test(createTestRunner());