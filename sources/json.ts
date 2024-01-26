import { orList } from "./english";
import { JsonArray } from "./jsonArray";
import { JsonBoolean } from "./jsonBoolean";
import { JsonNull } from "./jsonNull";
import { JsonObject } from "./jsonObject";
import { JsonSegment } from "./jsonSegment";
import { JsonString } from "./jsonString";
import { JsonToken } from "./jsonToken";
import { JsonTokenType } from "./jsonTokenType";
import { JsonTokenizer } from "./jsonTokenizer";
import { ParseError } from "./parseError";
import { Post } from "./post";
import { Pre } from "./pre";
import { StringIterator } from "./stringIterator";
import { escapeAndQuote, isLetter } from "./strings";
import { isString } from "./types";

export function parseJson(text: string): JsonSegment
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    const tokenizer: JsonTokenizer = JsonTokenizer.create(text).start();
    skipWhitespace(tokenizer);

    if (!tokenizer.hasCurrent())
    {
        throw new ParseError("Missing JSON value.");
    }

    const result: JsonSegment = parseJsonSegment(tokenizer);

    skipWhitespace(tokenizer);

    if (tokenizer.hasCurrent())
    {
        throw unexpectedToken(tokenizer);
    }

    return result;
}

export function parseJsonSegment(tokenizer: JsonTokenizer): JsonSegment
{
    Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "tokenizer");
    Pre.condition.assertTrue(tokenizer.hasCurrent(), "tokenizer.hasCurrent()");

    let result: JsonSegment;
    switch (tokenizer.getCurrent().getTokenType())
    {
        case JsonTokenType.LeftSquareBracket:
            result = parseJsonArray(tokenizer);
            break;

        case JsonTokenType.LeftCurlyBrace:
            result = parseJsonObject(tokenizer);
            break;

        case JsonTokenType.String:
            result = tokenizer.takeCurrent() as JsonString;
            break;

        case JsonTokenType.Boolean:
            result = tokenizer.takeCurrent() as JsonBoolean;
            break;

        case JsonTokenType.Null:
            result = tokenizer.takeCurrent() as JsonNull;
            break;

        default:
            throw unexpectedToken(tokenizer);
    }

    Post.condition.assertNotUndefinedAndNotNull(result, "result");

    return result;
}

/**
 * Skip any whitespace tokens that the {@link JsonTokenizer} is on.
 * @param tokenizer The {@link JsonTokenizer} to advance.
 */
export function skipWhitespace(tokenizer: JsonTokenizer): void
{
    Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "iterator");
    Pre.condition.assertTrue(tokenizer.hasStarted(), "iterator.hasStarted()");

    if (tokenizer.hasCurrent() && tokenizer.getCurrent().getTokenType() === JsonTokenType.Whitespace)
    {
        tokenizer.next();
    }
}

export function parseJsonObject(tokenizer: JsonTokenizer): JsonObject
{
    Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "tokenizer");
    Pre.condition.assertTrue(tokenizer.hasCurrent(), "tokenizer.hasCurrent()");
    Pre.condition.assertSame(JsonTokenType.LeftCurlyBrace, tokenizer.getCurrent().getTokenType(), "tokenizer.getCurrent()");

    const result: JsonObject = JsonObject.create();
    tokenizer.next(); // Move past '{'
    let endBrace: JsonToken | undefined = undefined;

    while (tokenizer.hasCurrent())
    {
        skipWhitespace(tokenizer);

        if (tokenizer.hasCurrent())
        {
            switch (tokenizer.getCurrent().getTokenType())
            {
                case JsonTokenType.RightCurlyBrace:
                    endBrace = tokenizer.takeCurrent();
                    break;

                default:
                    throw expectedButFoundInstead(["}", `"`], tokenizer.getCurrent().getText());
            }
        }
    }

    if (endBrace === undefined)
    {
        throw missing("object closing brace", "}");
    }

    return result;
}

export function parseJsonArray(tokenizer: JsonTokenizer): JsonArray
{
    Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "tokenizer");
    Pre.condition.assertTrue(tokenizer.hasCurrent(), "tokenizer.hasCurrent()");
    Pre.condition.assertSame(JsonTokenType.LeftSquareBracket, tokenizer.getCurrent().getTokenType(), "tokenizer.getCurrent()");

    const result: JsonArray = JsonArray.create();
    tokenizer.next(); // Move past '['
    let endBracket: JsonToken | undefined = undefined;

    while (tokenizer.hasCurrent())
    {
        skipWhitespace(tokenizer);

        if (tokenizer.hasCurrent())
        {
            switch (tokenizer.getCurrent().getTokenType())
            {
                case JsonTokenType.RightSquareBracket:
                    endBracket = tokenizer.takeCurrent();
                    break;

                default:
                    throw new ParseError(`Expected element or "]" but found ${tokenizer.getCurrent().getText()} instead.`);
            }
        }
    }

    if (endBracket === undefined)
    {
        throw missing("array closing bracket", "]");
    }

    return result;
}

export function parseJsonLiteral(iterator: StringIterator): JsonNull | JsonBoolean
{
    Pre.condition.assertNotUndefinedAndNotNull(iterator, "iterator");
    Pre.condition.assertTrue(iterator.hasCurrent(), "iterator.hasCurrent()");
    Pre.condition.assertTrue(isLetter(iterator.getCurrent()), "isLetter(iterator.getCurrent())");

    let text: string = iterator.takeCurrent();
    while (iterator.hasCurrent() && isLetter(iterator.getCurrent()))
    {
        text += iterator.takeCurrent();
    }

    let result: JsonNull | JsonBoolean;
    switch (text)
    {
        case "null":
            result = JsonNull.create();
            break;

        case "true":
            result = JsonBoolean.create(true);
            break;

        case "false":
            result = JsonBoolean.create(false);
            break;

        default:
            throw expectedButFoundInstead(["null", "true", "false"], text);
    }

    return result;
}

export function unexpectedToken(tokenizer: JsonTokenizer): ParseError
{
    Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "tokenizer");
    Pre.condition.assertTrue(tokenizer.hasCurrent(), "tokenizer.hasCurrent()");
    
    const token: JsonToken = tokenizer.getCurrent();
    return new ParseError(`Unexpected token: ${token.getText()}`);
}

export function expectedButFoundInstead(expected: string | string[], foundInstead: string, escapeExpected: boolean = true): ParseError
{
    if (isString(expected))
    {
        expected = [expected];
    }
    let message: string = `Expected `;
    if (escapeExpected)
    {
        message += orList(expected.map(x => escapeAndQuote(x)));
    }
    else
    {
        message += orList(expected);
    }
    message += `, but found ${escapeAndQuote(foundInstead)} instead.`;
    return new ParseError(message);
}

export function missing(description: string, expected?: string): ParseError
{
    Pre.condition.assertNotEmpty(description, "description");
    Pre.condition.assertTrue(expected === undefined || expected.length === 1, "expected === undefined || expected.length === 1");

    let message: string = `Missing ${description}`;
    if (expected === undefined)
    {
        message += ".";
    }
    else
    {
        message += `: ${escapeAndQuote(expected)} (${expected.codePointAt(0)})`;
    }
    return new ParseError(message);
}