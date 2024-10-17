import { JsonDocumentSegment } from "./jsonDocumentSegment";
import { Pre } from "./pre";
import { Token } from "./token";

export class JsonDocumentNumber implements JsonDocumentSegment
{
    private readonly tokens: Iterable<Token>;
    
    private constructor(tokens: Iterable<Token>)
    {
        Pre.condition.assertNotEmpty(tokens, "tokens");

        this.tokens = tokens;
    }

    public static create(tokens: Iterable<Token>): JsonDocumentNumber
    {
        return new JsonDocumentNumber(tokens);
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

    /**
     * Get the numeric value of this {@link JsonDocumentNumber}.
     */
    public getValue(): number
    {
        return parseFloat(this.getText());
    }
}