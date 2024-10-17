import { DocumentPosition } from "./documentPosition";
import { DocumentRange } from "./documentRange";
import { Pre } from "./pre";
import { Tokenizer } from "./tokenizer";
import { isUndefinedOrNull } from "./types";
import { TokenizerDecorator } from "./tokenizerDecorator";
import { Token } from "./token";
import { TokenType } from "./tokenType";
import { MutableDocumentPosition } from "./mutableDocumentPosition";
import { Iterator } from "./iterator";

export class DocumentTokenizer extends TokenizerDecorator
{
    private currentRange: DocumentRange;

    protected constructor(tokenizer: string | Iterator<string> | Tokenizer, currentPosition?: DocumentPosition)
    {
        Pre.condition.assertNotUndefinedAndNotNull(tokenizer, "tokenizer");

        if (!(tokenizer instanceof Tokenizer))
        {
            tokenizer = Tokenizer.create(tokenizer);
        }

        super(tokenizer);

        if (isUndefinedOrNull(currentPosition))
        {
            currentPosition = DocumentPosition.create();
        }
        this.currentRange = DocumentRange.create(currentPosition);
    }

    public static create(innerTokenizer: string | Iterator<string> | Tokenizer, currentPosition?: DocumentPosition): DocumentTokenizer
    {
        Pre.condition.assertNotUndefinedAndNotNull(innerTokenizer, "innerTokenizer");

        return new DocumentTokenizer(innerTokenizer, currentPosition);
    }

    public override next(): boolean
    {
        if (!this.hasStarted() || this.hasCurrent())
        {
            const nextStartPosition: DocumentPosition = this.currentRange.getAfterEnd();
            if (!super.next())
            {
                this.currentRange = DocumentRange.create(nextStartPosition);
            }
            else
            {
                let endPosition: DocumentPosition;
                const currentToken: Token = this.getCurrent();
                switch (currentToken.getType())
                {
                    case TokenType.NewLine:
                    case TokenType.Whitespace:
                        let position: MutableDocumentPosition = nextStartPosition.clone();
                        for (const character of currentToken.getText())
                        {
                            position.advanceCharacter(character);
                        }
                        endPosition = position;
                        break;

                    default:
                        endPosition = nextStartPosition.plusColumns(currentToken.getLength());
                        break;
                }
                this.currentRange = DocumentRange.create(nextStartPosition, endPosition);
            }
        }
        return this.hasCurrent();
    }

    public getCurrentRange(): DocumentRange
    {
        Pre.condition.assertTrue(this.hasStarted(), "this.hasStarted()");

        return this.currentRange;
    }
}