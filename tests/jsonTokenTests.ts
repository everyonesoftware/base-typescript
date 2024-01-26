import * as assert from "assert";

import { JsonToken, JsonTokenType } from "../sources";

suite("jsonToken.ts", () =>
{
    suite("JsonToken", () =>
    {
        test("leftCurlyBrace()", () =>
        {
            const token: JsonToken = JsonToken.leftCurlyBrace();
            assert.strictEqual(token.getText(), "{");
            assert.strictEqual(token.getTokenType(), JsonTokenType.LeftCurlyBrace);
        });

        test("rightCurlyBrace()", () =>
        {
            const token: JsonToken = JsonToken.rightCurlyBrace();
            assert.strictEqual(token.getText(), "}");
            assert.strictEqual(token.getTokenType(), JsonTokenType.RightCurlyBrace);
        });

        test("leftSquareBracket()", () =>
        {
            const token: JsonToken = JsonToken.leftSquareBracket();
            assert.strictEqual(token.getText(), "[");
            assert.strictEqual(token.getTokenType(), JsonTokenType.LeftSquareBracket);
        });

        test("rightSquareBracket()", () =>
        {
            const token: JsonToken = JsonToken.rightSquareBracket();
            assert.strictEqual(token.getText(), "]");
            assert.strictEqual(token.getTokenType(), JsonTokenType.RightSquareBracket);
        });
    });
});