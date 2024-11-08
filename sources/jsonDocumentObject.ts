import { Iterable } from "./iterable";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentProperty } from "./jsonDocumentProperty";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Token } from "./token";

export class JsonDocumentObject implements JsonDocumentValue
{
    private readonly tokensValuesAndProperties: JavascriptIterable<Token | JsonDocumentValue | JsonDocumentProperty>;
    
    private constructor(tokensValuesAndProperties: JavascriptIterable<Token | JsonDocumentValue | JsonDocumentProperty>)
    {
        Pre.condition.assertNotEmpty(tokensValuesAndProperties, "tokensValuesAndProperties");
        Pre.condition.assertEqual(Token.leftCurlyBracket(), Iterable.first(tokensValuesAndProperties).await(), "Iterable.first(tokensValuesAndProperties).await()");

        this.tokensValuesAndProperties = tokensValuesAndProperties;
    }

    public static create(tokensValuesAndProperties: JavascriptIterable<Token | JsonDocumentValue | JsonDocumentProperty>): JsonDocumentObject
    {
        return new JsonDocumentObject(tokensValuesAndProperties);
    }

    public getLength(): number
    {
        return JsonDocumentValue.getLength(this.tokensValuesAndProperties);
    }

    public getText(): string
    {
        return JsonDocumentValue.getText(this.tokensValuesAndProperties);
    }
}