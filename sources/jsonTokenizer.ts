import { DocumentIterator } from "./documentIterator";
import { DocumentPosition } from "./documentPosition";
import { DocumentRange } from "./documentRange";
import { IteratorBase } from "./iteratorBase";
import { JsonIssue } from "./jsonIssue";
import { JsonToken } from "./jsonToken";
import { ParseError } from "./parseError";
import { Pre } from "./pre";
import { StringIterator } from "./stringIterator";
import { escapeAndQuote, isDigit, isLetter, isWhitespace } from "./strings";
import { isString, isUndefinedOrNull } from "./types";

export class JsonTokenizer extends IteratorBase<JsonToken>
{
    private readonly characterIterator: DocumentIterator;
    private currentToken: JsonToken | undefined;
    private currentRange: DocumentRange | undefined;
    private started: boolean;
    private readonly issueReporter: (issue: JsonIssue) => void;

    private constructor(characterIterator: DocumentIterator, issueReporter?: (issue: JsonIssue) => void)
    {
        Pre.condition.assertNotUndefinedAndNotNull(characterIterator, "characterIterator");

        super();

        this.characterIterator = characterIterator;
        this.started = false;
        if (isUndefinedOrNull(issueReporter))
        {
            issueReporter = JsonTokenizer.defaultIssueReporter;
        }
        this.issueReporter = issueReporter;
    }

    /**
     * Create a new {@link JsonTokenizer} that tokenizes the provided characters.
     * @param characters The characters to tokenize.
     * @param issueReporter The function that will be used to report {@link JsonIssue}s.
     */
    public static create(characters: string, issueReporter?: (issue: JsonIssue) => void): JsonTokenizer
    {
        Pre.condition.assertNotUndefinedAndNotNull(characters, "characters");

        return new JsonTokenizer(DocumentIterator.create(StringIterator.create(characters)), issueReporter);
    }

    private static defaultIssueReporter(issue: JsonIssue): void
    {
        Pre.condition.assertNotUndefinedAndNotNull(issue, "issue");

        throw new ParseError(issue.getRange(), issue.getMessage());
    }

    public override next(): boolean
    {
        this.characterIterator.start();
        this.started = true;

        if (!this.hasCurrentCharacter())
        {
            this.currentToken = undefined;
            this.currentRange = undefined;
        }
        else
        {
            const startPosition: DocumentPosition = this.characterIterator.getPosition();
            switch (this.characterIterator.getCurrent())
            {
                case "{":
                    this.currentToken = JsonToken.leftCurlyBrace();
                    this.currentRange = DocumentRange.create(startPosition);
                    this.nextCharacter();
                    break;

                case "}":
                    this.currentToken = JsonToken.rightCurlyBrace();
                    this.currentRange = DocumentRange.create(startPosition);
                    this.nextCharacter();
                    break;

                case "[":
                    this.currentToken = JsonToken.leftSquareBracket();
                    this.currentRange = DocumentRange.create(startPosition);
                    this.nextCharacter();
                    break;

                case "]":
                    this.currentToken = JsonToken.rightSquareBracket();
                    this.currentRange = DocumentRange.create(startPosition);
                    this.nextCharacter();
                    break;

                case `"`:
                case `'`:
                    this.currentToken = this.readString();
                    break;

                case `,`:
                    this.currentToken = JsonToken.comma();
                    this.currentRange = DocumentRange.create(startPosition);
                    this.nextCharacter();
                    break;

                case `:`:
                    this.currentToken = JsonToken.colon();
                    this.currentRange = DocumentRange.create(startPosition);
                    this.nextCharacter();
                    break;

                case `-`:
                    this.readNumber();
                    break;

                default:
                    if (isWhitespace(this.getCurrentCharacter()))
                    {
                        this.currentToken = this.readWhitespace();
                    }
                    else if (isLetter(this.getCurrentCharacter()))
                    {
                        this.readLetters();
                    }
                    else if (isDigit(this.getCurrentCharacter()))
                    {
                        this.readNumber();
                    }
                    else
                    {
                        this.currentRange = DocumentRange.create(startPosition);
                        this.reportError({
                            message: `Unknown JSON character: ${escapeAndQuote(this.getCurrentCharacter())}`,
                            range: this.currentRange,
                        });
                        this.currentToken = JsonToken.unknown(this.takeCurrentCharacter());
                    }
                    break;
            }
        }
        return this.hasCurrent();
    }

