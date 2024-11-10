import { Iterable } from "./iterable";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Token } from "./token";

export class JsonDocumentUnknown implements JsonDocumentValue
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
        return JsonDocumentValue.getLength(this.tokens);
    }

    public getText(): string
    {
        return JsonDocumentValue.getText(this.tokens);
    }

    public toString(): string
    {
        return JsonDocumentValue.toString(this);
    }
}