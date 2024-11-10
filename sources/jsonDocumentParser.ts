import { DocumentIssue } from "./documentIssue";
import { JsonDocumentValue as JsonDocumentValue } from "./jsonDocumentValue";
import { Result } from "./result";
import { Tokenizer } from "./tokenizer";
import { Pre } from "./pre";
import { ParseError } from "./parseError";
import { isUndefinedOrNull } from "./types";
import { DocumentTokenizer } from "./documentTokenizer";
import { escapeAndQuote, quote } from "./strings";
import { DocumentRange } from "./documentRange";
import { TokenType } from "./tokenType";
import { Post } from "./post";
import { Token } from "./token";
import { List } from "./list";
import { JsonDocumentNull } from "./jsonDocumentNull";
import { JsonDocumentBoolean } from "./jsonDocumentBoolean";
import { JsonDocumentString } from "./jsonDocumentString";
import { JsonDocumentNumber } from "./jsonDocumentNumber";
import { JsonDocumentArray } from "./jsonDocumentArray";
import { JsonDocumentUnknown } from "./jsonDocumentUnknown";
import { JavascriptIterable } from "./javascript";
import { DocumentPosition } from "./documentPosition";
import { JsonDocumentObject } from "./jsonDocumentObject";
import { JsonDocumentProperty } from "./jsonDocumentProperty";
import { JsonDocument } from "./jsonDocument";

export class JsonDocumentParser
{
    private constructor()
    {
    }

    public static create(): JsonDocumentParser
    {
        return new JsonDocumentParser();
    }

    private static getTokenizer(text: string | JavascriptIterable<string> | Tokenizer): DocumentTokenizer
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        let result: DocumentTokenizer;
        if (text instanceof DocumentTokenizer)
        {
            result = text;
        }
        else
        {
            result = DocumentTokenizer.create(text);
        }
        result = result.start();

        Post.condition.assertNotUndefinedAndNotNull(result, "result");
        Post.condition.assertTrue(result.hasStarted(), "result.hasStarted()");