    private reportError(message: string, range: DocumentRange): void;
    private reportError(parameters: { message: string, range: DocumentRange }): void;
    private reportError(messageOrParameters: string | { message: string, range: DocumentRange }, range?: DocumentRange): void
    {
        let message: string;
        if (isString(messageOrParameters))
        {
            message = messageOrParameters;
        }
        else
        {
            message = messageOrParameters.message;
            range = messageOrParameters.range;
        }
        Pre.condition.assertNotEmpty(message, "message");
        Pre.condition.assertNotUndefinedAndNotNull(range, "range");

        this.issueReporter(JsonIssue.create(message, range));
    }

    private reportMissingValueError(missingValue: string, range: DocumentRange): void;
    private reportMissingValueError(parameters: { missingValue: string, range: DocumentRange }): void;
    private reportMissingValueError(missingValueOrParameters: string | { missingValue: string, range: DocumentRange }, range?: DocumentRange): void
    {
        let missingValue: string;
        if (isString(missingValueOrParameters))
        {
            missingValue = missingValueOrParameters;
        }
        else
        {
            missingValue = missingValueOrParameters.missingValue;
            range = missingValueOrParameters.range;
        }
        Pre.condition.assertNotEmpty(missingValue, "missingValue");
        Pre.condition.assertNotUndefinedAndNotNull(range, "range");

        this.reportError(`Missing ${missingValue}.`, range);
    }

    private reportWrongValueError(expected: string, actual: string, range: DocumentRange): void;
    private reportWrongValueError(parameters: { expected: string, actual: string, range: DocumentRange }): void;
    private reportWrongValueError(expectedOrParameters: string | { expected: string, actual: string, range: DocumentRange }, actual?: string, range?: DocumentRange): void
    {
        let expected: string;
        if (isString(expectedOrParameters))
        {
            expected = expectedOrParameters;
        }
        else
        {
            expected = expectedOrParameters.expected;
            actual = expectedOrParameters.actual;
            range = expectedOrParameters.range;
        }
        Pre.condition.assertNotEmpty(expected, "expected");
        Pre.condition.assertNotEmpty(actual, "actual");
        Pre.condition.assertNotUndefinedAndNotNull(range, "range");

        this.reportError(`Expected ${expected}, but found ${escapeAndQuote(actual)} instead.`, range);
    } 

    private hasCurrentCharacter(): boolean
    {
        return this.characterIterator.hasCurrent();
    }

    private getCurrentCharacter(): string
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");

