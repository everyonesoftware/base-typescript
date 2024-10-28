import { IteratorBase } from "./iteratorBase";
import { Token } from "./token";
import { TokenCreator } from "./tokenCreator";
import { Iterator } from "./iterator";
import { Pre } from "./pre";
import { isString, isUndefinedOrNull } from "./types";
import { StringIterator } from "./stringIterator";
import { isDigit, isLetter } from "./strings";
import { Post } from "./post";
import { Tokenizer } from "./tokenizer";
import { JavascriptIterable } from "./javascript";

export class BasicTokenizer extends IteratorBase<Token> implements Tokenizer
{
    private readonly innerIterator: Iterator<string>;
    private readonly tokenCreator: TokenCreator;
    private current: Token | undefined;
    private started: boolean;

    protected constructor(characters: string | JavascriptIterable<string>, tokenCreator?: TokenCreator)
    {
        Pre.condition.assertNotUndefinedAndNotNull(characters, "characters");

        super();

        if (isString(characters))
        {
            this.innerIterator = StringIterator.create(characters);
        }
        else
        {
            this.innerIterator = Iterator.create(characters);
        }

        if (isUndefinedOrNull(tokenCreator))
        {
            tokenCreator = TokenCreator.create();
        }
        this.tokenCreator = tokenCreator;

        this.current = undefined;
        this.started = false;
    }

    public static create(characters: string | JavascriptIterable<string>, tokenCreator?: TokenCreator): BasicTokenizer
    {
        Pre.condition.assertNotUndefinedAndNotNull(characters, "characters");

        return new BasicTokenizer(characters, tokenCreator);
    }

    protected hasCurrentCharacter(): boolean
    {
        return this.innerIterator.hasCurrent();
    }

    protected getCurrentCharacter(): string
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");

