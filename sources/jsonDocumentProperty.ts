import { Iterable } from "./iterable";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentString } from "./jsonDocumentString";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Token } from "./token";

export class JsonDocumentProperty
{
    private readonly tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>;
    
    private constructor(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>)
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokensAndValues, "tokensAndValues");
        Pre.condition.assertNotEmpty(tokensAndValues, "tokensAndValues");
        Pre.condition.assertInstanceOf(Iterable.first(tokensAndValues).await(), JsonDocumentString, undefined, "Iterable.first(tokensAndValues).await()");

        this.tokensAndValues = tokensAndValues;
    }

    public static create(tokensAndValues: JavascriptIterable<Token | JsonDocumentValue>): JsonDocumentProperty
    {
        return new JsonDocumentProperty(tokensAndValues);
    }

    public getLength(): number
    {
        return JsonDocumentValue.getLength(this.tokensAndValues);
    }

    public getText(): string
    {
        return JsonDocumentValue.getText(this.tokensAndValues);
    }

    public toString(): string
    {
        return JsonDocumentValue.toString(this);
    }
}