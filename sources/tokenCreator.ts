import { Token } from "./token";
import { Map } from "./map";
import { Post } from "./post";
import { TokenType } from "./tokenType";

/**
 * An object that creates {@link Token}s. Since most tokens in a stream are duplicates of previously
 * seen {@link Token}s, this type allows us to reduce the actual number of tokens in-memory by
 * returning previosuly created tokens instead of creating new ones each time.
 */
export class TokenCreator
{
    private readonly tokens: Map<string,Token>;

    private constructor()
    {
        this.tokens = Map.create();
    }

    public static create(): TokenCreator
    {
        return new TokenCreator();
    }

    public get(type: TokenType, text: string): Token
    {
        const result: Token = this.tokens.getOrSet(text, () => Token.create(type, text)).await();

        Post.condition.assertNotUndefinedAndNotNull(result, "result");
        Post.condition.assertSame(type, result.getType());
        Post.condition.assertEqual(text, result.getText());

        return result;
    }

    public whitespace(text: string): Token
    {
        return this.get(TokenType.Whitespace, text);
    }

    public carriageReturn(): Token
    {
        return this.get(TokenType.CarriageReturn, "\r");
    }

    public newLine(): Token
    {
        return this.get(TokenType.NewLine, "\n");
    }

    public letters(text: string): Token
    {
        return this.get(TokenType.Letters, text);
    }

    public digits(text: string): Token
    {
        return this.get(TokenType.Digits, text);
    }

    public period(): Token
    {
        return this.get(TokenType.Period, ".");
    }
    
    public comma(): Token
    {
        return this.get(TokenType.Comma, ",");
    }

    public colon(): Token
    {
        return this.get(TokenType.Colon, ":");
    }
    
    public semicolon(): Token
    {
        return this.get(TokenType.Semicolon, ";");
    }
    
    public exclamationPoint(): Token
    {
        return this.get(TokenType.ExclamationPoint, "!");
    }

    public questionMark(): Token
    {
        return this.get(TokenType.QuestionMark, "?");
    }
    
    public leftCurlyBracket(): Token
    {
        return this.get(TokenType.LeftCurlyBracket, "{");
    }

    public rightCurlyBracket(): Token
    {
        return this.get(TokenType.RightCurlyBracket, "}");
    }

    public leftSquareBrace(): Token
    {
        return this.get(TokenType.LeftSquareBrace, "[");
    }

    public rightSquareBrace(): Token
    {
        return this.get(TokenType.RightSquareBrace, "]");
    }

    public leftParenthesis(): Token
    {
        return this.get(TokenType.LeftParenthesis, "(");
    }

    public rightParenthesis(): Token
    {
        return this.get(TokenType.RightParenthesis, ")");
    }

    public hyphen(): Token
    {
        return this.get(TokenType.Hyphen, "-");
    }

    public underscore(): Token
    {
        return this.get(TokenType.Underscore, "_");
    }
    
    public equalsSign(): Token
    {
        return this.get(TokenType.EqualsSign, "=");
    }
    
    public plusSign(): Token
    {
        return this.get(TokenType.PlusSign, "+");
    }

    public asterisk(): Token
    {
        return this.get(TokenType.Asterisk, "*");
    }

    public percentSign(): Token
    {
        return this.get(TokenType.PercentSign, "%");
    }

    public ampersand(): Token
    {
        return this.get(TokenType.Ampersand, "&");
    }

    public poundSign(): Token
    {
        return this.get(TokenType.PoundSign, "#");
    }

    public backslash(): Token
    {
        return this.get(TokenType.Backslash, "\\");
    }

    public forwardSlash(): Token
    {
        return this.get(TokenType.ForwardSlash, "/");
    }

    public leftAngleBracket(): Token
    {
        return this.get(TokenType.LeftAngleBracket, "<");
    }

    public rightAngleBracket(): Token
    {
        return this.get(TokenType.RightAngleBracket, ">");
    }

    public verticalBar(): Token
    {
        return this.get(TokenType.VerticalBar, "|");
    }

    public dollarSign(): Token
    {
        return this.get(TokenType.DollarSign, "$");
    }

    public caret(): Token
    {
        return this.get(TokenType.Caret, "^");
    }

    public atSign(): Token
    {
        return this.get(TokenType.AtSign, "@");
    }

    public tilde(): Token
    {
        return this.get(TokenType.Tilde, "~");
    }

    public backtick(): Token
    {
        return this.get(TokenType.Backtick, "`");
    }

    public singleQuote(): Token
    {
        return this.get(TokenType.SingleQuote, "'");
    }

    public doubleQuote(): Token
    {
        return this.get(TokenType.DoubleQuote, "\"");
    }

    public unknown(text: string): Token
    {
        return this.get(TokenType.Unknown, text);
    }
}