        return this.innerIterator.getCurrent();
    }

    protected nextCharacter(): boolean
    {
        return this.innerIterator.next();
    }

    protected takeCurrentCharacter(): string
    {
        Pre.condition.assertTrue(this.hasCurrentCharacter(), "this.hasCurrentCharacter()");

        return this.innerIterator.takeCurrent();
    }

    protected readWhile(condition: (c: string) => boolean): string
    {
        Pre.condition.assertTrue(condition(this.getCurrentCharacter()), "condition(this.getCurrentCharacter())");

        let result: string = this.takeCurrentCharacter();
        while (this.hasCurrentCharacter() && condition(this.getCurrentCharacter()))
        {
            result += this.takeCurrentCharacter();
        }

        Post.condition.assertNotEmpty(result, "result");

        return result;
    }

    protected isWhitespace(character: string): boolean
    {
        return character === " " || character === "\t";
    }

    protected readWhitespace(): string
    {
        Pre.condition.assertTrue(this.isWhitespace(this.getCurrentCharacter()), "this.isWhitespace(this.getCurrentCharacter())");

        return this.readWhile(c => this.isWhitespace(c));
    }

    protected isLetter(character: string): boolean
    {
        return isLetter(character);
    }

    protected readLetters(): string
    {
        Pre.condition.assertTrue(this.isLetter(this.getCurrentCharacter()), "this.isLetter(this.getCurrentCharacter())");

        return this.readWhile(c => this.isLetter(c));
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
            switch (currentCharacter)
            {
                case "\r":
                    this.current = this.tokenCreator.carriageReturn();
                    this.nextCharacter();
                    break;

                case "\n":
                    this.current = this.tokenCreator.newLine();
                    this.nextCharacter();
                    break;

                case ".":
                    this.current = this.tokenCreator.period();
                    this.nextCharacter();
                    break;

                case ",":
                    this.current = this.tokenCreator.comma();
                    this.nextCharacter();
                    break;

                case ":":
                    this.current = this.tokenCreator.colon();
                    this.nextCharacter();
                    break;

                case ";":
                    this.current = this.tokenCreator.semicolon();
                    this.nextCharacter();
                    break;

                case "!":
                    this.current = this.tokenCreator.exclamationPoint();
                    this.nextCharacter();
                    break;

                case "?":
                    this.current = this.tokenCreator.questionMark();
                    this.nextCharacter();
                    break;
                    
                case "{":
                    this.current = this.tokenCreator.leftCurlyBracket();
                    this.nextCharacter();
                    break;

                case "}":
                    this.current = this.tokenCreator.rightCurlyBracket();
                    this.nextCharacter();
                    break;

                case "[":
                    this.current = this.tokenCreator.leftSquareBrace();
                    this.nextCharacter();
                    break;

                case "]":
                    this.current = this.tokenCreator.rightSquareBrace();
                    this.nextCharacter();
                    break;
                    
                case "(":
                    this.current = this.tokenCreator.leftParenthesis();
                    this.nextCharacter();
                    break;

                case ")":
                    this.current = this.tokenCreator.rightParenthesis();
                    this.nextCharacter();
                    break;

                case "-":
                    this.current = this.tokenCreator.hyphen();
                    this.nextCharacter();
                    break;

                case "_":
                    this.current = this.tokenCreator.underscore();
                    this.nextCharacter();
                    break;

                case "=":
                    this.current = this.tokenCreator.equalsSign();
                    this.nextCharacter();
                    break;

                case "+":
                    this.current = this.tokenCreator.plusSign();
                    this.nextCharacter();
                    break;
                    
                case "*":
                    this.current = this.tokenCreator.asterisk();
                    this.nextCharacter();
                    break;

                case "%":
                    this.current = this.tokenCreator.percentSign();
                    this.nextCharacter();
                    break;

                case "&":
                    this.current = this.tokenCreator.ampersand();
                    this.nextCharacter();
                    break;

                case "#":
                    this.current = this.tokenCreator.poundSign();
                    this.nextCharacter();
                    break;

                case "\\":
                    this.current = this.tokenCreator.backslash();
                    this.nextCharacter();
                    break;

                case "/":
                    this.current = this.tokenCreator.forwardSlash();
                    this.nextCharacter();
                    break;

                case "<":
                    this.current = this.tokenCreator.leftAngleBracket();
                    this.nextCharacter();
                    break;

                case ">":
                    this.current = this.tokenCreator.rightAngleBracket();
                    this.nextCharacter();
                    break;

                case "|":
                    this.current = this.tokenCreator.verticalBar();
                    this.nextCharacter();
                    break;

                case "$":
                    this.current = this.tokenCreator.dollarSign();
                    this.nextCharacter();
                    break;

                case "^":
                    this.current = this.tokenCreator.caret();
                    this.nextCharacter();
                    break;

                case "@":
                    this.current = this.tokenCreator.atSign();
                    this.nextCharacter();
                    break;

                case "~":
                    this.current = this.tokenCreator.tilde();
                    this.nextCharacter();
                    break;

                case "`":
                    this.current = this.tokenCreator.backtick();
                    this.nextCharacter();
                    break;

                case "'":
                    this.current = this.tokenCreator.singleQuote();
                    this.nextCharacter();
                    break;

                case "\"":
                    this.current = this.tokenCreator.doubleQuote();
                    this.nextCharacter();
                    break;

                default:
                    if (this.isWhitespace(currentCharacter))
                    {
                        this.current = this.tokenCreator.whitespace(this.readWhitespace());
                    }
                    else if (this.isLetter(currentCharacter))
                    {
                        this.current = this.tokenCreator.letters(this.readLetters());
                    }
                    else if (isDigit(currentCharacter))
                    {
                        this.current = this.tokenCreator.digits(this.readWhile(isDigit));
                    }
                    else
                    {
                        this.current = this.tokenCreator.unknown(currentCharacter);
                        this.nextCharacter();
                    }
                    break;
            }
        }
        return this.hasCurrent();
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