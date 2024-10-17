import { Iterable } from "./iterable";
import { JsonDocumentSegment } from "./jsonDocumentSegment";
import { Pre } from "./pre";
import { Token } from "./token";

export class JsonDocumentUnknown implements JsonDocumentSegment
{
    private readonly tokens: Iterable<Token>;
    
    private constructor(tokens: Token | Iterable<Token>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokens, "tokens");

        if (tokens instanceof Token)
        {
            tokens = Iterable.create([tokens]);
        }
        this.tokens = tokens;
    }

    public static create(token: Token | Iterable<Token>): JsonDocumentUnknown
    {
        return new JsonDocumentUnknown(token);
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