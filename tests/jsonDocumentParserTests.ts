import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { DocumentIssue, DocumentPosition, DocumentRange, isUndefinedOrNull, Iterable, Iterator, JsonDocumentBoolean, JsonDocumentNull, JsonDocumentNumber, JsonDocumentParser, JsonDocumentString, List, PreConditionError, Token, Tokenizer } from "../sources";
import { createTestRunner } from "./tests";
import { JsonDocumentSegment } from "../sources/jsonDocumentSegment";
import { JsonDocumentWhitespace } from "../sources/jsonDocumentWhitespace";
import { JsonDocumentUnknown } from "../sources/JsonDocumentUnknown";

export function test(runner: TestRunner): void
{
    runner.testFile("jsonDocumentParser.ts", () =>
    {
        runner.testType(JsonDocumentParser.name, () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const parser: JsonDocumentParser = JsonDocumentParser.create();
                test.assertNotUndefinedAndNotNull(parser);
            });

            runner.testFunction("parseSegment(string|Iterator<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseSegmentErrorTest(text: string | Iterator<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        test.assertThrows(() => parser.parseSegment(text, onIssue), expected);
                    });
                }

                parseSegmentErrorTest(undefined!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                parseSegmentErrorTest(null!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function parseSegmentTest(text: string | Iterator<string> | Tokenizer, expectedSegment: JsonDocumentSegment | undefined, expectedIssues?: DocumentIssue | Iterable<DocumentIssue>): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const segment: JsonDocumentSegment | undefined = parser.parseSegment(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedSegment, segment);
                        if (isUndefinedOrNull(expectedIssues))
                        {
                            expectedIssues = Iterable.create();
                        }
                        else if (expectedIssues instanceof DocumentIssue)
                        {
                            expectedIssues = Iterable.create([expectedIssues]);
                        }
                        test.assertEqual(expectedIssues, issues);
                    });
                }

                parseSegmentTest(
                    "",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create(
                            DocumentPosition.create(0, 0, 0),
                        ),
                        "Missing JSON segment.",
                    ),
                );
                parseSegmentTest(
                    "   ",
                    JsonDocumentWhitespace.create(Iterable.create([Token.whitespace("   ")])),
                );
                parseSegmentTest(
                    "*",
                    JsonDocumentUnknown.create(Token.asterisk()),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 1,
                                columnIndex: 1,
                            }),
                        }),
                        "Expected JSON segment, but found \"*\" instead.",
                    ),
                );
                parseSegmentTest(
                    "flubber",
                    JsonDocumentUnknown.create(Token.letters("flubber")),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 7,
                                columnIndex: 7,
                            }),
                        }),
                        "Expected JSON segment, but found \"flubber\" instead.",
                    ),
                );
                parseSegmentTest(
                    "a b",
                    JsonDocumentUnknown.create(Token.letters("a")),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 1,
                                columnIndex: 1,
                            }),
                        }),
                        "Expected JSON segment, but found \"a\" instead.",
                    ),
                );
                parseSegmentTest(
                    "true",
                    JsonDocumentBoolean.create(Token.letters("true")),
                );
                parseSegmentTest(
                    "TRUE",
                    JsonDocumentBoolean.create(Token.letters("TRUE")),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 4,
                                columnIndex: 4,
                            }),
                        }),
                        `Expected "true", but found "TRUE" instead.`,
                    ),
                );
                parseSegmentTest(
                    `"abc"`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("abc"),
                            Token.doubleQuote(),
                        ]),
                        true,
                    ),
                );
                parseSegmentTest(
                    `'abc'`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.singleQuote(),
                            Token.letters("abc"),
                            Token.singleQuote(),
                        ]),
                        true,
                    ),
                );
                parseSegmentTest(
                    "`abc`",
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.backtick(),
                            Token.letters("abc"),
                            Token.backtick(),
                        ]),
                        true,
                    ),
                );
                parseSegmentTest(
                    "123",
                    JsonDocumentNumber.create(Iterable.create([Token.digits("123")])),
                );
            });

            runner.testFunction("parseWhitespace(string|Iterator<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseWhitespaceErrorTest(text: string | Iterator<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        test.assertThrows(() => parser.parseWhitespace(text, onIssue), expected);
                    });
                }

                parseWhitespaceErrorTest(undefined!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                parseWhitespaceErrorTest(null!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function parseWhitespaceTest(text: string | Iterator<string> | Tokenizer, expectedSegment: JsonDocumentSegment | undefined, expectedIssue?: DocumentIssue): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const segment: JsonDocumentSegment | undefined = parser.parseWhitespace(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedSegment, segment);
                        if (isUndefinedOrNull(expectedIssue))
                        {
                            test.assertEqual(Iterable.create<DocumentIssue>(), issues);
                        }
                        else
                        {
                            test.assertEqual(Iterable.create([expectedIssue]), issues);
                        }
                    });
                }

                parseWhitespaceTest(
                    "",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create(
                            DocumentPosition.create(0, 0, 0),
                        ),
                        "Missing whitespace.",
                    ),
                );
                parseWhitespaceTest(
                    "   ",
                    JsonDocumentWhitespace.create(Iterable.create([Token.whitespace("   ")])),
                );
                parseWhitespaceTest(
                    "\n",
                    JsonDocumentWhitespace.create(Iterable.create([Token.newLine()])),
                );
                parseWhitespaceTest(
                    "\r",
                    JsonDocumentWhitespace.create(Iterable.create([Token.carriageReturn()])),
                );
                parseWhitespaceTest(
                    "\r\n \r\n",
                    JsonDocumentWhitespace.create(Iterable.create([
                        Token.carriageReturn(),
                        Token.newLine(),
                        Token.whitespace(" "),
                        Token.carriageReturn(),
                        Token.newLine(),
                    ])),
                );
                parseWhitespaceTest(
                    "flubber",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 7,
                                columnIndex: 7,
                            }),
                        }),
                        "Expected whitespace, but found \"flubber\" instead.",
                    ),
                );
            });

            runner.testFunction("parseNullOrBoolean(string|Iterator<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseNullOrBooleanErrorTest(text: string | Iterator<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        test.assertThrows(() => parser.parseNullOrBoolean(text, onIssue), expected);
                    });
                }

                parseNullOrBooleanErrorTest(undefined!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                parseNullOrBooleanErrorTest(null!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function parseNullOrBooleanTest(text: string | Iterator<string> | Tokenizer, expectedSegment: JsonDocumentSegment | undefined, expectedIssue?: DocumentIssue): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const segment: JsonDocumentSegment | undefined = parser.parseNullOrBoolean(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedSegment, segment);
                        if (isUndefinedOrNull(expectedIssue))
                        {
                            test.assertEqual(Iterable.create<DocumentIssue>(), issues);
                        }
                        else
                        {
                            test.assertEqual(Iterable.create([expectedIssue]), issues);
                        }
                    });
                }

                parseNullOrBooleanTest(
                    "",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                        }),
                        "Missing JSON null or boolean.",
                    ),
                );
                parseNullOrBooleanTest(
                    "   ",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 3,
                                columnIndex: 3,
                            })
                        }),
                        "Expected JSON null or boolean, but found \"   \" instead.",
                    ),
                );
                parseNullOrBooleanTest(
                    "flubber",
                    JsonDocumentUnknown.create(Token.letters("flubber")),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 7,
                                columnIndex: 7,
                            })
                        }),
                        "Expected JSON null or boolean, but found \"flubber\" instead.",
                    ),
                );
                parseNullOrBooleanTest(
                    "*",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 1,
                                columnIndex: 1,
                            })
                        }),
                        "Expected JSON null or boolean, but found \"*\" instead.",
                    ),
                );
                parseNullOrBooleanTest(
                    "null",
                    JsonDocumentNull.create(Token.letters("null")),
                );
                parseNullOrBooleanTest(
                    "NuLL",
                    JsonDocumentNull.create(Token.letters("NuLL")),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 4,
                                columnIndex: 4,
                            })
                        }),
                        `Expected "null", but found "NuLL" instead.`,
                    ),
                );
                parseNullOrBooleanTest(
                    "false",
                    JsonDocumentBoolean.create(Token.letters("false")),
                );
                parseNullOrBooleanTest(
                    "FalsE",
                    JsonDocumentBoolean.create(Token.letters("FalsE")),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 5,
                                columnIndex: 5,
                            })
                        }),
                        `Expected "false", but found "FalsE" instead.`,
                    ),
                );
                parseNullOrBooleanTest(
                    "true",
                    JsonDocumentBoolean.create(Token.letters("true")),
                );
                parseNullOrBooleanTest(
                    "TRue",
                    JsonDocumentBoolean.create(Token.letters("TRue")),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 4,
                                columnIndex: 4,
                            })
                        }),
                        `Expected "true", but found "TRue" instead.`,
                    ),
                );
            });

            runner.testFunction("parseString(string|Iterator<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseStringErrorTest(text: string | Iterator<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        test.assertThrows(() => parser.parseString(text, onIssue), expected);
                    });
                }

                parseStringErrorTest(undefined!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                parseStringErrorTest(null!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function parseStringTest(text: string | Iterator<string> | Tokenizer, expectedSegment: JsonDocumentSegment | undefined, expectedIssues?: DocumentIssue | Iterable<DocumentIssue>): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const segment: JsonDocumentSegment | undefined = parser.parseString(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedSegment, segment);
                        if (isUndefinedOrNull(expectedIssues))
                        {
                            expectedIssues = Iterable.create();
                        }
                        else if (expectedIssues instanceof DocumentIssue)
                        {
                            expectedIssues = Iterable.create([expectedIssues]);
                        }
                        test.assertEqual(expectedIssues, issues);
                    });
                }

                parseStringTest(
                    "",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                        }),
                        "Missing JSON string.",
                    ),
                );
                parseStringTest(
                    "   ",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 3,
                                columnIndex: 3,
                            })
                        }),
                        "Expected JSON string, but found \"   \" instead.",
                    ),
                );
                parseStringTest(
                    "flubber",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 7,
                                columnIndex: 7,
                            })
                        }),
                        "Expected JSON string, but found \"flubber\" instead.",
                    ),
                );
                parseStringTest(
                    "*",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 1,
                                columnIndex: 1,
                            })
                        }),
                        "Expected JSON string, but found \"*\" instead.",
                    ),
                );
                parseStringTest(
                    `"`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.doubleQuote(),
                        ]),
                        false,
                    ),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 1,
                                columnIndex: 1,
                            }),
                        }),
                        "Missing JSON string end quote (\").",
                    ),
                );
                parseStringTest(
                    `'`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.singleQuote(),
                        ]),
                        false,
                    ),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 1,
                                columnIndex: 1,
                            }),
                        }),
                        "Missing JSON string end quote (\').",
                    ),
                );
                parseStringTest(
                    `\``,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.backtick(),
                        ]),
                        false,
                    ),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 1,
                                columnIndex: 1,
                            }),
                        }),
                        "Missing JSON string end quote (\`).",
                    ),
                );
                parseStringTest(
                    `"hello`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("hello"),
                        ]),
                        false,
                    ),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 6,
                                columnIndex: 6,
                            }),
                        }),
                        "Missing JSON string end quote (\").",
                    ),
                );
                parseStringTest(
                    `"\n`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.doubleQuote(),
                        ]),
                        false,
                    ),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 1,
                                columnIndex: 1,
                            }),
                        }),
                        "JSON strings cannot contain newlines.",
                    ),
                );
                parseStringTest(
                    `"\\`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.doubleQuote(),
                            Token.backslash(),
                        ]),
                        false,
                    ),
                    Iterable.create([
                        DocumentIssue.create(
                            DocumentRange.create({
                                start: DocumentPosition.create({
                                    characterIndex: 1,
                                    columnIndex: 1,
                                }),
                                afterEndOrColumns: 1,
                            }),
                            "Incomplete escape sequence.",
                        ),
                        DocumentIssue.create(
                            DocumentRange.create({
                                start: DocumentPosition.create({
                                    characterIndex: 0,
                                    columnIndex: 0,
                                }),
                                afterEndOrColumns: 2,
                            }),
                            "Missing JSON string end quote (\").",
                        ),
                    ]),
                );
                parseStringTest(
                    `"\\n`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.doubleQuote(),
                            Token.backslash(),
                            Token.letters("n"),
                        ]),
                        false,
                    ),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: 3,
                        }),
                        "Missing JSON string end quote (\").",
                    ),
                );
                parseStringTest(
                    `"\\\\`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.doubleQuote(),
                            Token.backslash(),
                            Token.backslash(),
                        ]),
                        false,
                    ),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: 3,
                        }),
                        "Missing JSON string end quote (\").",
                    ),
                );
                parseStringTest(
                    `""`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.doubleQuote(),
                            Token.doubleQuote(),
                        ]),
                        true,
                    ),
                );
                parseStringTest(
                    `''`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.singleQuote(),
                            Token.singleQuote(),
                        ]),
                        true,
                    ),
                );
                parseStringTest(
                    `\`\``,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.backtick(),
                            Token.backtick(),
                        ]),
                        true,
                    ),
                );
                parseStringTest(
                    `"\\""`,
                    JsonDocumentString.create(
                        Iterable.create([
                            Token.doubleQuote(),
                            Token.backslash(),
                            Token.doubleQuote(),
                            Token.doubleQuote(),
                        ]),
                        true,
                    ),
                );
            });

            runner.testFunction("parseNumber(string|Iterator<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseNumberErrorTest(text: string | Iterator<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        test.assertThrows(() => parser.parseNumber(text, onIssue), expected);
                    });
                }

                parseNumberErrorTest(undefined!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                parseNumberErrorTest(null!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function parseNumberTest(text: string | Iterator<string> | Tokenizer, expectedSegment: JsonDocumentSegment | undefined, expectedIssues?: DocumentIssue | Iterable<DocumentIssue>, expectedValue?: number): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const segment: JsonDocumentSegment | undefined = parser.parseNumber(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedSegment, segment);

                        if (isUndefinedOrNull(expectedIssues))
                        {
                            expectedIssues = Iterable.create();
                        }
                        else if (expectedIssues instanceof DocumentIssue)
                        {
                            expectedIssues = Iterable.create([expectedIssues]);
                        }
                        test.assertEqual(expectedIssues, issues);

                        test.assertEqual(expectedSegment instanceof JsonDocumentNumber, !isUndefinedOrNull(expectedValue));
                        if (!isUndefinedOrNull(expectedValue))
                        {
                            test.assertEqual(expectedValue, (expectedSegment as JsonDocumentNumber).getValue());
                        }
                    });
                }

                parseNumberTest(
                    "",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                        }),
                        "Missing JSON number.",
                    ),
                );
                parseNumberTest(
                    "   ",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 3,
                                columnIndex: 3,
                            })
                        }),
                        "Expected integer digits, but found \"   \" instead.",
                    ),
                );
                parseNumberTest(
                    "flubber",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 7,
                                columnIndex: 7,
                            })
                        }),
                        "Expected integer digits, but found \"flubber\" instead.",
                    ),
                );
                parseNumberTest(
                    "*",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: DocumentPosition.create({
                                characterIndex: 1,
                                columnIndex: 1,
                            })
                        }),
                        "Expected integer digits, but found \"*\" instead.",
                    ),
                );
                parseNumberTest(
                    "-",
                    JsonDocumentUnknown.create(Token.hyphen()),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: 1,
                        }),
                        "Missing JSON number.",
                    ),
                );
                parseNumberTest(
                    "5",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.digits("5"),
                    ])),
                    undefined,
                    5,
                );
                parseNumberTest(
                    "475",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.digits("475"),
                    ])),
                    undefined,
                    475,
                );
                parseNumberTest(
                    "-8",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.hyphen(),
                        Token.digits("8"),
                    ])),
                    undefined,
                    -8,
                );
                parseNumberTest(
                    "1.",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.digits("1"),
                        Token.period(),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 2,
                                columnIndex: 2,
                            }),
                        }),
                        "Missing fractional digits.",
                    ),
                    1,
                );
                parseNumberTest(
                    ".1",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.period(),
                        Token.digits("1"),
                    ])),
                    Iterable.create([
                        DocumentIssue.create(
                            DocumentRange.create({
                                start: DocumentPosition.create({
                                    characterIndex: 0,
                                    columnIndex: 0,
                                }),
                                afterEndOrColumns: 1,
                            }),
                            "Expected integer digits, but found \".\" instead.",
                        ),
                    ]),
                    0.1,
                );
                parseNumberTest(
                    "-.",
                    JsonDocumentUnknown.create(Iterable.create([
                        Token.hyphen(),
                        Token.period(),
                    ])),
                    Iterable.create([
                        DocumentIssue.create(
                            DocumentRange.create({
                                start: DocumentPosition.create({
                                    characterIndex: 1,
                                    columnIndex: 1,
                                }),
                                afterEndOrColumns: 1,
                            }),
                            "Expected integer digits, but found \".\" instead.",
                        ),
                        DocumentIssue.create(
                            DocumentRange.create({
                                start: DocumentPosition.create({
                                    characterIndex: 2,
                                    columnIndex: 2,
                                }),
                            }),
                            "Missing fractional digits.",
                        ),
                    ]),
                );
                parseNumberTest(
                    "-.1",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.hyphen(),
                        Token.period(),
                        Token.digits("1"),
                    ])),
                    Iterable.create([
                        DocumentIssue.create(
                            DocumentRange.create({
                                start: DocumentPosition.create({
                                    characterIndex: 1,
                                    columnIndex: 1,
                                }),
                                afterEndOrColumns: 1,
                            }),
                            "Expected integer digits, but found \".\" instead.",
                        ),
                    ]),
                    -0.1,
                );
                parseNumberTest(
                    "1.0",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.digits("1"),
                        Token.period(),
                        Token.digits("0"),
                    ])),
                    undefined,
                    1,
                );
                parseNumberTest(
                    "1.23",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.digits("1"),
                        Token.period(),
                        Token.digits("23"),
                    ])),
                    undefined,
                    1.23,
                );
                parseNumberTest(
                    "1e5",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.digits("1"),
                        Token.letters("e"),
                        Token.digits("5"),
                    ])),
                    undefined,
                    1e5,
                );
                parseNumberTest(
                    "1.2e3",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.digits("1"),
                        Token.period(),
                        Token.digits("2"),
                        Token.letters("e"),
                        Token.digits("3"),
                    ])),
                    undefined,
                    1.2e3,
                );
                parseNumberTest(
                    "1.2E+3",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.digits("1"),
                        Token.period(),
                        Token.digits("2"),
                        Token.letters("E"),
                        Token.plusSign(),
                        Token.digits("3"),
                    ])),
                    undefined,
                    1.2e3,
                );
                parseNumberTest(
                    "1.2E-3",
                    JsonDocumentNumber.create(Iterable.create([
                        Token.digits("1"),
                        Token.period(),
                        Token.digits("2"),
                        Token.letters("E"),
                        Token.hyphen(),
                        Token.digits("3"),
                    ])),
                    undefined,
                    1.2e-3,
                );
            });
        });
    });
}
test(createTestRunner());