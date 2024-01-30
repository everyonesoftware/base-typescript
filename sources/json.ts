import { orList } from "./english";
import { JsonArray } from "./jsonArray";
import { JsonBoolean } from "./jsonBoolean";
import { JsonNull } from "./jsonNull";
import { JsonNumber } from "./jsonNumber";
import { JsonObject } from "./jsonObject";
import { JsonSegment } from "./jsonSegment";
import { JsonString } from "./jsonString";
import { JsonToken } from "./jsonToken";
import { JsonTokenType } from "./jsonTokenType";
import { JsonTokenizer } from "./jsonTokenizer";
import { ParseError } from "./parseError";
import { Post } from "./post";
import { Pre } from "./pre";
import { escapeAndQuote } from "./strings";
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
        
        case JsonTokenType.Number:
            result = tokenizer.takeCurrent() as JsonNumber;
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

    let expectEndBrace: boolean = true;
    let expectProperty: boolean = true;
    let expectComma: boolean = false;

    while (tokenizer.hasCurrent() && endBrace === undefined)
    {
        skipWhitespace(tokenizer);

        if (tokenizer.hasCurrent())
        {
            switch (tokenizer.getCurrent().getTokenType())
            {
                case JsonTokenType.RightCurlyBrace:
                    if (!expectEndBrace)
                    {
                        throw expectedButFoundInstead("object property", tokenizer.getCurrent().getText(), false);
                    }
                    endBrace = tokenizer.takeCurrent();
                    expectEndBrace = false;
                    expectProperty = false;
                    expectComma = false;
                    break;

                case JsonTokenType.Comma:
                    if (!expectComma)
                    {
                        throw expectedButFoundInstead("object property or object closing brace ('}')", tokenizer.getCurrent().getText(), false);
                    }
                    tokenizer.next();
                    expectEndBrace = false;
                    expectProperty = true;
                    expectComma = false;
                    break;

                case JsonTokenType.String:
                    if (!expectProperty)
                    {
                        throw expectedButFoundInstead("object property separator (',') or object closing brace ('}')", tokenizer.getCurrent().getText(), false);
                    }

                    const propertyName: JsonString = tokenizer.takeCurrent() as JsonString;
                    skipWhitespace(tokenizer);
                    if (!tokenizer.hasCurrent())
                    {
                        throw missing("property name/value separator", ":");
                    }
                    else if (tokenizer.getCurrent().getTokenType() !== JsonTokenType.Colon)
                    {
                        throw expectedButFoundInstead("property name/value separator (':')", tokenizer.getCurrent().getText(), false);
                    }
                    tokenizer.next();
                    skipWhitespace(tokenizer);

                    if (!tokenizer.hasCurrent())
                    {
                        throw missing("property value");
                    }

                    switch (tokenizer.getCurrent().getTokenType())
                    {
                        case JsonTokenType.LeftSquareBracket:
                        case JsonTokenType.LeftCurlyBrace:
                        case JsonTokenType.String:
                        case JsonTokenType.Boolean:
                        case JsonTokenType.Null:
                        case JsonTokenType.Number:
                            result.set(propertyName.getValue(), parseJsonSegment(tokenizer));
                            expectEndBrace = true;
                            expectProperty = false;
                            expectComma = true;
                            break;

                        default:
                            throw expectedButFoundInstead("property value", tokenizer.getCurrent().getText(), false);
                    }
                    break;

                default:
                    throw expectedButFoundInstead(["}", `"`], tokenizer.getCurrent().getText());
            }
        }
    }

    if (expectProperty)
    {
        if (expectEndBrace)
        {
            throw missing("object property or object closing brace ('}')");
        }
        else
        {
            throw missing("object property");
        }
    }
    else if (expectEndBrace)
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

    let expectEndBracket: boolean = true;
    let expectElement: boolean = true;
    let expectComma: boolean = false;

    while (tokenizer.hasCurrent() && endBracket === undefined)
    {
        skipWhitespace(tokenizer);

        if (tokenizer.hasCurrent())
        {
            switch (tokenizer.getCurrent().getTokenType())
            {
                case JsonTokenType.RightSquareBracket:
                    if (!expectEndBracket)
                    {
                        throw expectedButFoundInstead("array element", tokenizer.getCurrent().getText(), false);
                    }
                    endBracket = tokenizer.takeCurrent();
                    expectEndBracket = false;
                    expectElement = false;
                    expectComma = false;
                    break;

                case JsonTokenType.Comma:
                    if (!expectComma)
                    {
                        throw expectedButFoundInstead("array element or array closing bracket (']')", tokenizer.getCurrent().getText(), false);
                    }
                    tokenizer.next();
                    expectEndBracket = false;
                    expectElement = true;
                    expectComma = false;
                    break;

                case JsonTokenType.LeftSquareBracket:
                case JsonTokenType.LeftCurlyBrace:
                case JsonTokenType.String:
                case JsonTokenType.Boolean:
                case JsonTokenType.Null:
                case JsonTokenType.Number:
                    if (!expectElement)
                    {
                        throw expectedButFoundInstead("array element separator (',') or array closing bracket (']')", tokenizer.getCurrent().getText(), false);
                    }
                    result.add(parseJsonSegment(tokenizer));
                    expectEndBracket = true;
                    expectElement = false;
                    expectComma = true;
                    break;

                default:
                    throw new ParseError(`Expected array element or "]", but found ${tokenizer.getCurrent().getText()} instead.`);
            }
        }
    }

    if (expectElement)
    {
        if (expectEndBracket)
        {
            throw missing("array element or array closing bracket (']')");
        }
        else
        {
            throw missing("array element");
        }
    }
    else if (expectEndBracket)
    {
        throw missing("array closing bracket", "]");
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