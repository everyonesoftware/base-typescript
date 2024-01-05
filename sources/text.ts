import { Pre } from "./condition";
import { Iterator } from "./iterator";
import { StringIterator } from "./stringIterator";
import { isDigit, isLowercasedLetter, isUppercasedLetter, isWhitespace } from "./strings";
import { isString } from "./types";

/**
 * The different types of text tokens.
 */
export enum TextTokenType
{
    Word,
    Digits,
    Whitespace,
    Underscore,
    Dash,
    Other,
}

export class TextToken
{
    private readonly type: TextTokenType;
    private readonly text: string;

    private constructor(type: TextTokenType, text: string)
    {
        this.type = type;
        this.text = text;
    }

    /**
     * Create a new Letters {@link TextToken}.
     * @param text The text of the new {@link TextToken}.
     */
    public static word(text: string): TextToken
    {
        Pre.condition.assertNotEmpty(text, "text");

        return new TextToken(TextTokenType.Word, text);
    }

    /**
     * Create a new Digits {@link TextToken}.
     * @param text The text of the new {@link TextToken}.
     */
    public static digits(text: string): TextToken
    {
        Pre.condition.assertNotEmpty(text, "text");

        return new TextToken(TextTokenType.Digits, text);
    }

    /**
     * Create a new Whitespace {@link TextToken}.
     * @param text The text of the new {@link TextToken}.
     */
    public static whitespace(text: string): TextToken
    {
        Pre.condition.assertNotEmpty(text, "text");

        return new TextToken(TextTokenType.Whitespace, text);
    }

    /**
     * Create a new Underscore {@link TextToken}.
     */
    public static underscore(): TextToken
    {
        return new TextToken(TextTokenType.Underscore, "_");
    }

    /**
     * Create a new Dash {@link TextToken}.
     */
    public static dash(): TextToken
    {
        return new TextToken(TextTokenType.Dash, "-");
    }

    /**
     * Create a new Other {@link TextToken}.
     * @param text The text of the new {@link TextToken}.
     */
    public static other(text: string): TextToken
    {
        Pre.condition.assertNotEmpty(text, "text");

        return new TextToken(TextTokenType.Other, text);
    }

    /**
     * Get the type of this {@link TextToken}.
     */
    public getType(): TextTokenType
    {
        return this.type;
    }

    /**
     * Get the text of this {@link TextToken}.
     */
    public getText(): string
    {
        return this.text;
    }
}

export class TextTokenizer extends Iterator<TextToken>
{
    private readonly innerIterator: Iterator<string>;
    private current: TextToken | undefined;
    private started: boolean;

    private constructor(innerIterator: Iterator<string>)
    {
        super();

        this.innerIterator = innerIterator;
        this.current = undefined;
        this.started = false;
    }

    public static create(text: string | Iterator<string>): TextTokenizer
    {
        if (isString(text))
        {
            text = StringIterator.create(text);
        }
        return new TextTokenizer(text);
    }

    private readWhile(condition: (c: string) => boolean): string
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");
        Pre.condition.assertTrue(condition(this.getCurrentCharacter()), "condition(this.getCurrentCharacter())");

        let result: string = this.takeCurrentCharacter();
        while (this.hasCurrentCharacter() && condition(this.getCurrentCharacter()))
        {
            result += this.takeCurrentCharacter();
        }
        return result;
    }

    public override next(): boolean
    {
        if (!this.hasStarted())
        {
            this.started = true;
            this.innerIterator.start();
        }

        if (!this.hasCurrentCharacter())
        {
            this.current = undefined;
        }
        else
        {
            const currentCharacter: string = this.getCurrentCharacter();
            if (isLowercasedLetter(currentCharacter))
            {
                this.current = TextToken.word(this.readWhile(isLowercasedLetter));
            }
            else if (isUppercasedLetter(currentCharacter))
            {
                let text: string = this.readWhile(isUppercasedLetter);
                if (this.hasCurrentCharacter() && isLowercasedLetter(this.getCurrentCharacter()))
                {
                    text += this.readWhile(isLowercasedLetter);
                }
                this.current = TextToken.word(text);
            }
            else if (isWhitespace(currentCharacter))
            {
                this.current = TextToken.whitespace(this.readWhile(isWhitespace));
            }
            else if (isDigit(currentCharacter))
            {
                this.current = TextToken.digits(this.readWhile(isDigit));
            }
            else if (currentCharacter === "_")
            {
                this.takeCurrentCharacter();
                this.current = TextToken.underscore();
            }
            else if (currentCharacter === "-")
            {
                this.takeCurrentCharacter();
                this.current = TextToken.dash();
            }
            else
            {
                this.current = TextToken.other(this.takeCurrentCharacter());
            }
        }
        return this.hasCurrent();
    }

    private hasCurrentCharacter(): boolean
    {
        return this.innerIterator.hasCurrent();
    }

    private getCurrentCharacter(): string
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");

        return this.innerIterator.getCurrent();
    }

    private takeCurrentCharacter(): string
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");

        return this.innerIterator.takeCurrent();
    }

    public override hasStarted(): boolean
    {
        return this.started;
    }

    public override hasCurrent(): boolean
    {
        return this.current !== undefined;
    }

    public override getCurrent(): TextToken
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.current!;
    }
    
}

