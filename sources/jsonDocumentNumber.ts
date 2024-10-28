import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Token } from "./token";
import { JavascriptIterable } from "./javascript";

export class JsonDocumentNumber implements JsonDocumentValue
{
    private readonly tokens: JavascriptIterable<Token>;
    
    private constructor(tokens: JavascriptIterable<Token>)
    {
        Pre.condition.assertNotEmpty(tokens, "tokens");

        this.tokens = tokens;
    }

    public static create(tokens: JavascriptIterable<Token>): JsonDocumentNumber
    {
        return new JsonDocumentNumber(tokens);
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

    /**
     * Get the numeric value of this {@link JsonDocumentNumber}.
     */
    public getValue(): number
    {
        return parseFloat(this.getText());
    }
}