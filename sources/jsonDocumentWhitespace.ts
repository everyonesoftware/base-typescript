import { JsonDocumentSegment } from "./jsonDocumentSegment";
import { Pre } from "./pre";
import { Token } from "./token";

export class JsonDocumentWhitespace implements JsonDocumentSegment
{
    private readonly tokens: Iterable<Token>;
    
    private constructor(tokens: Iterable<Token>)
    {
        Pre.condition.assertNotEmpty(tokens, "tokens");

        this.tokens = tokens;
    }

    public static create(tokens: Iterable<Token>): JsonDocumentWhitespace
    {
        return new JsonDocumentWhitespace(tokens);
    }

    public getLength(): number
    {
        return JsonDocumentSegment.getLength(this.tokens);
    }

    public getText(): string
    {
        return JsonDocumentSegment.getText(this.tokens);
    }

    public toString(): string
    {
        return JsonDocumentSegment.toString(this);
    }
}