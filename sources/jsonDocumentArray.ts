import { JsonDocumentSegment } from "./jsonDocumentSegment";
import { Pre } from "./pre";
import { Token } from "./token";
import { Iterable } from "./iterable";

export class JsonDocumentArray extends JsonDocumentSegment
{
    private readonly tokensAndSegments: Iterable<Token | JsonDocumentSegment>;
    
    private constructor(tokensAndSegments: Iterable<Token | JsonDocumentSegment>)
    {
        Pre.condition.assertNotEmpty(tokensAndSegments, "tokensAndSegments");
        Pre.condition.assertEqual(Token.leftSquareBrace(), tokensAndSegments.first().await(), "tokensAndSegments.first().await()");

        super();

        this.tokensAndSegments = tokensAndSegments;
    }

    public static create(tokens: Iterable<Token | JsonDocumentSegment>): JsonDocumentArray
    {
        return new JsonDocumentArray(tokens);
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