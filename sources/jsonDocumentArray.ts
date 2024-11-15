import { Iterable } from "./iterable";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Token } from "./token";

export class JsonDocumentArray implements JsonDocumentValue
{
    private readonly tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>;
    
    private constructor(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>)
    {
        Pre.condition.assertNotEmpty(tokensAndValues, "tokensAndValues");
        Pre.condition.assertEqual(Token.leftSquareBrace(), Iterable.first(tokensAndValues).await(), "Iterable.first(tokensAndValues).await()");

        this.tokensAndValues = tokensAndValues;
    }

    public static create(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>): JsonDocumentArray
    {
        return new JsonDocumentArray(tokensAndValues);
    }

    public getLength(): number
    {
        return JsonDocumentValue.getLength(this.tokensAndValues);
    }

    public getText(): string
    {
        return JsonDocumentValue.getText(this.tokensAndValues);
    }
}