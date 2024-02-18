import { EmptyError } from "./emptyError";
import { JsonSegment } from "./jsonSegment";
import { List } from "./list";
import { NotFoundError } from "./notFoundError";
import { Pre } from "./pre";
import { Result } from "./result";
import { Iterator } from "./iterator";
import { JsonTokenizer } from "./jsonTokenizer";
import { ParseError } from "./parseError";
import { JsonTokenType } from "./jsonTokenType";
import { JsonString } from "./jsonString";
import { JsonBoolean } from "./jsonBoolean";
import { JsonNull } from "./jsonNull";
import { JsonNumber } from "./jsonNumber";
import { Post } from "./post";
import { JsonObject } from "./jsonObject";
import { JsonToken } from "./jsonToken";
import { JsonArray } from "./jsonArray";
import { Type } from "./types";
import { escapeAndQuote } from "./strings";
import { Iterable } from "./iterable";

/**
 * An object that represents a JSON document.
 */
export class JsonDocument
{
    private roots: List<JsonSegment>;

    private constructor()
    {
        this.roots = List.create();
    }

    /**
     * Create a new {@link JsonDocument}.
     */
    public static create(): JsonDocument
    {
        return new JsonDocument();
    }

    public static parse(text: string): Result<JsonDocument>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: JsonTokenizer = JsonTokenizer.create(text).start();
            JsonDocument.skipWhitespace(tokenizer);
        
            if (!tokenizer.hasCurrent())
            {
                throw new ParseError("Missing JSON value.");
            }
        
            const result: JsonDocument = JsonDocument.create();

            result.addRoot(JsonDocument.parseJsonSegment(tokenizer).await());
        
            JsonDocument.skipWhitespace(tokenizer);
        
            if (tokenizer.hasCurrent())
            {
                throw ParseError.unexpectedToken(tokenizer.getCurrent().getText());
            }
        
