import { DocumentPosition } from "./documentPosition";
import { Iterator } from "./iterator";
import { IteratorDecorator } from "./iteratorDecorator";
import { MutableDocumentPosition } from "./mutableDocumentPosition";
import { Pre } from "./pre";

/**
 * An {@link Iterator} that keeps track of its position within a document.
 */
export class DocumentIterator extends IteratorDecorator<string>
{
    private readonly position: MutableDocumentPosition;

    protected constructor(innerIterator: Iterator<string>, position: DocumentPosition)
    {
        super(innerIterator);

        Pre.condition.assertNotUndefinedAndNotNull(position, "position");

        this.position = position.clone();
    }

    public static create(innerIterator: Iterator<string>, position?: DocumentPosition)
    {
        return new DocumentIterator(innerIterator, position || DocumentPosition.create());
    }

    public override next(): boolean
    {
        if (this.hasCurrent())
        {
            this.position.advanceCharacter(this.getCurrent());
        }
        return super.next();
    }

    /**
     * Get the current {@link DocumentPosition} of this {@link DocumentIterator}.
     */
    public getPosition(): DocumentPosition
    {
        Pre.condition.assertTrue(this.hasStarted(), "this.hasStarted()");

        return this.position.clone();
    }

    /**
     * Get the character index within the document.
     */
    public getCharacterIndex(): number
    {
        return this.getPosition().getCharacterIndex();
    }

    public getCharacterNumber(): number
    {
        return this.getPosition().getCharacterNumber();
    }

    public getLineIndex(): number
    {
        return this.getPosition().getLineIndex();
    }

    public getLineNumber(): number
    {
        return this.getPosition().getLineNumber();
    }

    public getColumnIndex(): number
    {
        return this.getPosition().getColumnIndex();
    }

    public getColumnNumber(): number
    {
        return this.getPosition().getColumnNumber();
    }
}