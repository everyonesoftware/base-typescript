import { Iterator } from "./iterator";
import { IteratorBase } from "./iteratorBase";
import { Pre } from "./pre";
import { StringIterator } from "./stringIterator";
import { isDigit, isLowercasedLetter, isUppercasedLetter, isWhitespace } from "./strings";
import { Token } from "./token";
import { TokenCreator } from "./tokenCreator";
import { isString } from "./types";

export class TextTokenizer extends IteratorBase<Token>
{
    private readonly tokenCreator: TokenCreator;
    private readonly innerIterator: Iterator<string>;
    private current: Token | undefined;
    private started: boolean;

    private constructor(innerIterator: Iterator<string>)
    {
        super();

        this.tokenCreator = TokenCreator.create();
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
                this.current = this.tokenCreator.letters(this.readWhile(isLowercasedLetter));
            }
            else if (isUppercasedLetter(currentCharacter))
            {
                let text: string = this.readWhile(isUppercasedLetter);
                if (this.hasCurrentCharacter() && isLowercasedLetter(this.getCurrentCharacter()))
                {
                    text += this.readWhile(isLowercasedLetter);
                }
                this.current = this.tokenCreator.letters(text);
            }
            else if (isWhitespace(currentCharacter))
            {
                this.current = this.tokenCreator.whitespace(this.readWhile(isWhitespace));
            }
            else if (isDigit(currentCharacter))
            {
                this.current = this.tokenCreator.digits(this.readWhile(isDigit));
            }
            else if (currentCharacter === "_")
            {
                this.takeCurrentCharacter();
                this.current = this.tokenCreator.underscore();
            }
            else if (currentCharacter === "-")
            {
                this.takeCurrentCharacter();
                this.current = this.tokenCreator.hyphen();
            }
            else
            {
                this.current = this.tokenCreator.unknown(this.takeCurrentCharacter());
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

    public override getCurrent(): Token
    {
        Pre.condition.assertTrue(this.hasCurrent(), "this.hasCurrent()");

        return this.current!;
    }
}