        return result;
    }

    private static defaultOnIssue(issue: DocumentIssue): void
    {
        throw new ParseError(issue.getRange(), issue.getMessage());
    }

    private static getOnIssue(onIssue?: (issue: DocumentIssue) => void): (issue: DocumentIssue) => void
    {
        if (isUndefinedOrNull(onIssue))
        {
            onIssue = JsonDocumentParser.defaultOnIssue;
        }
        return onIssue;
    }

    /**
     * Parse a {@link JsonDocument} from the provided text.
     * @param text The text to parse a {@link JsonDocument} from.
     * @param onIssue The function that will be invoked if any issues are encountered.
     */
    public parseDocument(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocument>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            const tokensAndValues: List<Token | JsonDocumentValue> = List.create();
            JsonDocumentParser.skipWhitespace(tokenizer, tokensAndValues);

            if (!tokenizer.hasCurrent())
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), "Missing JSON document root value."));
            }
            else
            {
                let alreadyFoundRootValue: boolean = false;
                while (tokenizer.hasCurrent())
                {
                    const valueStartPosition: DocumentPosition = tokenizer.getCurrentRange().getStart();
                    const value: JsonDocumentValue | undefined = this.parseValue(tokenizer, onIssue, "JSON document root value").await();
                    if (isUndefinedOrNull(value))
                    {
                        tokensAndValues.add(tokenizer.takeCurrent());
                    }
                    else
                    {
                        tokensAndValues.add(value);
                        if (alreadyFoundRootValue)
                        {
                            const valueAfterEndPosition: DocumentPosition = tokenizer.getCurrentRange().getStart();
                            onIssue(
                                DocumentIssue.create(
                                    DocumentRange.create(valueStartPosition, valueAfterEndPosition),
                                    "A JSON document can only have a single root value.",
                                ),
                            );
                        }
                        else
                        {
                            alreadyFoundRootValue = true;
                        }
                    }
                    JsonDocumentParser.skipWhitespace(tokenizer, tokensAndValues);
                }
            }

            return JsonDocument.create(tokensAndValues);
        });
    }

    /**
     * Parse a {@link JsonDocumentValue} from the provided text. If a {@link JsonDocumentValue}
     * cannot be parsed, then undefined will be returned.
     * @param text The text to parse a {@link JsonDocumentValue} from.
     * @param onIssue The function that will be invoked if any issues are encountered.
     * @param expected The text that describes the context that the {@link JsonDocumentValue} is
     * attempting to be parsed under.
     */
    public parseValue(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected?: string): Result<JsonDocumentValue | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            if (isUndefinedOrNull(expected))
            {
                expected = "JSON value";
            }

            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let result: JsonDocumentValue | undefined;

            if (!tokenizer.hasCurrent())
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Missing ${expected}.`));
            }
            else
            {
                switch (tokenizer.getCurrent().getType())
                {
                    case TokenType.LeftSquareBrace:
                        result = this.parseArray(tokenizer, onIssue).await();
                        break;

                    case TokenType.LeftCurlyBracket:
                        result = this.parseObject(tokenizer, onIssue).await();
                        break;

                    case TokenType.SingleQuote:
                    case TokenType.DoubleQuote:
                    case TokenType.Backtick:
                        result = this.parseString(tokenizer, onIssue).await();
                        break;

                    case TokenType.Letters:
                        result = this.parseNullOrBoolean(tokenizer, onIssue, expected).await();
                        break;
                    
                    case TokenType.Digits:
                    case TokenType.Hyphen:
                    case TokenType.Period:
                        result = this.parseNumber(tokenizer, onIssue).await();
                        break;

                    case TokenType.NewLine:
                    case TokenType.CarriageReturn:
                    case TokenType.Whitespace:
                        // Expect that whitespace has been previously skipped.
                        onIssue(DocumentIssue.create(
                            tokenizer.getCurrentRange(),
                            `Expected ${expected}, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`,
                        ));
                        break;

                    default:
                        onIssue(DocumentIssue.create(
                            tokenizer.getCurrentRange(),
                            `Expected ${expected}, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`,
                        ));
                        break;
                }
            }

            return result;
        });
    }

    public parseNullOrBoolean(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected: string = "JSON null or boolean"): Result<JsonDocumentValue | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let result: JsonDocumentValue | undefined;
            if (!tokenizer.hasCurrent())
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Missing ${expected}.`));
            }
            else if (tokenizer.getCurrent().getType() === TokenType.Letters)
            {
                const token: Token = tokenizer.getCurrent();
                const tokenText: string = token.getText();
                const lowerTokenText: string = tokenText.toLowerCase();
                switch (lowerTokenText)
                {
                    case "null":
                        result = JsonDocumentNull.create(token);
                        if (tokenText !== lowerTokenText)
                        {
                            onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected ${quote(lowerTokenText)}, but found ${quote(tokenText)} instead.`));
                        }
                        tokenizer.next();
                        break;

                    case "true":
                    case "false":
                        result = JsonDocumentBoolean.create(token);
                        if (tokenText !== lowerTokenText)
                        {
                            onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected ${quote(lowerTokenText)}, but found ${quote(tokenText)} instead.`));
                        }
                        tokenizer.next();
                        break;

                    default:
                        onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected ${expected}, but found ${quote(tokenText)} instead.`));
                        break;
                }
            }
            else
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected ${expected}, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`));
            }

            return result;
        });
    }

    public parseString(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected: string = "JSON string"): Result<JsonDocumentString | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let result: JsonDocumentString | undefined;
            if (!tokenizer.hasCurrent())
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Missing ${expected}.`));
            }
            else
            {
                let startQuote: Token | undefined;
                let startQuoteRange: DocumentRange | undefined;
                switch (tokenizer.getCurrent().getType())
                {
                    case TokenType.SingleQuote:
                    case TokenType.DoubleQuote:
                    case TokenType.Backtick:
                        startQuoteRange = tokenizer.getCurrentRange();
                        startQuote = tokenizer.takeCurrent();
                        break;

                    default:
                        onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected ${expected}, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`));
                        break;
                }
                
                if (startQuote !== undefined && startQuoteRange !== undefined)
                {
                    const tokens: List<Token> = List.create([startQuote]);
                    let escaped: boolean = false;
                    let hasEndQuote: boolean = false;
                    while (true)
                    {
                        if (!tokenizer.hasCurrent())
                        {
                            onIssue(
                                DocumentIssue.create(
                                    DocumentRange.create(
                                        startQuoteRange.getStart(),
                                        tokenizer.getCurrentRange().getAfterEnd(),
                                    ),
                                    `Missing JSON string end quote (${startQuote.getText()}).`,
                                ),
                            );
                            break;
                        }

                        let done: boolean = false;
                        switch (tokenizer.getCurrent().getType())
                        {
                            case TokenType.NewLine:
                                onIssue(
                                    DocumentIssue.create(
                                        DocumentRange.create(
                                            startQuoteRange.getStart(),
                                            tokenizer.getCurrentRange().getStart(),
                                        ),
                                        "JSON strings cannot contain newlines.",
                                    ),
                                );
                                done = true;
                                escaped = false;
                                break;

                            case TokenType.SingleQuote:
                            case TokenType.DoubleQuote:
                            case TokenType.Backtick:
                                tokens.add(tokenizer.getCurrent());
                                if (!escaped && startQuote.getType() === tokenizer.getCurrent().getType())
                                {
                                    hasEndQuote = true;
                                    done = true;
                                }
                                tokenizer.next();
                                escaped = false;
                                break;

                            case TokenType.Backslash:
                                tokens.add(tokenizer.getCurrent());
                                escaped = !escaped;
                                if (!escaped)
                                {
                                    tokenizer.next();
                                }
                                else
                                {
                                    const backslashRange: DocumentRange = tokenizer.getCurrentRange();
                                    if (!tokenizer.next())
                                    {
                                        onIssue(
                                            DocumentIssue.create(
                                                backslashRange,
                                                "Incomplete escape sequence.",
                                            ),
                                        );
                                    }
                                }
                                break;

                            default:
                                tokens.add(tokenizer.takeCurrent());
                                escaped = false;
                                break;
                        }

                        if (done)
                        {
                            break;
                        }
                    }

                    result = JsonDocumentString.create(tokens, hasEndQuote);
                }
            }

            return result;
        });
    }

    /**
     * Parse a {@link JsonDocumentNumber} from the provided text. If a number can't be parsed, then
     * undefined will be returned.
     * @param text The text to parse.
     * @param onIssue The function that will be invoked if any issues are encountered.
     * @param expected A description of what is expected.
     */
    public parseNumber(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected: string = "JSON number"): Result<JsonDocumentValue | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let result: JsonDocumentValue | undefined;
            if (!tokenizer.hasCurrent())
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Missing ${expected}.`));
            }
            else
            {
                const startRange: DocumentRange = tokenizer.getCurrentRange();
                const tokens: List<Token> = List.create();
                if (tokenizer.getCurrent().getType() === TokenType.Hyphen)
                {
                    tokens.add(tokenizer.takeCurrent());

                    if (!tokenizer.hasCurrent())
                    {
                        onIssue(DocumentIssue.create(startRange, `Missing ${expected}.`));
                        if (tokens.any())
                        {
                            result = JsonDocumentUnknown.create(tokens);
                        }
                    }
                }

                if (tokenizer.hasCurrent())
                {
                    let foundIntegerDigits: boolean = false;
                    if (tokenizer.getCurrent().getType() === TokenType.Digits)
                    {
                        foundIntegerDigits = true;
                        tokens.add(tokenizer.takeCurrent());
                    }
                    else
                    {
                        onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected integer digits, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`));
                    }

                    let foundFractionalDigits: boolean = false;
                    if (tokenizer.hasCurrent() && tokenizer.getCurrent().getType() === TokenType.Period)
                    {
                        tokens.add(tokenizer.takeCurrent());

                        if (!tokenizer.hasCurrent())
                        {
                            onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), "Missing fractional digits."));
                        }
                        else if (tokenizer.getCurrent().getType() === TokenType.Digits)
                        {
                            foundFractionalDigits = true;
                            tokens.add(tokenizer.takeCurrent());
                        }
                    }

                    if (tokenizer.hasCurrent() && tokenizer.getCurrent().getText().toLowerCase() === "e")
                    {
                        tokens.add(tokenizer.takeCurrent());

                        if (!tokenizer.hasCurrent())
                        {
                            onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), "Missing exponent digits."));
                        }
                        else
                        {
                            if (tokenizer.getCurrent().getType() === TokenType.PlusSign ||
                                tokenizer.getCurrent().getType() === TokenType.Hyphen)
                            {
                                tokens.add(tokenizer.takeCurrent());
                            }

                            if (!tokenizer.hasCurrent())
                            {
                                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), "Missing exponent digits."));
                            }
                            else if (tokenizer.getCurrent().getType() !== TokenType.Digits)
                            {
                                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected exponent digits, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`));
                            }
                            else
                            {
                                tokens.add(tokenizer.takeCurrent());
                            }
                        }
                    }

                    if (foundIntegerDigits || foundFractionalDigits)
                    {
                        result = JsonDocumentNumber.create(tokens);
                    }
                    else if (tokens.any())
                    {
                        result = JsonDocumentUnknown.create(tokens);
                    }
                }
            }

            return result;
        });
    }

    /**
     * Parse a {@link JsonDocumentArray} from the provided text. If an array can't be parsed, then
     * undefined will be returned.
     * @param text The text to parse.
     * @param onIssue The function that will be invoked if any issues are encountered.
     * @param expected A description of what is expected.
     */
    public parseArray(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected: string = "JSON array"): Result<JsonDocumentArray | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let result: JsonDocumentArray | undefined;

            if (!tokenizer.hasCurrent())
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Missing ${expected}.`));
            }
            else if (tokenizer.getCurrent().getType() !== TokenType.LeftSquareBrace)
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected ${expected}, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`));
            }
            else
            {
                const startTokenRange: DocumentRange = tokenizer.getCurrentRange();
                const tokensAndValues: List<Token | JsonDocumentValue> = List.create<Token | JsonDocumentValue>([tokenizer.takeCurrent()]);

                JsonDocumentParser.skipWhitespace(tokenizer, tokensAndValues);

                let expectComma: boolean = false;
                while (tokenizer.hasCurrent() && tokenizer.getCurrent().getType() !== TokenType.RightSquareBrace)
                {
                    if (expectComma && tokenizer.getCurrent().getType() === TokenType.Comma)
                    {
                        expectComma = false;
                        tokensAndValues.add(tokenizer.takeCurrent());
                        JsonDocumentParser.skipWhitespace(tokenizer, tokensAndValues);
                    }

                    if (!tokenizer.hasCurrent())
                    {
                        onIssue(DocumentIssue.create(
                            tokenizer.getCurrentRange(),
                            `Missing array element.`,
                        ));
                    }
                    else
                    {
                        const elementValueStart: DocumentPosition = tokenizer.getCurrentRange().getStart();
                        const elementValue: JsonDocumentValue | undefined = this.parseValue(tokenizer, onIssue, "JSON array element value").await();
                        if (isUndefinedOrNull(elementValue))
                        {
                            if (tokenizer.getCurrent().getType() !== TokenType.RightSquareBrace)
                            {
                                tokensAndValues.add(tokenizer.takeCurrent());
                            }
                        }
                        else
                        {
                            tokensAndValues.add(elementValue);

                            if (expectComma)
                            {
                                onIssue(DocumentIssue.create(
                                    DocumentRange.create(elementValueStart, tokenizer.getCurrentRange().getStart()),
                                    `Expected array element separator (','), but found ${escapeAndQuote(tokensAndValues.last().await().getText())} instead.`,
                                ));
                            }
                            expectComma = true;

                            JsonDocumentParser.skipWhitespace(tokenizer, tokensAndValues);
                        }
                    }
                }

                if (!tokenizer.hasCurrent())
                {
                    onIssue(DocumentIssue.create(
                        DocumentRange.create(startTokenRange.getStart(), tokenizer.getCurrentRange().getAfterEnd()),
                        "Missing array closing brace (']').",
                    ));
                }
                else if (tokenizer.getCurrent().getType() !== TokenType.RightSquareBrace)
                {
                    onIssue(DocumentIssue.create(
                        DocumentRange.create(startTokenRange.getStart(), tokenizer.getCurrentRange().getAfterEnd()),
                        `Expected array closing brace (']'), but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`,
                    ));
                }
                else
                {
                    tokensAndValues.add(tokenizer.takeCurrent());
                }

                result = JsonDocumentArray.create(tokensAndValues);
            }

            return result;
        });
    }

    /**
     * Parse a {@link JsonDocumentObject} from the provided text. If an object can't be parsed, then
     * undefined will be returned.
     * @param text The text to parse.
     * @param onIssue The function that will be invoked if any issues are encountered.
     * @param expected A description of what is expected.
     */
    public parseObject(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected: string = "JSON object"): Result<JsonDocumentObject | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let result: JsonDocumentObject | undefined;

            if (!tokenizer.hasCurrent())
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Missing ${expected}.`));
            }
            else if (tokenizer.getCurrent().getType() !== TokenType.LeftCurlyBracket)
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected ${expected}, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`));
            }
            else
            {
                const startTokenRange: DocumentRange = tokenizer.getCurrentRange();
                const tokensValuesAndProperties: List<Token | JsonDocumentValue | JsonDocumentProperty> = List.create();
                tokensValuesAndProperties.add(tokenizer.takeCurrent());

                JsonDocumentParser.skipWhitespace(tokenizer, tokensValuesAndProperties);

                while (tokenizer.hasCurrent() && tokenizer.getCurrent().getType() !== TokenType.RightCurlyBracket)
                {
                    const property: JsonDocumentProperty | undefined = this.parseProperty(tokenizer, onIssue).await();
                    if (isUndefinedOrNull(property))
                    {
                        tokensValuesAndProperties.add(tokenizer.takeCurrent());
                    }
                    else
                    {
                        tokensValuesAndProperties.add(property);
                    }

                    JsonDocumentParser.skipWhitespace(tokenizer, tokensValuesAndProperties);

                    if (tokenizer.hasCurrent() && tokenizer.getCurrent().getType() === TokenType.Comma)
                    {
                        tokensValuesAndProperties.add(tokenizer.takeCurrent());
                        JsonDocumentParser.skipWhitespace(tokenizer, tokensValuesAndProperties);

                        if (tokenizer.hasCurrent() && tokenizer.getCurrent().getType() === TokenType.RightCurlyBracket)
                        {
                            onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected JSON object property, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`));
                        }
                    }
                }

                if (!tokenizer.hasCurrent())
                {
                    onIssue(DocumentIssue.create(
                        DocumentRange.create(startTokenRange.getStart(), tokenizer.getCurrentRange().getAfterEnd()),
                        "Missing JSON object closing bracket ('}').",
                    ));
                }
                else
                {
                    tokensValuesAndProperties.add(tokenizer.takeCurrent());
                }

                result = JsonDocumentObject.create(tokensValuesAndProperties);
            }

            return result;
        });
    }

    /**
     * Parse a {@link JsonDocumentProperty} from the provided text. If a property can't be parsed,
     * then undefined will be returned.
     * @param text The text to parse.
     * @param onIssue The function that will be invoked if any issues are encountered.
     */
    public parseProperty(text: string | JavascriptIterable<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocumentProperty | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let result: JsonDocumentProperty | undefined;

            if (!tokenizer.hasCurrent())
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Missing JSON object property name.`));
            }
            else
            {
                const propertyName: Token | JsonDocumentValue | undefined = this.parseString(tokenizer, onIssue, "JSON object property name").await();
                if (!isUndefinedOrNull(propertyName))
                {
                    const tokensAndValues: List<Token | JsonDocumentValue> = List.create();

                    tokensAndValues.add(propertyName);
                    JsonDocumentParser.skipWhitespace(tokenizer, tokensAndValues);

                    if (!tokenizer.hasCurrent())
                    {
                        onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), "Missing JSON object property separator (':')."));
                    }
                    else if (tokenizer.getCurrent().getType() !== TokenType.Colon)
                    {
                        onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected JSON object property separator (':'), but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`));
                    }
                    else
                    {
                        tokensAndValues.add(tokenizer.takeCurrent());
                        JsonDocumentParser.skipWhitespace(tokenizer, tokensAndValues);

                        const propertyValue: JsonDocumentValue | undefined = this.parseValue(tokenizer, onIssue, "JSON object property value").await();
                        if (!isUndefinedOrNull(propertyValue))
                        {
                            tokensAndValues.add(propertyValue);
                        }
                    }
                    
                    result = JsonDocumentProperty.create(tokensAndValues);
                }
            }

            return result;
        });
    }

    private static skipWhitespace(tokenizer: DocumentTokenizer, tokensAndValues: List<Token | JsonDocumentValue>): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "tokenizer");
        Pre.condition.assertTrue(tokenizer.hasStarted(), "tokenizer.hasStarted()");
        Pre.condition.assertNotUndefinedAndNotNull(tokensAndValues, "tokensAndValues");

        let done: boolean = false;
        while (!done)
        {
            if (!tokenizer.hasCurrent())
            {
                done = true;
            }
            else
            {
                
                switch (tokenizer.getCurrent().getType())
                {
                    case TokenType.NewLine:
                    case TokenType.CarriageReturn:
                    case TokenType.Whitespace:
                        tokensAndValues.add(tokenizer.takeCurrent());
                        break;

                    default:
                        done = true;
                        break;
                }
            }
        }
    }
}