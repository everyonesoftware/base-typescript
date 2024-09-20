import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { JsonToken, JsonTokenType, PreConditionError } from "../sources";
import { createTestRunner } from "./tests";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonToken.ts", () =>
    {
        runner.testType(JsonToken.name, () =>
        {
            runner.testFunction("leftCurlyBrace()", (test: Test) =>
            {
                const token: JsonToken = JsonToken.leftCurlyBrace();
                test.assertSame(token.getText(), "{");
                test.assertSame(token.toString(), "{");
                test.assertSame(token.getTokenType(), JsonTokenType.LeftCurlyBrace);
                test.assertSame(token, JsonToken.leftCurlyBrace());
            });

            runner.testFunction("rightCurlyBrace()", (test: Test) =>
            {
                const token: JsonToken = JsonToken.rightCurlyBrace();
                test.assertSame(token.getText(), "}");
                test.assertSame(token.toString(), "}");
                test.assertSame(token.getTokenType(), JsonTokenType.RightCurlyBrace);
                test.assertSame(token, JsonToken.rightCurlyBrace());
            });

            runner.testFunction("leftSquareBracket()", (test: Test) =>
            {
                const token: JsonToken = JsonToken.leftSquareBracket();
                test.assertSame(token.getText(), "[");
                test.assertSame(token.toString(), "[");
                test.assertSame(token.getTokenType(), JsonTokenType.LeftSquareBracket);
                test.assertSame(token, JsonToken.leftSquareBracket());
            });

            runner.testFunction("rightSquareBracket()", (test: Test) =>
            {
                const token: JsonToken = JsonToken.rightSquareBracket();
                test.assertSame(token.getText(), "]");
                test.assertSame(token.toString(), "]");
                test.assertSame(token.getTokenType(), JsonTokenType.RightSquareBracket);
                test.assertSame(token, JsonToken.rightSquareBracket());
            });

            runner.testFunction("whitespace(string)", () =>
            {
                function whitespaceErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonToken.whitespace(text), expected);
                    });
                }

                whitespaceErrorTest(undefined!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                whitespaceErrorTest(null!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                whitespaceErrorTest("", new PreConditionError(
                    "Expression: text",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));

                function whitespaceTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const token: JsonToken = JsonToken.whitespace(text);
                        test.assertNotUndefinedAndNotNull(token);
                        test.assertSame(token.getTokenType(), JsonTokenType.Whitespace);
                        test.assertSame(token.getText(), text);
                        test.assertSame(token.toString(), text);
                        test.assertNotSame(token, JsonToken.whitespace(text));
                    });
                }

                whitespaceTest(" ");
                whitespaceTest("\t");
                whitespaceTest("\n");
                whitespaceTest("abc");
            });

            runner.testFunction("string(string)", () =>
            {
                function stringErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonToken.string(text), expected);
                    });
                }

                stringErrorTest(undefined!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                stringErrorTest(null!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                stringErrorTest("", new PreConditionError(
                    "Expression: text",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));
                stringErrorTest("abc", new PreConditionError(
                    "Expression: text[0]",
                    "Expected: one of \',\"",
                    "Actual: a",
                ));

                function stringTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const token: JsonToken = JsonToken.string(text);
                        test.assertNotUndefinedAndNotNull(token);
                        test.assertSame(token.getTokenType(), JsonTokenType.String);
                        test.assertSame(token.getText(), text);
                        test.assertNotSame(token, JsonToken.string(text));
                    });
                }

                stringTest(`'`);
                stringTest(`''`);
                stringTest(`"`);
                stringTest(`""`);
                stringTest(`"abc`);
                stringTest(`"abc"`);
            });

            runner.testFunction("comma()", (test: Test) =>
            {
                const token: JsonToken = JsonToken.comma();
                test.assertSame(token.getText(), ",");
                test.assertSame(token.toString(), ",");
                test.assertSame(token.getTokenType(), JsonTokenType.Comma);
                test.assertSame(token, JsonToken.comma());
            });

            runner.testFunction("colon()", (test: Test) =>
            {
                const token: JsonToken = JsonToken.colon();
                test.assertSame(token.getText(), ":");
                test.assertSame(token.toString(), ":");
                test.assertSame(token.getTokenType(), JsonTokenType.Colon);
                test.assertSame(token, JsonToken.colon());
            });

            runner.testFunction("number(string)", () =>
            {
                function numberErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonToken.number(text), expected);
                    });
                }

                numberErrorTest(undefined!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                numberErrorTest(null!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                numberErrorTest("", new PreConditionError(
                    "Expression: text",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));

                function numberTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const token: JsonToken = JsonToken.number(text);
                        test.assertNotUndefinedAndNotNull(token);
                        test.assertSame(token.getTokenType(), JsonTokenType.Number);
                        test.assertSame(token.getText(), text);
                        test.assertSame(token.toString(), text);
                        test.assertNotSame(token, JsonToken.number(text));
                    });
                }

                numberTest(`0`);
                numberTest(`0.`);
                numberTest(`123`);
                numberTest(`.5`);
                numberTest(`abc`);
            });

            runner.testFunction("false(string)", () =>
            {
                function falseErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonToken.boolean(text), expected);
                    });
                }

                falseErrorTest(undefined!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                falseErrorTest(null!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                falseErrorTest("", new PreConditionError(
                    "Expression: text",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));

                function booleanTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const token: JsonToken = JsonToken.boolean(text);
                        test.assertNotUndefinedAndNotNull(token);
                        test.assertSame(token.getTokenType(), JsonTokenType.Boolean);
                        test.assertSame(token.getText(), text);
                        test.assertSame(token.toString(), text);
                        test.assertNotSame(token, JsonToken.boolean(text));
                    });
                }

                booleanTest(`0`);
                booleanTest(`0.`);
                booleanTest(`123`);
                booleanTest(`.5`);
                booleanTest(`abc`);
            });

            runner.testFunction("null(string)", () =>
            {
                function nullErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonToken.null(text), expected);
                    });
                }

                nullErrorTest(undefined!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                nullErrorTest(null!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                nullErrorTest("", new PreConditionError(
                    "Expression: text",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));

                function nullTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const token: JsonToken = JsonToken.null(text);
                        test.assertNotUndefinedAndNotNull(token);
                        test.assertSame(token.getTokenType(), JsonTokenType.Null);
                        test.assertSame(token.getText(), text);
                        test.assertSame(token.toString(), text);
                        test.assertNotSame(token, JsonToken.null(text));
                    });
                }

                nullTest(`null`);
                nullTest(`NULL`);
                nullTest(`false`);
                nullTest(`.5`);
                nullTest(`abc`);
            });

            runner.testFunction("unknown(string)", () =>
            {
                function unknownErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => JsonToken.unknown(text), expected);
                    });
                }

                unknownErrorTest(undefined!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                unknownErrorTest(null!, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
                unknownErrorTest("", new PreConditionError(
                    "Expression: text",
                    "Expected: not empty",
                    "Actual: \"\"",
                ));

                function unknownTest(text: string): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const token: JsonToken = JsonToken.unknown(text);
                        test.assertNotUndefinedAndNotNull(token);
                        test.assertSame(token.getTokenType(), JsonTokenType.Unknown);
                        test.assertSame(token.getText(), text);
                        test.assertSame(token.toString(), text);
                        test.assertNotSame(token, JsonToken.unknown(text));
                    });
                }

                unknownTest(`*`);
                unknownTest(`&`);
                unknownTest(`oops`);
            });
        });
    });
}
test(createTestRunner());
