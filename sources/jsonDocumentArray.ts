import { Iterable } from "./iterable";
import { JavascriptIterable } from "./javascript";
import { JsonDocumentValue } from "./jsonDocumentValue";
import { Pre } from "./pre";
import { Token } from "./token";

export class JsonDocumentArray extends JsonDocumentValue
{
    private readonly tokensAndSegments: JavascriptIterable<Token | JsonDocumentValue>;
    
    private constructor(tokensAndSegments: JavascriptIterable<Token | JsonDocumentValue>)
    {
        Pre.condition.assertNotEmpty(tokensAndSegments, "tokensAndSegments");
        Pre.condition.assertEqual(Token.leftSquareBrace(), Iterable.first(tokensAndSegments).await(), "tokensAndSegments.first().await()");

        super();

        this.tokensAndSegments = tokensAndSegments;
    }

    public static create(tokensAndSegments: JavascriptIterable<Token | JsonDocumentValue>): JsonDocumentArray
    {
        return new JsonDocumentArray(tokensAndSegments);
    }

    public override getLength(): number
    {
        let length: number = 0;
        for (const tokenOrSegment of this.tokensAndSegments)
        {
            length += tokenOrSegment.getLength();
        }
        return length;
    }

    public override getText(): string
    {
        let text: string = "";
        for (const tokenOrSegment of this.tokensAndSegments)
        {
            text += tokenOrSegment.getText();
        }
        return text;
    }
}