        return this.characterIterator.getCurrent();
    }

    private nextCharacter(): boolean
    {
        return this.characterIterator.next();
    }

    private takeCurrentCharacter(): string
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");

        return this.characterIterator.takeCurrent();
    }

    private getCurrentPosition(): DocumentPosition
    {
        return this.characterIterator.getPosition();
    }

    private getPreviousPosition(): DocumentPosition
    {
        return this.getCurrentPosition().plusColumns(-1);
    }

    private readWhitespace(): JsonToken
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
        Pre.condition.assertTrue(isWhitespace(this.getCurrentCharacter()), "isWhitespace(this.getCurrentCharacter())");

        let text: string = this.takeCurrentCharacter();
        while (this.hasCurrentCharacter() && isWhitespace(this.getCurrentCharacter()))
        {
            text += this.takeCurrentCharacter();
        }
        return JsonToken.whitespace(text);
    }

    private readLetters(): void
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
        Pre.condition.assertTrue(isLetter(this.getCurrentCharacter()), "isLetter(this.getCurrentCharacter())");

        let text: string = this.takeCurrentCharacter();
        while (this.hasCurrentCharacter() && isLetter(this.getCurrentCharacter()))
        {
            text += this.takeCurrentCharacter();
        }
        const afterEnd: DocumentPosition = this.getCurrentPosition();
        this.currentRange = DocumentRange.create(afterEnd, -text.length);

        switch (text.toLowerCase())
        {
            case "null":
                this.currentToken = JsonToken.null(text);
                if (text !== "null")
                {
                    this.reportWrongValueError({
                        expected: `null`,
                        actual: text,
                        range: this.currentRange,
                    });
                }
                break;

            case "true":
                this.currentToken = JsonToken.boolean(text);
                if (text !== "true")
                {
                    this.reportWrongValueError({
                        expected: `true`,
                        actual: text,
                        range: this.currentRange,
                    });
                }
                break;

            case "false":
                this.currentToken = JsonToken.boolean(text);
                if (text !== "false")
                {
                    this.reportWrongValueError({
                        expected: `false`,
                        actual: text,
                        range: this.currentRange,
                    });
                }
                break;

            default:
                this.reportError({
                    message: `Unknown JSON characters: ${escapeAndQuote(text)}`,
                    range: this.currentRange,
                });
                this.currentToken = JsonToken.unknown(text);
                break;
        }
    }

    private readString(): JsonToken
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
        Pre.condition.assertOneOf([`"`, `'`], this.getCurrentCharacter(), "this.getCurrentCharacter()");

        const start: DocumentPosition = this.getCurrentPosition();
        let end: DocumentPosition | undefined = undefined;
        let hasEndQuote: boolean = false;
        let escaped: boolean = false;
        const startQuote: string = this.takeCurrentCharacter();
        let text: string = startQuote;
        while (this.hasCurrentCharacter() && !hasEndQuote)
        {
            switch (this.getCurrentCharacter())
            {
                case `"`:
                    if (escaped)
                    {
                        escaped = false;
                    }
                    else
                    {
                        end = this.getCurrentPosition();
                        hasEndQuote = true;
                    }
                    text += this.takeCurrentCharacter();
                    break;

                case `\\`:
                    text += this.takeCurrentCharacter();
                    escaped = !escaped;
                    break;

                default:
                    const codePoint: number | undefined = this.getCurrentCharacter().codePointAt(0);
                    let validCodePoint: boolean = false;
                    if (codePoint !== undefined && 0x20 <= codePoint)
                    {
                        if (codePoint <= 0x21)
                        {
                            validCodePoint = true;
                        }
                        else if (0x23 <= codePoint)
                        {
                            if (codePoint <= 0x5B)
                            {
                                validCodePoint = true;
                            }
                            else if (0x5D <= codePoint)
                            {
                                if (codePoint <= 0x10FFFF)
                                {
                                    validCodePoint = true;
                                }
                            }
                        }
                    }

                    if (!validCodePoint)
                    {
                        this.reportError({
                            message: `Invalid string character: ${escapeAndQuote(this.getCurrentCharacter())} (${codePoint}).`,
                            range: DocumentRange.create(this.getCurrentPosition(), 1),
                        });
                    }

                    escaped = false;
                    text += this.takeCurrentCharacter();
                    break;
            }
        }

        if (!hasEndQuote)
        {
            end = this.getCurrentPosition();
            this.reportMissingValueError({
                missingValue: `string end quote: ${escapeAndQuote(startQuote)} (${startQuote.codePointAt(0)})`,
                range: DocumentRange.create(start, end),
            });
        }

        return JsonToken.string(text);
    }

    private readNumber(): void
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
        Pre.condition.assertTrue('-' === this.getCurrentCharacter() || isDigit(this.getCurrentCharacter()), "'-' == this.getCurrentCharacter() || isDigit(this.getCurrentCharacter()");

        const start: DocumentPosition = this.getCurrentPosition();

        let done: boolean = false;

        let text: string = "";
        if (this.getCurrentCharacter() === "-")
        {
            text += this.takeCurrentCharacter();

            if (!this.hasCurrentCharacter())
            {
                this.reportMissingValueError({
                    missingValue: `integer portion of number`,
                    range: DocumentRange.create(start, this.getCurrentPosition()),
                });
                this.currentToken = JsonToken.unknown(text);
                done = true;
            }
            else if (!isDigit(this.getCurrentCharacter()))
            {
                this.reportWrongValueError({
                    expected: `integer portion of number`,
                    actual: this.getCurrentCharacter(),
                    range: DocumentRange.create(start, this.getCurrentPosition()),
                });
                this.currentToken = JsonToken.unknown(text);
                done = true;
            }
        }

        if (!done)
        {
            text += this.takeCurrentCharacter();
            if (!text.endsWith("0"))
            {
                while (this.hasCurrentCharacter() && isDigit(this.getCurrentCharacter()))
                {
                    text += this.takeCurrentCharacter();
                }
            }

            if (this.hasCurrentCharacter() && this.getCurrentCharacter() === ".")
            {
                text += this.takeCurrentCharacter();

                if (!this.hasCurrentCharacter())
                {
                    this.reportMissingValueError({
                        missingValue: "fractional portion of number",
                        range: DocumentRange.create(start, this.getCurrentPosition()),
                    });
                }
                else if (!isDigit(this.getCurrentCharacter()))
                {
                    this.reportWrongValueError({
                        expected: "fractional portion of number",
                        actual: this.getCurrentCharacter(),
                        range: DocumentRange.create(start, this.getCurrentPosition()),
                    });
                }

                text += this.takeCurrentCharacter();
                while (this.hasCurrentCharacter() && isDigit(this.getCurrentCharacter()))
                {
                    text += this.takeCurrentCharacter();
                }
            }

            if (this.hasCurrentCharacter() && (this.getCurrentCharacter() === "e" || this.getCurrentCharacter() === "E"))
            {
                text += this.takeCurrentCharacter();

                if (!this.hasCurrentCharacter())
                {
                    this.reportMissingValueError({
                        missingValue: "exponent portion of number",
                        range: DocumentRange.create(start, this.getCurrentPosition()),
                    });
                }
                else
                {
                    if (this.getCurrentCharacter() === "-" || this.getCurrentCharacter() === "+")
                    {
                        text += this.takeCurrentCharacter();
                    }
                    
                    if (!this.hasCurrentCharacter())
                    {
                        this.reportMissingValueError({
                            missingValue: "exponent portion of number",
                            range: DocumentRange.create(start, this.getCurrentPosition()),
                        });
                    }
                    else if (!isDigit(this.getCurrentCharacter()))
                    {
                        this.reportWrongValueError({
                            expected: "exponent portion of number",
                            actual: this.getCurrentCharacter(),
                            range: DocumentRange.create(start, this.getCurrentPosition())
                        });
                    }
                    else
                    {
                        text += this.takeCurrentCharacter();
                        while (this.hasCurrentCharacter() && isDigit(this.getCurrentCharacter()))
                        {
                            text += this.takeCurrentCharacter();
                        }
                    }
                }
            }

            this.currentToken = JsonToken.number(text);
            this.currentRange = DocumentRange.create(start, this.getPreviousPosition());
        }
    }

    public override hasStarted(): boolean
    {
        return this.started;
    }

    public override hasCurrent(): boolean
    {
        return this.currentToken !== undefined;
    }

    public override getCurrent(): JsonToken
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.currentToken!;
    }

    public getCurrentRange(): DocumentRange
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.currentRange!;
    }
}