import { IteratorBase } from "./iteratorBase";
import { JsonNumber } from "./jsonNumber";
import { JsonString } from "./jsonString";
import { JsonToken } from "./jsonToken";
import { MissingValueParseError, ParseError, WrongValueParseError } from "./parseError";
import { Pre } from "./pre";
import { StringIterator } from "./stringIterator";
import { escapeAndQuote, isDigit, isLetter, isWhitespace } from "./strings";

export class JsonTokenizer extends IteratorBase<JsonToken>
{
    private readonly characterIterator: StringIterator;
    private currentToken: JsonToken | undefined;
    private started: boolean;

    private constructor(characterIterator: StringIterator)
    {
        Pre.condition.assertNotUndefinedAndNotNull(characterIterator, "characterIterator");

        super();

        this.characterIterator = characterIterator;
        this.started = false;
    }

    /**
     * Create a new {@link JsonTokenizer} that tokenizes the provided characters.
     * @param characters The characters to tokenize.
     */
    public static create(characters: string): JsonTokenizer
    {
        Pre.condition.assertNotUndefinedAndNotNull(characters, "characters");

        return new JsonTokenizer(StringIterator.create(characters));
    }

    public override next(): boolean
    {
        this.characterIterator.start();
        this.started = true;

        if (!this.hasCurrentCharacter())
        {
            this.currentToken = undefined;
        }
        else
        {
            switch (this.characterIterator.getCurrent())
            {
                case "{":
                    this.currentToken = JsonToken.leftCurlyBrace();
                    this.nextCharacter();
                    break;

                case "}":
                    this.currentToken = JsonToken.rightCurlyBrace();
                    this.nextCharacter();
                    break;

                case "[":
                    this.currentToken = JsonToken.leftSquareBracket();
                    this.nextCharacter();
                    break;

                case "]":
                    this.currentToken = JsonToken.rightSquareBracket();
                    this.nextCharacter();
                    break;

                case `"`:
                case `'`:
                    this.currentToken = this.readString();
                    break;

                case `,`:
                    this.currentToken = JsonToken.comma();
                    this.nextCharacter();
                    break;

                case `:`:
                    this.currentToken = JsonToken.colon();
                    this.nextCharacter();
                    break;

                case `-`:
                    this.currentToken = this.readNumber();
                    break;

                default:
                    if (isWhitespace(this.getCurrentCharacter()))
                    {
                        this.currentToken = this.readWhitespace();
                    }
                    else if (isLetter(this.getCurrentCharacter()))
                    {
                        this.currentToken = this.readLetters();
                    }
                    else if (isDigit(this.getCurrentCharacter()))
                    {
                        this.currentToken = this.readNumber();
                    }
                    else
                    {
                        this.currentToken = JsonToken.unknown(this.takeCurrentCharacter());
                    }
            }
        }
        return this.hasCurrent();
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

    private readLetters(): JsonToken
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
        Pre.condition.assertTrue(isLetter(this.getCurrentCharacter()), "isLetter(this.getCurrentCharacter())");

        let text: string = this.takeCurrentCharacter();
        while (this.hasCurrentCharacter() && isLetter(this.getCurrentCharacter()))
        {
            text += this.takeCurrentCharacter();
        }

        let result: JsonToken;
        switch (text)
        {
            case "null":
                result = JsonToken.null();
                break;

            case "true":
                result = JsonToken.true();
                break;

            case "false":
                result = JsonToken.false();
                break;

            default:
                result = JsonToken.unknown(text);
                break;
        }

        return result;
    }

    private readString(): JsonString
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
        Pre.condition.assertOneOf([`"`, `'`], this.getCurrentCharacter(), "this.getCurrentCharacter()");

        const startQuote: string = this.takeCurrentCharacter();
        let endQuote: string | undefined = undefined;
        let escaped: boolean = false;
        let value: string = "";
        while (this.hasCurrentCharacter() && endQuote === undefined)
        {
            switch (this.getCurrentCharacter())
            {
                case `"`:
                    if (escaped)
                    {
                        escaped = false;
                        value += this.takeCurrentCharacter();
                    }
                    else
                    {
                        endQuote = this.takeCurrentCharacter();
                    }
                    break;

                case `\\`:
                    value += this.takeCurrentCharacter();
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
                        throw new ParseError(`Invalid string character: ${escapeAndQuote(this.getCurrentCharacter())} (${codePoint})`);
                    }

                    escaped = false;
                    value += this.takeCurrentCharacter();
                    break;
            }
        }

        if (endQuote === undefined)
        {
            throw new ParseError(`Missing string end quote: ${escapeAndQuote(startQuote)} (${startQuote.codePointAt(0)})`);
        }

        return JsonString.create(value, startQuote);
    }

    private readNumber(): JsonNumber
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
        Pre.condition.assertTrue('-' === this.getCurrentCharacter() || isDigit(this.getCurrentCharacter()), "'-' == this.getCurrentCharacter() || isDigit(this.getCurrentCharacter()");

        let text: string = "";
        if (this.getCurrentCharacter() === "-")
        {
            text += this.takeCurrentCharacter();

            if (!this.hasCurrentCharacter())
            {
                throw new MissingValueParseError("integer portion of number");
            }
            else if (!isDigit(this.getCurrentCharacter()))
            {
                throw new WrongValueParseError({
                    expected: "integer portion of number",
                    actual: escapeAndQuote(this.getCurrentCharacter()),
                });
            }
        }

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
                throw new MissingValueParseError("fractional portion of number");
            }
            else if (!isDigit(this.getCurrentCharacter()))
            {
                throw new WrongValueParseError({
                    expected: "fractional portion of number",
                    actual: escapeAndQuote(this.getCurrentCharacter()),
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
                throw new MissingValueParseError("exponent portion of number");
            }
            else if (this.getCurrentCharacter() === "-" || this.getCurrentCharacter() === "+")
            {
                text += this.takeCurrentCharacter();
            }

            if (!this.hasCurrentCharacter())
            {
                throw new MissingValueParseError("exponent portion of number");
            }
            else if (!isDigit(this.getCurrentCharacter()))
            {
                throw new WrongValueParseError({
                    expected: "exponent portion of number",
                    actual: escapeAndQuote(this.getCurrentCharacter()),
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

        const value: number = parseFloat(text);
        return JsonNumber.create(value);
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
}