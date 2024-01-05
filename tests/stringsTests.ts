import * as assert from "assert";

import * as english from "../sources/english";
import * as strings from "../sources/strings";
import { PreConditionError } from "../sources/index";

suite("strings.ts", () =>
{
    suite("join(string, string[])", () =>
    {
        function joinTest(separator: string, values: string[], expected: string): void
        {
            test(`with ${english.andList([strings.escapeAndQuote(separator), JSON.stringify(values.map(v => strings.escapeAndQuote(v)))])}`, () =>
            {
                assert.strictEqual(strings.join(separator, values), expected);
            });
        }

        joinTest(undefined!, [], "");
        joinTest(undefined!, ["a"], "a");
        joinTest(undefined!, ["a", "b"], "ab");
        joinTest(undefined!, ["a", "b", "c"], "abc");

        joinTest(null!, [], "");
        joinTest(null!, ["a"], "a");
        joinTest(null!, ["a", "b"], "ab");
        joinTest(null!, ["a", "b", "c"], "abc");

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
            test(`with ${english.andList([strings.escapeAndQuote(value), JSON.stringify(dontEscape?.map((value: string) => strings.escapeAndQuote(value)))])}`, () =>
            {
                const result: string = strings.escape(value, dontEscape);
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
        function quoteTest(value: string | undefined | null, quote: string | undefined, expected: string): void
        {
            test(`with ${english.andList([value, quote].map(x => strings.escapeAndQuote(x)))}`, () =>
            {
                const result: string = strings.quote(value, quote);
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
            test(`with ${english.andList([strings.escapeAndQuote(value), strings.escapeAndQuote(quote), JSON.stringify(dontEscape?.map(x => strings.escapeAndQuote(x)))])}`, () =>
            {
                const result: string = strings.escapeAndQuote(value, quote, dontEscape);
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
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => strings.isWhitespace(value!), expectedError);
            });
        }

        isWhitespaceErrorTest(undefined, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isWhitespaceErrorTest(null, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isWhitespaceErrorTest("", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isWhitespaceErrorTest("  ", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isWhitespaceTest(value: string, expected: boolean): void
        {
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(strings.isWhitespace(value), expected);
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
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => strings.isLetter(value!), expectedError);
            });
        }

        isLetterErrorTest(undefined, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isLetterErrorTest(null, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isLetterErrorTest("", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isLetterErrorTest("  ", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isLetterTest(value: string, expected: boolean): void
        {
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(strings.isLetter(value), expected);
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
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => strings.isLowercasedLetter(value!), expectedError);
            });
        }

        isLowercasedLetterErrorTest(undefined, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isLowercasedLetterErrorTest(null, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isLowercasedLetterErrorTest("", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isLowercasedLetterErrorTest("  ", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isLowercasedLetterTest(value: string, expected: boolean): void
        {
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(strings.isLowercasedLetter(value), expected);
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
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => strings.isUppercasedLetter(value!), expectedError);
            });
        }

        isUppercasedLetterErrorTest(undefined, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isUppercasedLetterErrorTest(null, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isUppercasedLetterErrorTest("", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isUppercasedLetterErrorTest("  ", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isUppercasedLetterTest(value: string, expected: boolean): void
        {
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(strings.isUppercasedLetter(value), expected);
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
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => strings.isDigit(value!), expectedError);
            });
        }

        isDigitErrorTest(undefined, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isDigitErrorTest(null, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isDigitErrorTest("", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isDigitErrorTest("  ", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isDigitTest(value: string, expected: boolean): void
        {
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(strings.isDigit(value), expected);
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
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.throws(() => strings.isLetterOrDigit(value!), expectedError);
            });
        }

        isLetterOrDigitErrorTest(undefined, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: undefined",
        ])));
        isLetterOrDigitErrorTest(null, new PreConditionError(strings.join("\n", [
            "Expression: value",
            "Expected: not undefined and not null",
            "Actual: null",
        ])));
        isLetterOrDigitErrorTest("", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 0",
        ])));
        isLetterOrDigitErrorTest("ab", new PreConditionError(strings.join("\n", [
            "Expression: value.length",
            "Expected: 1",
            "Actual: 2",
        ])));

        function isLetterOrDigitTest(value: string, expected: boolean): void
        {
            test(`with ${strings.escapeAndQuote(value)}`, () =>
            {
                assert.strictEqual(strings.isLetterOrDigit(value), expected);
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