            return result;
        });
    }

    private static parseJsonSegment(tokenizer: JsonTokenizer): Result<JsonSegment>
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "tokenizer");
        Pre.condition.assertTrue(tokenizer.hasCurrent(), "tokenizer.hasCurrent()");

        return Result.create(() =>
        {
            let result: JsonSegment;
            switch (tokenizer.getCurrent().getTokenType())
            {
                case JsonTokenType.LeftSquareBracket:
                    result = JsonDocument.parseJsonArray(tokenizer).await();
                    break;

                case JsonTokenType.LeftCurlyBrace:
                    result = JsonDocument.parseJsonObject(tokenizer).await();
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
                    throw ParseError.unexpectedToken(tokenizer.getCurrent().getText());
            }

            Post.condition.assertNotUndefinedAndNotNull(result, "result");

            return result;
        });
        
    }

    /**
     * Skip any whitespace tokens that the {@link JsonTokenizer} is on.
     * @param tokenizer The {@link JsonTokenizer} to advance.
     */
    private static skipWhitespace(tokenizer: JsonTokenizer): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "iterator");
        Pre.condition.assertTrue(tokenizer.hasStarted(), "iterator.hasStarted()");

        if (tokenizer.hasCurrent() && tokenizer.getCurrent().getTokenType() === JsonTokenType.Whitespace)
        {
            tokenizer.next();
        }
    }

    private static parseJsonObject(tokenizer: JsonTokenizer): Result<JsonObject>
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "tokenizer");
        Pre.condition.assertTrue(tokenizer.hasCurrent(), "tokenizer.hasCurrent()");
        Pre.condition.assertSame(JsonTokenType.LeftCurlyBrace, tokenizer.getCurrent().getTokenType(), "tokenizer.getCurrent()");

        return Result.create(() =>
        {
            const result: JsonObject = JsonObject.create();
            tokenizer.next(); // Move past '{'
            let endBrace: JsonToken | undefined = undefined;

            let expectEndBrace: boolean = true;
            let expectProperty: boolean = true;
            let expectComma: boolean = false;

            while (tokenizer.hasCurrent() && endBrace === undefined)
            {
                JsonDocument.skipWhitespace(tokenizer);

                if (tokenizer.hasCurrent())
                {
                    switch (tokenizer.getCurrent().getTokenType())
                    {
                        case JsonTokenType.RightCurlyBrace:
                            if (!expectEndBrace)
                            {
                                throw ParseError.expectedButFoundInstead({
                                    expected: "object property",
                                    foundInstead: escapeAndQuote(tokenizer.getCurrent().getText()),
                                });
                            }
                            endBrace = tokenizer.takeCurrent();
                            expectEndBrace = false;
                            expectProperty = false;
                            expectComma = false;
                            break;

                        case JsonTokenType.Comma:
                            if (!expectComma)
                            {
                                throw ParseError.expectedButFoundInstead({
                                    expected: "object property or object closing brace ('}')",
                                    foundInstead: escapeAndQuote(tokenizer.getCurrent().getText()),
                                });
                            }
                            tokenizer.next();
                            expectEndBrace = false;
                            expectProperty = true;
                            expectComma = false;
                            break;

                        case JsonTokenType.String:
                            if (!expectProperty)
                            {
                                throw ParseError.expectedButFoundInstead({
                                    expected: "object property separator (',') or object closing brace ('}')",
                                    foundInstead: escapeAndQuote(tokenizer.getCurrent().getText()),
                                });
                            }

                            const propertyName: JsonString = tokenizer.takeCurrent() as JsonString;
                            JsonDocument.skipWhitespace(tokenizer);
                            if (!tokenizer.hasCurrent())
                            {
                                throw ParseError.missing("property name/value separator", ":");
                            }
                            else if (tokenizer.getCurrent().getTokenType() !== JsonTokenType.Colon)
                            {
                                throw ParseError.expectedButFoundInstead({
                                    expected: "property name/value separator (':')",
                                    foundInstead: escapeAndQuote(tokenizer.getCurrent().getText()),
                                });
                            }
                            tokenizer.next();
                            JsonDocument.skipWhitespace(tokenizer);

                            if (!tokenizer.hasCurrent())
                            {
                                throw ParseError.missing("property value");
                            }

                            switch (tokenizer.getCurrent().getTokenType())
                            {
                                case JsonTokenType.LeftSquareBracket:
                                case JsonTokenType.LeftCurlyBrace:
                                case JsonTokenType.String:
                                case JsonTokenType.Boolean:
                                case JsonTokenType.Null:
                                case JsonTokenType.Number:
                                    result.set(propertyName.getValue(), JsonDocument.parseJsonSegment(tokenizer).await());
                                    expectEndBrace = true;
                                    expectProperty = false;
                                    expectComma = true;
                                    break;

                                default:
                                    throw ParseError.expectedButFoundInstead({
                                        expected: "property value",
                                        foundInstead: escapeAndQuote(tokenizer.getCurrent().getText()),
                                    });
                            }
                            break;

                        default:
                            throw ParseError.expectedButFoundInstead(Iterable.create(["}", `"`]).map(escapeAndQuote), tokenizer.getCurrent().getText());
                    }
                }
            }

            if (expectProperty)
            {
                if (expectEndBrace)
                {
                    throw ParseError.missing("object property or object closing brace ('}')");
                }
                else
                {
                    throw ParseError.missing("object property");
                }
            }
            else if (expectEndBrace)
            {
                throw ParseError.missing("object closing brace", "}");
            }

            return result;
        });
    }

    private static parseJsonArray(tokenizer: JsonTokenizer): Result<JsonArray>
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "tokenizer");
        Pre.condition.assertTrue(tokenizer.hasCurrent(), "tokenizer.hasCurrent()");
        Pre.condition.assertSame(JsonTokenType.LeftSquareBracket, tokenizer.getCurrent().getTokenType(), "tokenizer.getCurrent()");

        return Result.create(() =>
        {
            const result: JsonArray = JsonArray.create();
            tokenizer.next(); // Move past '['
            let endBracket: JsonToken | undefined = undefined;

            let expectEndBracket: boolean = true;
            let expectElement: boolean = true;
            let expectComma: boolean = false;

            while (tokenizer.hasCurrent() && endBracket === undefined)
            {
                JsonDocument.skipWhitespace(tokenizer);

                if (tokenizer.hasCurrent())
                {
                    switch (tokenizer.getCurrent().getTokenType())
                    {
                        case JsonTokenType.RightSquareBracket:
                            if (!expectEndBracket)
                            {
                                throw ParseError.expectedButFoundInstead({
                                    expected: "array element",
                                    foundInstead: escapeAndQuote(tokenizer.getCurrent().getText()),
                                });
                            }
                            endBracket = tokenizer.takeCurrent();
                            expectEndBracket = false;
                            expectElement = false;
                            expectComma = false;
                            break;

                        case JsonTokenType.Comma:
                            if (!expectComma)
                            {
                                throw ParseError.expectedButFoundInstead({
                                    expected: "array element or array closing bracket (']')",
                                    foundInstead: escapeAndQuote(tokenizer.getCurrent().getText()),
                                });
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
                                throw ParseError.expectedButFoundInstead({
                                    expected: "array element separator (',') or array closing bracket (']')",
                                    foundInstead: escapeAndQuote(tokenizer.getCurrent().getText()),
                                });
                            }
                            result.add(JsonDocument.parseJsonSegment(tokenizer).await());
                            expectEndBracket = true;
                            expectElement = false;
                            expectComma = true;
                            break;

                        default:
                            throw ParseError.expectedButFoundInstead({
                                expected: `array element or array closing bracket (']')`,
                                foundInstead: escapeAndQuote(tokenizer.getCurrent().getText()),
                            });
                    }
                }
            }

            if (expectElement)
            {
                if (expectEndBracket)
                {
                    throw ParseError.missing("array element or array closing bracket (']')");
                }
                else
                {
                    throw ParseError.missing("array element");
                }
            }
            else if (expectEndBracket)
            {
                throw ParseError.missing("array closing bracket", "]");
            }

            return result;
        });
    }

    

    /**
     * Add a root {@link JsonSegment} to this {@link JsonDocument}.
     * @param root The root {@link JsonSegment} to add to this {@link JsonDocument}.
     * @returns This object for method chaining.
     */
    public addRoot(root: JsonSegment): JsonDocument
    {
        Pre.condition.assertNotUndefinedAndNotNull(root, "root");

        this.roots.add(root);

        return this;
    }

    /**
     * Get the root {@link JsonSegment} of this {@link JsonDocument}.
     */
    public getRoot(): Result<JsonSegment>
    {
        return this.roots.first()
            .convertError(EmptyError, () => new NotFoundError("No root has been added."));
    }

    private getRootAs<T>(type: Type<T>): Result<T>
    {
        return Result.create(() =>
        {
            const root: JsonSegment = this.getRoot().await();
            return JsonSegment.as(root, type).await();
        });
    }

    public getRootObject(): Result<JsonObject>
    {
        return this.getRootAs(JsonObject);
    }

    public iterateRoots(): Iterator<JsonSegment>
    {
        return this.roots.iterate();
    }
}