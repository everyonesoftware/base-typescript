/**
 * The different types of {@link JsonToken}s that can be parsed.
 */
export enum JsonTokenType
{
    Whitespace,
    String,
    LeftSquareBracket,
    RightSquareBracket,
    LeftCurlyBrace,
    RightCurlyBrace,
    Comma,
    Number,
    Boolean,
    Null,
    Unknown,
}