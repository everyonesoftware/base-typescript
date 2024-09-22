import { Pre } from "./pre";
import { TokenType } from "./tokenType";

/**
 * A {@link Token} parsed from text by a {@link Tokenizer}.
 */
export class Token
{
    private readonly type: TokenType;
    private readonly text: string;

    protected constructor(type: TokenType, text: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(type, "type");
        Pre.condition.assertNotEmpty(text, "text");

        this.type = type;
        this.text = text;
    }

    public static create(type: TokenType, text: string)
    {
        return new Token(type, text);
    }

    /**
     * Get the {@link TokenType} of this {@link Token}.
     */
    public getType(): TokenType
    {
        return this.type;
    }

    /**
     * Get the {@link String} text of this {@link Token}.
     */
    public getText(): string
    {
        return this.text;
    }

    /**
     * Get the {@link String} representation of this {@link Token}.
     */
    public toString(): string
    {
        return this.getText();
    }

    public static whitespace(text: string): Token
    {
        return Token.create(TokenType.Whitespace, text);
    }

    public static carriageReturn(): Token
    {
        return Token.create(TokenType.CarriageReturn, "\r");
    }

    public static newLine(): Token
    {
        return Token.create(TokenType.NewLine, "\n");
    }

    public static letters(text: string): Token
    {
        return Token.create(TokenType.Letters, text);
    }

    public static digits(text: string): Token
    {
        return Token.create(TokenType.Digits, text);
    }

    public static period(): Token
    {
        return Token.create(TokenType.Period, ".");
    }
    
    public static comma(): Token
    {
        return Token.create(TokenType.Comma, ",");
    }

    public static colon(): Token
    {
        return Token.create(TokenType.Colon, ":");
    }
    
    public static semicolon(): Token
    {
        return Token.create(TokenType.Semicolon, ";");
    }
    
    public static exclamationPoint(): Token
    {
        return Token.create(TokenType.ExclamationPoint, "!");
    }

    public static questionMark(): Token
    {
        return Token.create(TokenType.QuestionMark, "?");
    }
    
    public static leftCurlyBracket(): Token
    {
        return Token.create(TokenType.LeftCurlyBracket, "{");
    }

    public static rightCurlyBracket(): Token
    {
        return Token.create(TokenType.RightCurlyBracket, "}");
    }

    public static leftSquareBrace(): Token
    {
        return Token.create(TokenType.LeftSquareBrace, "[");
    }

    public static rightSquareBrace(): Token
    {
        return Token.create(TokenType.RightSquareBrace, "]");
    }

    public static leftParenthesis(): Token
    {
        return Token.create(TokenType.LeftParenthesis, "(");
    }

    public static rightParenthesis(): Token
    {
        return Token.create(TokenType.RightParenthesis, ")");
    }

    public static hyphen(): Token
    {
        return Token.create(TokenType.Hyphen, "-");
    }

    public static underscore(): Token
    {
        return Token.create(TokenType.Underscore, "_");
    }
    
    public static equalsSign(): Token
    {
        return Token.create(TokenType.EqualsSign, "=");
    }
    
    public static plusSign(): Token
    {
        return Token.create(TokenType.PlusSign, "+");
    }

    public static asterisk(): Token
    {
        return Token.create(TokenType.Asterisk, "*");
    }

    public static percentSign(): Token
    {
        return Token.create(TokenType.PercentSign, "%");
    }

    public static ampersand(): Token
    {
        return Token.create(TokenType.Ampersand, "&");
    }

    public static poundSign(): Token
    {
        return Token.create(TokenType.PoundSign, "#");
    }

    public static backslash(): Token
    {
        return Token.create(TokenType.Backslash, "\\");
    }

    public static forwardSlash(): Token
    {
        return Token.create(TokenType.ForwardSlash, "/");
    }

    public static leftAngleBracket(): Token
    {
        return Token.create(TokenType.LeftAngleBracket, "<");
    }

    public static rightAngleBracket(): Token
    {
        return Token.create(TokenType.RightAngleBracket, ">");
    }

    public static verticalBar(): Token
    {
        return Token.create(TokenType.VerticalBar, "|");
    }

    public static dollarSign(): Token
    {
        return Token.create(TokenType.DollarSign, "$");
    }

    public static caret(): Token
    {
        return Token.create(TokenType.Caret, "^");
    }

    public static atSign(): Token
    {
        return Token.create(TokenType.AtSign, "@");
    }

    public static tilde(): Token
    {
        return Token.create(TokenType.Tilde, "~");
    }

    public static backtick(): Token
    {
        return Token.create(TokenType.Backtick, "`");
    }

    public static singleQuote(): Token
    {
        return Token.create(TokenType.SingleQuote, "'");
    }

    public static doubleQuote(): Token
    {
        return Token.create(TokenType.DoubleQuote, "\"");
    }

    public static unknown(text: string): Token
    {
        return Token.create(TokenType.Unknown, text);
    }
}