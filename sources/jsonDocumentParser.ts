import { DocumentIssue } from "./documentIssue";
import { JsonDocumentSegment } from "./jsonDocumentSegment";
import { Result } from "./result";
import { Tokenizer } from "./tokenizer";
import { Iterator } from "./iterator";
import { Pre } from "./pre";
import { ParseError } from "./parseError";
import { isUndefinedOrNull } from "./types";
import { DocumentTokenizer } from "./documentTokenizer";
import { escapeAndQuote, quote } from "./strings";
import { DocumentRange } from "./documentRange";
import { TokenType } from "./tokenType";
import { Post } from "./post";
import { Token } from "./token";
import { JsonDocumentWhitespace } from "./jsonDocumentWhitespace";
import { List } from "./list";
import { JsonDocumentUnknown } from "./JsonDocumentUnknown";
import { JsonDocumentNull } from "./jsonDocumentNull";
import { JsonDocumentBoolean } from "./jsonDocumentBoolean";
import { JsonDocumentString } from "./jsonDocumentString";
import { JsonDocumentNumber } from "./jsonDocumentNumber";

export class JsonDocumentParser
{
    private constructor()
    {
    }

    public static create(): JsonDocumentParser
    {
        return new JsonDocumentParser();
    }

    private static getTokenizer(text: string | Iterator<string> | Tokenizer): DocumentTokenizer
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

    public parseSegment(text: string | Iterator<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocumentSegment | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let result: JsonDocumentSegment | undefined;

            while (result === undefined && tokenizer.hasCurrent())
            {
                switch (tokenizer.getCurrent().getType())
                {
                    // case TokenType.LeftSquareBrace:
                    //     result = this.parseArray(tokenizer, onIssue).await();
                    //     break;

                    // case TokenType.LeftCurlyBracket:
                    //     result = this.parseObject(tokenizer, onIssue).await();
                    //     break;

                    case TokenType.SingleQuote:
                    case TokenType.DoubleQuote:
                    case TokenType.Backtick:
                        result = this.parseString(tokenizer, onIssue).await();
                        break;

                    case TokenType.Letters:
                        result = this.parseNullOrBoolean(tokenizer, onIssue, "JSON segment").await();
                        break;
                    
                    case TokenType.Digits:
                    case TokenType.Hyphen:
                    case TokenType.Period:
                        result = this.parseNumber(tokenizer, onIssue).await();
                        break;

                    case TokenType.Whitespace:
                    case TokenType.NewLine:
                    case TokenType.CarriageReturn:
                        result = this.parseWhitespace(tokenizer, onIssue).await();
                        break;

                    default:
                        const issueRange: DocumentRange = tokenizer.getCurrentRange();
                        const token: Token = tokenizer.getCurrent();
                        const issueMessage: string = `Expected JSON segment, but found ${escapeAndQuote(token.getText())} instead.`;
                        onIssue(DocumentIssue.create(issueRange, issueMessage));
                        tokenizer.next();
                        result = JsonDocumentUnknown.create(token);
                        break;
                }
            }

            if (result === undefined)
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), "Missing JSON segment."));
            }

            return result;
        });
    }

    public parseWhitespace(text: string | Iterator<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void): Result<JsonDocumentWhitespace | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let done: boolean = false;
            const tokens: List<Token> = List.create();
            while (tokenizer.hasCurrent() && !done)
            {
                switch (tokenizer.getCurrent().getType())
                {
                    case TokenType.Whitespace:
                    case TokenType.NewLine:
                    case TokenType.CarriageReturn:
                        tokens.add(tokenizer.takeCurrent());
                        break;

                    default:
                        done = true;
                        break;
                }
            }

            let result: JsonDocumentWhitespace | undefined;
            if (!tokens.any())
            {
                if (!tokenizer.hasCurrent())
                {
                    onIssue(DocumentIssue.create(
                        tokenizer.getCurrentRange(),
                        "Missing whitespace.",
                    ));
                }
                else
                {
                    onIssue(DocumentIssue.create(
                        tokenizer.getCurrentRange(),
                        `Expected whitespace, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`),
                    );
                }
            }
            else
            {
                result = JsonDocumentWhitespace.create(tokens);
            }

            return result;
        });
    }

    public parseNullOrBoolean(text: string | Iterator<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected: string = "JSON null or boolean"): Result<JsonDocumentSegment | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let result: JsonDocumentSegment | undefined;
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
                        break;

                    case "true":
                    case "false":
                        result = JsonDocumentBoolean.create(token);
                        if (tokenText !== lowerTokenText)
                        {
                            onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected ${quote(lowerTokenText)}, but found ${quote(tokenText)} instead.`));
                        }
                        break;

                    default:
                        result = JsonDocumentUnknown.create(token);
                        onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected ${expected}, but found ${quote(tokenText)} instead.`));
                        break;
                }
                tokenizer.next();
            }
            else
            {
                onIssue(DocumentIssue.create(tokenizer.getCurrentRange(), `Expected ${expected}, but found ${escapeAndQuote(tokenizer.getCurrent().getText())} instead.`));
            }

            return result;
        });
    }

    public parseString(text: string | Iterator<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected: string = "JSON string"): Result<JsonDocumentString | undefined>
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
                                        tokenizer.getCurrentRange().getStart(),
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
    public parseNumber(text: string | Iterator<string> | Tokenizer, onIssue?: (issue: DocumentIssue) => void, expected: string = "JSON number"): Result<JsonDocumentSegment | undefined>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const tokenizer: DocumentTokenizer = JsonDocumentParser.getTokenizer(text);
            onIssue = JsonDocumentParser.getOnIssue(onIssue);

            let result: JsonDocumentSegment | undefined;
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
}