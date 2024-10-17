import { JsonDocumentSegment } from "./jsonDocumentSegment";
import { Pre } from "./pre";
import { Token } from "./token";
import { TokenType } from "./tokenType";

export class JsonDocumentBoolean implements JsonDocumentSegment
{
    private readonly token: Token;
    
    private constructor(token: Token)
    {
        Pre.condition.assertNotUndefinedAndNotNull(token, "token");
        Pre.condition.assertEqual(TokenType.Letters, token.getType(), "token.getType()");
        Pre.condition.assertOneOf(["true", "false"], token.getText().toLowerCase(), "token.getText().toLowerCase()");

        this.token = token;
    }

    public static create(token: Token): JsonDocumentBoolean
    {
        return new JsonDocumentBoolean(token);
    }

    public getLength(): number
    {
        return this.token.getLength();
    }

    public getText(): string
    {
        return this.token.getText();
    }

    public toString(): string
    {
        return JsonDocumentSegment.toString(this);
    }

    public getValue(): boolean
    {
        return this.getText().toLowerCase() === "true";
    }
}