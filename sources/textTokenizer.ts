import { Iterator } from "./iterator";
import { IteratorBase } from "./iteratorBase";
import { Pre } from "./pre";
import { StringIterator } from "./stringIterator";
import { isDigit, isLowercasedLetter, isUppercasedLetter, isWhitespace } from "./strings";
import { TextToken } from "./textToken";
import { isString } from "./types";

export class TextTokenizer extends IteratorBase<TextToken>
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