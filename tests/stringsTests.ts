import * as assert from "assert";
import { PreConditionError, andList, escape, escapeAndQuote, getLength, isDigit, isLetter, isLetterOrDigit, isLowercasedLetter, isUppercasedLetter, isWhitespace, join, quote } from "../sources";

suite("ts", () =>
{
    suite("getLength(string | undefined | null)", () =>
    {
        function getLengthTest(value: string | undefined | null, expected: number): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(getLength(value), expected);
            });
        }

        getLengthTest(undefined, 0);
        getLengthTest(null, 0);
        getLengthTest("", 0);
        getLengthTest("a", 1);
        getLengthTest("abc", 3);
    });

    suite("join(string, string[])", () =>
    {
        function joinErrorTest(separator: string, values: string[], expected: Error): void
        {
            test(`with ${andList([escapeAndQuote(separator), JSON.stringify(values.map(v => escapeAndQuote(v)))])}`, () =>
            {
                assert.throws(() => join(separator, values), expected);
            });
        }

        joinErrorTest(undefined!, [],
            new PreConditionError(
                "Expression: separator",
                "Expected: not undefined and not null",
                "Actual: undefined"));
        joinErrorTest(undefined!, ["a"],
            new PreConditionError(
                "Expression: separator",
                "Expected: not undefined and not null",
                "Actual: undefined"));
        joinErrorTest(undefined!, ["a", "b"],
            new PreConditionError(
                "Expression: separator",
                "Expected: not undefined and not null",
                "Actual: undefined"));
        joinErrorTest(undefined!, ["a", "b", "c"],
            new PreConditionError(
                "Expression: separator",
                "Expected: not undefined and not null",
                "Actual: undefined"));

        joinErrorTest(null!, [],
            new PreConditionError(
                "Expression: separator",
                "Expected: not undefined and not null",
                "Actual: null"));
        joinErrorTest(null!, ["a"],
            new PreConditionError(
                "Expression: separator",
                "Expected: not undefined and not null",
                "Actual: null"));
        joinErrorTest(null!, ["a", "b"],
            new PreConditionError(
                "Expression: separator",
                "Expected: not undefined and not null",
                "Actual: null"));
        joinErrorTest(null!, ["a", "b", "c"],
            new PreConditionError(
                "Expression: separator",
                "Expected: not undefined and not null",
                "Actual: null"));

        function joinTest(separator: string, values: string[], expected: string): void
        {
            test(`with ${andList([escapeAndQuote(separator), JSON.stringify(values.map(v => escapeAndQuote(v)))])}`, () =>
            {
                assert.strictEqual(join(separator, values), expected);
            });
        }

        

        joinTest("", [], "");
        joinTest("", ["a"], "a");
        joinTest("", ["a", "b"], "ab");
        joinTest("", ["a", "b", "c"], "abc");

        joinTest(" ", [], "");
        joinTest(" ", ["a"], "a");
        joinTest(" ", ["a", "b"], "a b");
        joinTest(" ", ["a", "b", "c"], "a b c");

        joinTest(" _ ", [], "");
        joinTest(" _ ", ["a"], "a");
        joinTest(" _ ", ["a", "b"], "a _ b");
        joinTest(" _ ", ["a", "b", "c"], "a _ b _ c");
    });

    suite("escape(string|undefined|null,string[]|undefined)", () =>
    {
        function escapeTest(value: string | undefined | null, dontEscape: string[] | undefined, expected: string): void
        {
            test(`with ${andList([escapeAndQuote(value), JSON.stringify(dontEscape?.map((value: string) => escapeAndQuote(value)))])}`, () =>
            {
                const result: string = escape(value, dontEscape);
                assert.strictEqual(result, expected);
            });
        }

        escapeTest(undefined, undefined, "undefined");
        escapeTest(null, undefined, "null");
        escapeTest("", undefined, "");
        escapeTest("a", undefined, "a");
        escapeTest("A", undefined, "A");
        escapeTest("abc", undefined, "abc");
        escapeTest("\t", undefined, "\\t");
        escapeTest("\n", undefined, "\\n");
        escapeTest("\r", undefined, "\\r");
        escapeTest("'", undefined, "\\'");
        escapeTest("\"", undefined, "\\\"");
        escapeTest("&", undefined, "&");
        escapeTest(" \r\n \t ", undefined, " \\r\\n \\t ");
        escapeTest("\t", [], "\\t");
        escapeTest("\t", ["\n"], "\\t");
        escapeTest("\t", ["\t"], "\t");
    });

    suite("quote(string|undefined|null)", () =>
    {
        function quoteTest(value: string | undefined | null, quoteString: string | undefined, expected: string): void
        {
            test(`with ${andList([value, quoteString].map(x => escapeAndQuote(x)))}`, () =>
            {
                const result: string = quote(value, quoteString);
                assert.strictEqual(result, expected);
            });
        }

        quoteTest(undefined, undefined, "undefined");
        quoteTest(null, undefined, "null");
        quoteTest("", undefined, `""`);
        quoteTest("a", undefined, `"a"`);
        quoteTest("A", undefined, `"A"`);
        quoteTest("abc", undefined, `"abc"`);
        quoteTest("abc", "'", `'abc'`);
    });

    suite("escapeAndQuote(string|undefined|null,string|undefined,string[]|undefined)", () =>
    {
        function escapeAndQuoteTest(value: string | undefined | null, quote: string | undefined, dontEscape: string[] | undefined, expected: string): void
        {
            test(`with ${andList([escapeAndQuote(value), escapeAndQuote(quote), JSON.stringify(dontEscape?.map(x => escapeAndQuote(x)))])}`, () =>
            {
                const result: string = escapeAndQuote(value, quote, dontEscape);
                assert.strictEqual(result, expected);
            });
        }

        escapeAndQuoteTest(undefined, undefined, undefined, "undefined");
        escapeAndQuoteTest(null, undefined, undefined, "null");
        escapeAndQuoteTest("", undefined, undefined, `""`);
        escapeAndQuoteTest("a", undefined, undefined, `"a"`);
        escapeAndQuoteTest("A", undefined, undefined, `"A"`);
        escapeAndQuoteTest("abc", undefined, undefined, `"abc"`);
        escapeAndQuoteTest("\t", undefined, undefined, `"\\t"`);
        escapeAndQuoteTest("\n", undefined, undefined, `"\\n"`);
        escapeAndQuoteTest("\r", undefined, undefined, `"\\r"`);
        escapeAndQuoteTest("'", undefined, undefined, `"\\'"`);
        escapeAndQuoteTest("\"", undefined, undefined, `"\\\""`);
        escapeAndQuoteTest("&", undefined, undefined, `"&"`);
        escapeAndQuoteTest(" \r\n \t ", undefined, undefined, `" \\r\\n \\t "`);
        escapeAndQuoteTest("\t", undefined, [], `"\\t"`);
        escapeAndQuoteTest("\t", undefined, ["\n"], `"\\t"`);
        escapeAndQuoteTest("\t", undefined, ["\t"], `"\t"`);
    });

    suite("isWhitespace(string)", () =>
    {
        function isWhitespaceErrorTest(value: string | undefined | null, expectedError: Error): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => isWhitespace(value!), expectedError);
            });
        }

        isWhitespaceErrorTest(undefined, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isWhitespaceErrorTest(null, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isWhitespaceErrorTest("", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isWhitespaceErrorTest("  ", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isWhitespaceTest(value: string, expected: boolean): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(isWhitespace(value), expected);
            });
        }

        isWhitespaceTest(" ", true);
        isWhitespaceTest("\n", true);
        isWhitespaceTest("\r", true);
        isWhitespaceTest("\t", true);

        isWhitespaceTest("a", false);
        isWhitespaceTest("_", false);
        isWhitespaceTest("-", false);
    });

    suite("isLetter(string)", () =>
    {
        function isLetterErrorTest(value: string | undefined | null, expectedError: Error): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => isLetter(value!), expectedError);
            });
        }

        isLetterErrorTest(undefined, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isLetterErrorTest(null, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isLetterErrorTest("", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isLetterErrorTest("  ", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isLetterTest(value: string, expected: boolean): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(isLetter(value), expected);
            });
        }

        isLetterTest("a", true);
        isLetterTest("m", true);
        isLetterTest("z", true);
        isLetterTest("A", true);
        isLetterTest("N", true);
        isLetterTest("Z", true);
        
        isLetterTest(" ", false);
        isLetterTest("\n", false);
        isLetterTest("\r", false);
        isLetterTest("\t", false);
        isLetterTest("_", false);
        isLetterTest("-", false);
        isLetterTest("5", false);
    });

    suite("isLowercasedLetter(string)", () =>
    {
        function isLowercasedLetterErrorTest(value: string | undefined | null, expectedError: Error): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => isLowercasedLetter(value!), expectedError);
            });
        }

        isLowercasedLetterErrorTest(undefined, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isLowercasedLetterErrorTest(null, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isLowercasedLetterErrorTest("", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isLowercasedLetterErrorTest("  ", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isLowercasedLetterTest(value: string, expected: boolean): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(isLowercasedLetter(value), expected);
            });
        }

        isLowercasedLetterTest("a", true);
        isLowercasedLetterTest("m", true);
        isLowercasedLetterTest("z", true);

        isLowercasedLetterTest("A", false);
        isLowercasedLetterTest("N", false);
        isLowercasedLetterTest("Z", false);
        isLowercasedLetterTest(" ", false);
        isLowercasedLetterTest("\n", false);
        isLowercasedLetterTest("\r", false);
        isLowercasedLetterTest("\t", false);
        isLowercasedLetterTest("_", false);
        isLowercasedLetterTest("-", false);
        isLowercasedLetterTest("5", false);
    });

    suite("isUppercasedLetter(string)", () =>
    {
        function isUppercasedLetterErrorTest(value: string | undefined | null, expectedError: Error): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => isUppercasedLetter(value!), expectedError);
            });
        }

        isUppercasedLetterErrorTest(undefined, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isUppercasedLetterErrorTest(null, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isUppercasedLetterErrorTest("", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isUppercasedLetterErrorTest("  ", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isUppercasedLetterTest(value: string, expected: boolean): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(isUppercasedLetter(value), expected);
            });
        }
        
        isUppercasedLetterTest("A", true);
        isUppercasedLetterTest("N", true);
        isUppercasedLetterTest("Z", true);

        isUppercasedLetterTest("a", false);
        isUppercasedLetterTest("m", false);
        isUppercasedLetterTest("z", false);
        isUppercasedLetterTest(" ", false);
        isUppercasedLetterTest("\n", false);
        isUppercasedLetterTest("\r", false);
        isUppercasedLetterTest("\t", false);
        isUppercasedLetterTest("_", false);
        isUppercasedLetterTest("-", false);
        isUppercasedLetterTest("5", false);
    });

    suite("isDigit(string)", () =>
    {
        function isDigitErrorTest(value: string | undefined | null, expectedError: Error): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => isDigit(value!), expectedError);
            });
        }

        isDigitErrorTest(undefined, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isDigitErrorTest(null, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isDigitErrorTest("", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isDigitErrorTest("  ", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isDigitTest(value: string, expected: boolean): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(isDigit(value), expected);
            });
        }
        
        isDigitTest("0", true);
        isDigitTest("5", true);
        isDigitTest("9", true);

        isDigitTest(".", false);
        isDigitTest("a", false);
        isDigitTest("m", false);
        isDigitTest("z", false);
        isDigitTest("A", false);
        isDigitTest("N", false);
        isDigitTest("Z", false);
        isDigitTest(" ", false);
        isDigitTest("\n", false);
        isDigitTest("\r", false);
        isDigitTest("\t", false);
        isDigitTest("_", false);
        isDigitTest("-", false);
    });

    suite("isLetterOrDigit(string)", () =>
    {
        function isLetterOrDigitErrorTest(value: string | undefined | null, expectedError: Error): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => isLetterOrDigit(value!), expectedError);
            });
        }

        isLetterOrDigitErrorTest(undefined, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isLetterOrDigitErrorTest(null, new PreConditionError(join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isLetterOrDigitErrorTest("", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isLetterOrDigitErrorTest("ab", new PreConditionError(join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isLetterOrDigitTest(value: string, expected: boolean): void
        {
            test(`with ${escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(isLetterOrDigit(value), expected);
            });
        }
        
        isLetterOrDigitTest("0", true);
        isLetterOrDigitTest("5", true);
        isLetterOrDigitTest("9", true);
        isLetterOrDigitTest("a", true);
        isLetterOrDigitTest("m", true);
        isLetterOrDigitTest("z", true);
        isLetterOrDigitTest("A", true);
        isLetterOrDigitTest("N", true);
        isLetterOrDigitTest("Z", true);

        isLetterOrDigitTest(".", false);
        isLetterOrDigitTest(" ", false);
        isLetterOrDigitTest("\n", false);
        isLetterOrDigitTest("\r", false);
        isLetterOrDigitTest("\t", false);
        isLetterOrDigitTest("_", false);
        isLetterOrDigitTest("-", false);
    });
});