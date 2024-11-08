import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { DocumentIssue, DocumentPosition, DocumentRange, isUndefinedOrNull, Iterable, JavascriptIterable, JsonDocumentArray, JsonDocumentBoolean, JsonDocumentNull, JsonDocumentNumber, JsonDocumentParser, JsonDocumentString, List, PreConditionError, Token, Tokenizer } from "../sources";
import { createTestRunner } from "./tests";
import { JsonDocumentValue as JsonDocumentValue } from "../sources/jsonDocumentValue";
import { JsonDocumentUnknown } from "../sources/jsonDocumentUnknown";
import { JsonDocumentProperty } from "../sources/jsonDocumentProperty";
import { JsonDocumentObject } from "../sources/jsonDocumentObject";

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

            runner.testFunction("parseValue(string|JavascriptIterable<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseValueErrorTest(text: string | JavascriptIterable<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        test.assertThrows(() => parser.parseValue(text, onIssue), expected);
                    });
                }

                parseValueErrorTest(undefined!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                parseValueErrorTest(null!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function parseValueTest(text: string | JavascriptIterable<string> | Tokenizer, expectedValue: JsonDocumentValue | undefined, expectedIssues?: DocumentIssue | Iterable<DocumentIssue>): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const value: JsonDocumentValue | undefined = parser.parseValue(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedValue, value);
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

                parseValueTest(
                    "",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create(
                            DocumentPosition.create(0, 0, 0),
                        ),
                        "Missing JSON value.",
                    ),
                );
                parseValueTest(
                    "   ",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create(
                            DocumentPosition.create(0, 0, 0),
                            DocumentPosition.create(3, 0, 3),
                        ),
                        "Expected JSON value, but found \"   \" instead.",
                    ),
                );
                parseValueTest(
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
                            }),
                        }),
                        "Expected JSON value, but found \"*\" instead.",
                    ),
                );
                parseValueTest(
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
                        "Expected JSON value, but found \"flubber\" instead.",
                    ),
                );
                parseValueTest(
                    "a b",
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
                            }),
                        }),
                        "Expected JSON value, but found \"a\" instead.",
                    ),
                );
                parseValueTest(
                    "true",
                    JsonDocumentBoolean.create(Token.letters("true")),
                );
                parseValueTest(
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
                parseValueTest(
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
                parseValueTest(
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
                parseValueTest(
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
                parseValueTest(
                    "123",
                    JsonDocumentNumber.create(Iterable.create([Token.digits("123")])),
                );
            });

            runner.testFunction("parseNullOrBoolean(string|JavascriptIterable<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseNullOrBooleanErrorTest(text: string | JavascriptIterable<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
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

                function parseNullOrBooleanTest(text: string | JavascriptIterable<string> | Tokenizer, expectedValue: JsonDocumentValue | undefined, expectedIssue?: DocumentIssue): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const value: JsonDocumentValue | undefined = parser.parseNullOrBoolean(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedValue, value);
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

            runner.testFunction("parseString(string|JavascriptIterable<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseStringErrorTest(text: string | JavascriptIterable<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
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

                function parseStringTest(text: string | JavascriptIterable<string> | Tokenizer, expectedValue: JsonDocumentValue | undefined, expectedIssues?: DocumentIssue | Iterable<DocumentIssue>): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const value: JsonDocumentValue | undefined = parser.parseString(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedValue, value);
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

            runner.testFunction("parseNumber(string|JavascriptIterable<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseNumberErrorTest(text: string | JavascriptIterable<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
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

                function parseNumberTest(text: string | JavascriptIterable<string> | Tokenizer, expectedValue: JsonDocumentValue | undefined, expectedIssues?: DocumentIssue | Iterable<DocumentIssue>, expectedNumberValue?: number): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const value: JsonDocumentValue | undefined = parser.parseNumber(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedValue, value);

                        if (isUndefinedOrNull(expectedIssues))
                        {
                            expectedIssues = Iterable.create();
                        }
                        else if (expectedIssues instanceof DocumentIssue)
                        {
                            expectedIssues = Iterable.create([expectedIssues]);
                        }
                        test.assertEqual(expectedIssues, issues);

                        test.assertEqual(expectedValue, value);
                        if (!isUndefinedOrNull(expectedNumberValue))
                        {
                            test.assertInstanceOf(value, JsonDocumentNumber);
                            test.assertEqual(expectedNumberValue, value.getValue());
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

            runner.testFunction("parseArray(string|JavascriptIterable<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseArrayErrorTest(text: string | JavascriptIterable<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        test.assertThrows(() => parser.parseArray(text, onIssue), expected);
                    });
                }

                parseArrayErrorTest(undefined!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                parseArrayErrorTest(null!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function parseArrayTest(text: string | JavascriptIterable<string> | Tokenizer, expectedValue: JsonDocumentArray | undefined, expectedIssues?: DocumentIssue | JavascriptIterable<DocumentIssue>): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const value: JsonDocumentArray | undefined = parser.parseArray(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedValue, value);

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

                parseArrayTest(
                    "",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                        }),
                        "Missing JSON array.",
                    ),
                );
                parseArrayTest(
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
                        "Expected JSON array, but found \"   \" instead.",
                    ),
                );
                parseArrayTest(
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
                        "Expected JSON array, but found \"flubber\" instead.",
                    ),
                );
                parseArrayTest(
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
                        "Expected JSON array, but found \"*\" instead.",
                    ),
                );
                parseArrayTest(
                    "[",
                    JsonDocumentArray.create(Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                    ])),
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
                        "Missing array closing brace (']').",
                    ),
                );
                parseArrayTest(
                    "[]",
                    JsonDocumentArray.create(Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                        Token.rightSquareBrace(),
                    ])),
                );
                parseArrayTest(
                    "[   ",
                    JsonDocumentArray.create(Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                        Token.whitespace("   "),
                    ])),
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
                        "Missing array closing brace (']').",
                    ),
                );
                parseArrayTest(
                    "[ ]",
                    JsonDocumentArray.create(Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                        Token.whitespace(" "),
                        Token.rightSquareBrace(),
                    ])),
                );
                parseArrayTest(
                    "[ false ]",
                    JsonDocumentArray.create(Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                        Token.whitespace(" "),
                        JsonDocumentBoolean.create(Token.letters("false")),
                        Token.whitespace(" "),
                        Token.rightSquareBrace(),
                    ])),
                );
                parseArrayTest(
                    "[ false, ]",
                    JsonDocumentArray.create(Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                        Token.whitespace(" "),
                        JsonDocumentBoolean.create(Token.letters("false")),
                        Token.comma(),
                        Token.whitespace(" "),
                        Token.rightSquareBrace(),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 9,
                                columnIndex: 9,
                            }),
                            afterEndOrColumns: 1
                        }),
                        "Expected JSON array element value, but found \"]\" instead.",
                    ),
                );
                parseArrayTest(
                    "[ [] ]",
                    JsonDocumentArray.create(Iterable.create<Token | JsonDocumentValue>([
                        Token.leftSquareBrace(),
                        Token.whitespace(" "),
                        JsonDocumentArray.create(Iterable.create<Token | JsonDocumentValue>([
                            Token.leftSquareBrace(),
                            Token.rightSquareBrace(),
                        ])),
                        Token.whitespace(" "),
                        Token.rightSquareBrace(),
                    ])),
                );
                parseArrayTest(
                    "[1,2]",
                    JsonDocumentArray.create(Iterable.create([
                        Token.leftSquareBrace(),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("1")])),
                        Token.comma(),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("2")])),
                        Token.rightSquareBrace(),
                    ])),
                );
                parseArrayTest(
                    "[1 , 2]",
                    JsonDocumentArray.create(Iterable.create([
                        Token.leftSquareBrace(),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("1")])),
                        Token.whitespace(" "),
                        Token.comma(),
                        Token.whitespace(" "),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("2")])),
                        Token.rightSquareBrace(),
                    ])),
                );
                parseArrayTest(
                    "[1 2]",
                    JsonDocumentArray.create(Iterable.create([
                        Token.leftSquareBrace(),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("1")])),
                        Token.whitespace(" "),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("2")])),
                        Token.rightSquareBrace(),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create(3, 0, 3),
                            afterEndOrColumns: 1,
                        }),
                        "Expected array element separator (','), but found \"2\" instead.",
                    ),
                );
                parseArrayTest(
                    "[1,2,3]",
                    JsonDocumentArray.create(Iterable.create([
                        Token.leftSquareBrace(),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("1")])),
                        Token.comma(),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("2")])),
                        Token.comma(),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("3")])),
                        Token.rightSquareBrace(),
                    ])),
                );
                parseArrayTest(
                    "[1 2 3]",
                    JsonDocumentArray.create(Iterable.create([
                        Token.leftSquareBrace(),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("1")])),
                        Token.whitespace(" "),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("2")])),
                        Token.whitespace(" "),
                        JsonDocumentNumber.create(Iterable.create([Token.digits("3")])),
                        Token.rightSquareBrace(),
                    ])),
                    Iterable.create([
                        DocumentIssue.create(
                            DocumentRange.create({
                                start: DocumentPosition.create(3, 0, 3),
                                afterEndOrColumns: 1,
                            }),
                            "Expected array element separator (','), but found \"2\" instead.",
                        ),
                        DocumentIssue.create(
                            DocumentRange.create({
                                start: DocumentPosition.create(5, 0, 5),
                                afterEndOrColumns: 1,
                            }),
                            "Expected array element separator (','), but found \"3\" instead.",
                        ),
                    ]),
                );
                parseArrayTest(
                    "[[[[]]]]",
                    JsonDocumentArray.create(Iterable.create([
                        Token.leftSquareBrace(),
                        JsonDocumentArray.create(Iterable.create([
                            Token.leftSquareBrace(),
                            JsonDocumentArray.create(Iterable.create([
                                Token.leftSquareBrace(),
                                JsonDocumentArray.create(Iterable.create([
                                    Token.leftSquareBrace(),
                                    Token.rightSquareBrace(),
                                ])),
                                Token.rightSquareBrace(),
                            ])),
                            Token.rightSquareBrace(),
                        ])),
                        Token.rightSquareBrace(),
                    ])),
                );
                parseArrayTest(
                    "[foo]",
                    JsonDocumentArray.create(Iterable.create([
                        Token.leftSquareBrace(),
                        Token.letters("foo"),
                        Token.rightSquareBrace(),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create(
                            DocumentPosition.create(1, 0, 1),
                            3,
                        ),
                        "Expected JSON array element value, but found \"foo\" instead.",
                    ),
                );
                parseArrayTest(
                    "[*]",
                    JsonDocumentArray.create(Iterable.create([
                        Token.leftSquareBrace(),
                        Token.asterisk(),
                        Token.rightSquareBrace(),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create(
                            DocumentPosition.create(1, 0, 1),
                            1,
                        ),
                        "Expected JSON array element value, but found \"*\" instead.",
                    ),
                );
            });

            runner.testFunction("parseObject(string|JavascriptIterable<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parseObjectErrorTest(text: string | JavascriptIterable<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        test.assertThrows(() => parser.parseObject(text, onIssue), expected);
                    });
                }

                parseObjectErrorTest(undefined!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                parseObjectErrorTest(null!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function parseObjectTest(text: string | JavascriptIterable<string> | Tokenizer, expectedValue: JsonDocumentValue | undefined, expectedIssues?: DocumentIssue | JavascriptIterable<DocumentIssue>): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const value: JsonDocumentValue | undefined = parser.parseObject(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedValue, value);

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

                parseObjectTest(
                    "",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                        }),
                        "Missing JSON object.",
                    ),
                );
                parseObjectTest(
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
                        "Expected JSON object, but found \"   \" instead.",
                    ),
                );
                parseObjectTest(
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
                        "Expected JSON object, but found \"flubber\" instead.",
                    ),
                );
                parseObjectTest(
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
                        "Expected JSON object, but found \"*\" instead.",
                    ),
                );
                parseObjectTest(
                    "[",
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
                        "Expected JSON object, but found \"[\" instead.",
                    ),
                );
                parseObjectTest(
                    "{",
                    JsonDocumentObject.create(Iterable.create([
                        Token.leftCurlyBracket(),
                    ])),
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
                        "Missing JSON object closing bracket ('}').",
                    ),
                );
                parseObjectTest(
                    "{}",
                    JsonDocumentObject.create(Iterable.create([
                        Token.leftCurlyBracket(),
                        Token.rightCurlyBracket(),
                    ])),
                );
                parseObjectTest(
                    "{   ",
                    JsonDocumentObject.create(Iterable.create([
                        Token.leftCurlyBracket(),
                        Token.whitespace("   "),
                    ])),
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
                        "Missing JSON object closing bracket ('}').",
                    ),
                );
                parseObjectTest(
                    "{ }",
                    JsonDocumentObject.create(Iterable.create([
                        Token.leftCurlyBracket(),
                        Token.whitespace(" "),
                        Token.rightCurlyBracket(),
                    ])),
                );
                parseObjectTest(
                    "{ false }",
                    JsonDocumentObject.create(Iterable.create([
                        Token.leftCurlyBracket(),
                        Token.whitespace(" "),
                        Token.letters("false"),
                        Token.whitespace(" "),
                        Token.rightCurlyBracket(),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 2,
                                columnIndex: 2,
                            }),
                            afterEndOrColumns: 5
                        }),
                        "Expected JSON object property name, but found \"false\" instead.",
                    ),
                );
                parseObjectTest(
                    "{ 'a': false }",
                    JsonDocumentObject.create(Iterable.create([
                        Token.leftCurlyBracket(),
                        Token.whitespace(" "),
                        JsonDocumentProperty.create(Iterable.create([
                            JsonDocumentString.create(Iterable.create([
                                Token.singleQuote(),
                                Token.letters("a"),
                                Token.singleQuote(),
                            ]), true),
                            Token.colon(),
                            Token.whitespace(" "),
                            JsonDocumentBoolean.create(Token.letters("false")),
                        ])),
                        Token.whitespace(" "),
                        Token.rightCurlyBracket(),
                    ])),
                );
                parseObjectTest(
                    "{ 'a': false, }",
                    JsonDocumentObject.create(Iterable.create([
                        Token.leftCurlyBracket(),
                        Token.whitespace(" "),
                        JsonDocumentProperty.create(Iterable.create([
                            JsonDocumentString.create(Iterable.create([
                                Token.singleQuote(),
                                Token.letters("a"),
                                Token.singleQuote(),
                            ]), true),
                            Token.colon(),
                            Token.whitespace(" "),
                            JsonDocumentBoolean.create(Token.letters("false")),
                        ])),
                        Token.comma(),
                        Token.whitespace(" "),
                        Token.rightCurlyBracket(),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 14,
                                columnIndex: 14,
                            }),
                            afterEndOrColumns: 1
                        }),
                        "Expected JSON object property, but found \"}\" instead.",
                    ),
                );
                parseObjectTest(
                    "{ 'a': false, \"b\": 'c' }",
                    JsonDocumentObject.create(Iterable.create([
                        Token.leftCurlyBracket(),
                        Token.whitespace(" "),
                        JsonDocumentProperty.create(Iterable.create([
                            JsonDocumentString.create(Iterable.create([
                                Token.singleQuote(),
                                Token.letters("a"),
                                Token.singleQuote(),
                            ]), true),
                            Token.colon(),
                            Token.whitespace(" "),
                            JsonDocumentBoolean.create(Token.letters("false")),
                        ])),
                        Token.comma(),
                        Token.whitespace(" "),
                        JsonDocumentProperty.create(Iterable.create([
                            JsonDocumentString.create(Iterable.create([
                                Token.doubleQuote(),
                                Token.letters("b"),
                                Token.doubleQuote(),
                            ]), true),
                            Token.colon(),
                            Token.whitespace(" "),
                            JsonDocumentString.create(Iterable.create([
                                Token.singleQuote(),
                                Token.letters("c"),
                                Token.singleQuote(),
                            ]), true),
                        ])),
                        Token.whitespace(" "),
                        Token.rightCurlyBracket(),
                    ])),
                );
            });

            runner.testFunction("parseProperty(string|JavascriptIterable<string>|Tokenizer,((issue: DocumentIssue) => void)|undefined)", () =>
            {
                function parsePropertyErrorTest(text: string | JavascriptIterable<string> | Tokenizer, onIssue: ((issue: DocumentIssue) => void) | undefined, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        test.assertThrows(() => parser.parseProperty(text, onIssue), expected);
                    });
                }

                parsePropertyErrorTest(undefined!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
                parsePropertyErrorTest(null!, undefined, new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));

                function parsePropertyTest(text: string | JavascriptIterable<string> | Tokenizer, expectedValue: JsonDocumentProperty | undefined, expectedIssues?: DocumentIssue | JavascriptIterable<DocumentIssue>): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const parser: JsonDocumentParser = JsonDocumentParser.create();
                        const issues: List<DocumentIssue> = List.create();

                        const value: JsonDocumentProperty | undefined = parser.parseProperty(text, (issue: DocumentIssue) => issues.add(issue)).await();

                        test.assertEqual(expectedValue, value);

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

                parsePropertyTest(
                    "",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                        }),
                        "Missing JSON object property name.",
                    ),
                );
                parsePropertyTest(
                    "   ",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: 3,
                        }),
                        "Expected JSON object property name, but found \"   \" instead.",
                    ),
                );
                parsePropertyTest(
                    "flubber",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: 7,
                        }),
                        "Expected JSON object property name, but found \"flubber\" instead.",
                    ),
                );
                parsePropertyTest(
                    "*",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: 1
                        }),
                        "Expected JSON object property name, but found \"*\" instead.",
                    ),
                );
                parsePropertyTest(
                    "[",
                    undefined,
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 0,
                                columnIndex: 0,
                            }),
                            afterEndOrColumns: 1,
                        }),
                        "Expected JSON object property name, but found \"[\" instead.",
                    ),
                );
                parsePropertyTest(
                    "50",
                    undefined,
                    Iterable.create([
                        DocumentIssue.create(
                            DocumentRange.create({
                                start: DocumentPosition.create({
                                    characterIndex: 0,
                                    columnIndex: 0,
                                }),
                                afterEndOrColumns: 2,
                            }),
                            "Expected JSON object property name, but found \"50\" instead.",
                        ),
                    ]),
                );
                parsePropertyTest(
                    `"hello"`,
                    JsonDocumentProperty.create(Iterable.create([
                        JsonDocumentString.create(Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("hello"),
                            Token.doubleQuote(),
                        ]), true),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 7,
                                columnIndex: 7,
                            }),
                        }),
                        "Missing JSON object property separator (':').",
                    ),
                );
                parsePropertyTest(
                    `"hello"   `,
                    JsonDocumentProperty.create(Iterable.create([
                        JsonDocumentString.create(Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("hello"),
                            Token.doubleQuote(),
                        ]), true),
                        Token.whitespace("   "),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 10,
                                columnIndex: 10,
                            }),
                        }),
                        "Missing JSON object property separator (':').",
                    ),
                );
                parsePropertyTest(
                    `"hello"*`,
                    JsonDocumentProperty.create(Iterable.create([
                        JsonDocumentString.create(Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("hello"),
                            Token.doubleQuote(),
                        ]), true),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 7,
                                columnIndex: 7,
                            }),
                            afterEndOrColumns: 1,
                        }),
                        "Expected JSON object property separator (':'), but found \"*\" instead.",
                    ),
                );
                parsePropertyTest(
                    `"hello":`,
                    JsonDocumentProperty.create(Iterable.create([
                        JsonDocumentString.create(Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("hello"),
                            Token.doubleQuote(),
                        ]), true),
                        Token.colon(),
                    ])),
                    DocumentIssue.create(
                        DocumentRange.create({
                            start: DocumentPosition.create({
                                characterIndex: 8,
                                columnIndex: 8,
                            }),
                        }),
                        "Missing JSON object property value.",
                    ),
                );
                parsePropertyTest(
                    `"hello":"there"`,
                    JsonDocumentProperty.create(Iterable.create([
                        JsonDocumentString.create(Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("hello"),
                            Token.doubleQuote(),
                        ]), true),
                        Token.colon(),
                        JsonDocumentString.create(Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("there"),
                            Token.doubleQuote(),
                        ]), true),
                    ])),
                );
                parsePropertyTest(
                    `"hello" : "there"`,
                    JsonDocumentProperty.create(Iterable.create([
                        JsonDocumentString.create(Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("hello"),
                            Token.doubleQuote(),
                        ]), true),
                        Token.whitespace(" "),
                        Token.colon(),
                        Token.whitespace(" "),
                        JsonDocumentString.create(Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("there"),
                            Token.doubleQuote(),
                        ]), true),
                    ])),
                );
                parsePropertyTest(
                    `"hello":false`,
                    JsonDocumentProperty.create(Iterable.create([
                        JsonDocumentString.create(Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("hello"),
                            Token.doubleQuote(),
                        ]), true),
                        Token.colon(),
                        JsonDocumentBoolean.create(Token.letters("false")),
                    ])),
                );
                parsePropertyTest(
                    `"hello":400`,
                    JsonDocumentProperty.create(Iterable.create([
                        JsonDocumentString.create(Iterable.create([
                            Token.doubleQuote(),
                            Token.letters("hello"),
                            Token.doubleQuote(),
                        ]), true),
                        Token.colon(),
                        JsonDocumentNumber.create(Iterable.create([
                            Token.digits("400"),
                        ])),
                    ])),
                );
            });
        });
    });
}
test(createTestRunner());