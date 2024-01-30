import * as assert from "assert";
import { Iterator, JavascriptIterable, JsonToken, JsonTokenizer, ParseError, PreConditionError, escapeAndQuote } from "../sources";

suite("jsonTokenizer.ts", () =>
{
    suite("JsonTokenizer", () =>
    {
        suite("create(string)", () =>
        {
            function createErrorTest(characters: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(characters)}`, () =>
                {
                    assert.throws(() =>
                    {
                        const tokenizer: JsonTokenizer = JsonTokenizer.create(characters);
                        while (tokenizer.next())
                        {
                        }
                    }, expected);
                });
            }

            createErrorTest(
                undefined!,
                new PreConditionError(
                    "Expression: characters",
                    "Expected: not undefined and not null",
                    "Actual: undefined",
                ));
            createErrorTest(
                null!,
                new PreConditionError(
                    "Expression: characters",
                    "Expected: not undefined and not null",
                    "Actual: null",
                ));
            createErrorTest(
                `"\u001E"`,
                new ParseError(
                    "Invalid string character: \"\x1E\" (30)",
                ));
            createErrorTest(
                `"\u001F"`,
                new ParseError(
                    "Invalid string character: \"\x1F\" (31)",
                ));
            createErrorTest(
                `"\u005C"`,
                new ParseError(
                    "Missing string end quote: \"\\\"\" (34)",
                ));
            createErrorTest(
                `-`,
                new ParseError(
                    "Missing integer portion of number.",
                ));
            createErrorTest(
                `-a`,
                new ParseError(
                    "Expected integer portion of number, but found \"a\" instead.",
                ));
            createErrorTest(
                `1.`,
                new ParseError(
                    "Missing fractional portion of number.",
                ));
            createErrorTest(
                `1.  `,
                new ParseError(
                    "Expected fractional portion of number, but found \" \" instead.",
                ));
            createErrorTest(
                `1e`,
                new ParseError(
                    "Missing exponent portion of number.",
                ));
            createErrorTest(
                `1E`,
                new ParseError(
                    "Missing exponent portion of number.",
                ));
            createErrorTest(
                `1e-`,
                new ParseError(
                    "Missing exponent portion of number.",
                ));
            createErrorTest(
                `1e+`,
                new ParseError(
                    "Missing exponent portion of number.",
                ));
            createErrorTest(
                `1e `,
                new ParseError(
                    "Expected exponent portion of number, but found \" \" instead.",
                ));
            createErrorTest(
                `1e- `,
                new ParseError(
                    "Expected exponent portion of number, but found \" \" instead.",
                ));
            createErrorTest(
                `1e+ `,
                new ParseError(
                    "Expected exponent portion of number, but found \" \" instead.",
                ));

            function createTest(characters: string, expected: JavascriptIterable<JsonToken>): void
            {
                test(`with ${escapeAndQuote(characters)}`, () =>
                {
                    const tokenizer: JsonTokenizer = JsonTokenizer.create(characters);
                    assert.strictEqual(tokenizer.hasStarted(), false);
                    assert.strictEqual(tokenizer.hasCurrent(), false);

                    const expectedIterator: Iterator<JsonToken> = Iterator.create(expected);
                    let tokenizerHasCurrent: boolean = tokenizer.next();
                    let expectedHasCurrent: boolean = expectedIterator.next();
                    assert.strictEqual(tokenizerHasCurrent, expectedHasCurrent);
                    while (tokenizer.hasCurrent() && expectedIterator.hasCurrent())
                    {
                        assert.deepStrictEqual(tokenizer.getCurrent(), expectedIterator.getCurrent());

                        let tokenizerHasCurrent: boolean = tokenizer.next();
                        let expectedHasCurrent: boolean = expectedIterator.next();
                        assert.strictEqual(tokenizerHasCurrent, expectedHasCurrent);
                    }
                });
            }

            createTest("", []);
            createTest(" ", [JsonToken.whitespace(" ")]);
            createTest("\t \r\n ", [JsonToken.whitespace("\t \r\n ")]);
            createTest("{", [JsonToken.leftCurlyBrace()]);
            createTest("}", [JsonToken.rightCurlyBrace()]);
            createTest("{}", [JsonToken.leftCurlyBrace(), JsonToken.rightCurlyBrace()]);
            createTest(" { } ", [
                JsonToken.whitespace(" "),
                JsonToken.leftCurlyBrace(),
                JsonToken.whitespace(" "),
                JsonToken.rightCurlyBrace(),
                JsonToken.whitespace(" "),
            ]);
            createTest("[", [JsonToken.leftSquareBracket()]);
            createTest("]", [JsonToken.rightSquareBracket()]);
            createTest("[]", [JsonToken.leftSquareBracket(), JsonToken.rightSquareBracket()]);
            createTest(",", [JsonToken.comma()]);
            createTest(":", [JsonToken.colon()]);
            createTest("*", [JsonToken.unknown("*")]);
            createTest(`"\u0020"`, [JsonToken.string(`\u0020`)]);
            createTest(`"\u0021"`, [JsonToken.string(`\u0021`)]);
            createTest(`"\u0023"`, [JsonToken.string(`\u0023`)]);
            createTest(`0`, [JsonToken.number(0)]);
            createTest(`-0`, [JsonToken.number(-0)]);
            createTest(`1`, [JsonToken.number(1)]);
            createTest(`123`, [JsonToken.number(123)]);
            createTest(`-1234`, [JsonToken.number(-1234)]);
            createTest(`1.2`, [JsonToken.number(1.2)]);
            createTest(`12.345`, [JsonToken.number(12.345)]);
            createTest(`1e0`, [JsonToken.number(1)]);
            createTest(`1e+0`, [JsonToken.number(1)]);
            createTest(`1e-0`, [JsonToken.number(1)]);
            createTest(`1e10`, [JsonToken.number(1e10)]);
            createTest(`1e987`, [JsonToken.number(1e987)]);
            createTest(`1.2e2`, [JsonToken.number(1.2e2)]);
            createTest(`223.456e7`, [JsonToken.number(223.456e7)]);
        });
    });
});