/**
 * Get the provided text where all letters have been converted to uppercase.
 * @param text The text to transform.
 */
export function toUppercase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    return text.toUpperCase();
}

/**
 * Get the provided text where all letters have been converted to lowercase.
 * @param text The text to transform.
 */
export function toLowercase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    return text.toLowerCase();
}

/**
 * Get the provided text where all letters have been converted to camel case. For example,
 * "hello there friend" would be returned as "helloThereFriend".
 * @param text The text to transform.
 */
export function toCamelCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();
    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;

                    result += toLowercase(current.getText());
                    insideWordSequence = true;
                }
                else
                {
                    result += toUppercase(current.getText()[0]);
                    if (current.getText().length >= 2)
                    {
                        result += current.getText().substring(1);
                    }
                }
                whitespaceBuffer = "";
                break;
            
            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    result += whitespaceBuffer;

    return result;
}

export function toPascalCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();
    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;
                    insideWordSequence = true;
                }

                result += toUppercase(current.getText()[0]);
                if (current.getText().length >= 2)
                {
                    result += current.getText().substring(1);
                }
                
                whitespaceBuffer = "";
                break;
            
            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    result += whitespaceBuffer;

    return result;
}

export function toSnakeCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();

    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;
                    insideWordSequence = true;
                }
                else
                {
                    result += "_";
                }

                result += toLowercase(current.getText());

                insideWordSequence = true;
                whitespaceBuffer = "";
                break;

            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    if (whitespaceBuffer !== "")
    {
        result += whitespaceBuffer;
        whitespaceBuffer = "";
    }

    return result;
}

export function toUpperSnakeCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();

    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;
                    insideWordSequence = true;
                }
                else
                {
                    result += "_";
                }

                result += toUppercase(current.getText());

                insideWordSequence = true;
                whitespaceBuffer = "";
                break;

            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    if (whitespaceBuffer !== "")
    {
        result += whitespaceBuffer;
        whitespaceBuffer = "";
    }

    return result;
}

export function toKebabCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();

    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;
                    insideWordSequence = true;
                }
                else
                {
                    result += "-";
                }

                result += toLowercase(current.getText());

                insideWordSequence = true;
                whitespaceBuffer = "";
                break;

            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    if (whitespaceBuffer !== "")
    {
        result += whitespaceBuffer;
        whitespaceBuffer = "";
    }

    return result;
}

export function toUpperKebabCase(text: string): string
{
    Pre.condition.assertNotUndefinedAndNotNull(text, "text");

    let result: string = "";

    const tokenizer: TextTokenizer = TextTokenizer.create(text).start();

    let insideWordSequence: boolean = false;
    let whitespaceBuffer: string = "";
    while (tokenizer.hasCurrent())
    {
        const current: TextToken = tokenizer.takeCurrent();
        switch (current.getType())
        {
            case TextTokenType.Word:
                if (!insideWordSequence)
                {
                    result += whitespaceBuffer;
                    insideWordSequence = true;
                }
                else
                {
                    result += "-";
                }

                result += toUppercase(current.getText());

                insideWordSequence = true;
                whitespaceBuffer = "";
                break;

            case TextTokenType.Digits:
                result += current.getText();
                break;

            case TextTokenType.Other:
                result += whitespaceBuffer;
                whitespaceBuffer = "";

                result += current.getText();
                insideWordSequence = false;
                break;

            case TextTokenType.Dash:
            case TextTokenType.Underscore:
            case TextTokenType.Whitespace:
                if (insideWordSequence)
                {
                    whitespaceBuffer += current.getText();
                }
                else
                {
                    result += current.getText();
                }
                break;
        }
    }

    if (whitespaceBuffer !== "")
    {
        result += whitespaceBuffer;
        whitespaceBuffer = "";
    }

    return result;
}