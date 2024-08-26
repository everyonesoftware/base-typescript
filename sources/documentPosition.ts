import { Comparable } from "./comparable";
import { Comparer } from "./comparer";
import { Comparison } from "./comparison";
import { DocumentRange } from "./documentRange";
import { MutableDocumentPosition } from "./mutableDocumentPosition";
import { Post } from "./post";
import { Pre } from "./pre";

/**
 * A position within a document.
 */
export abstract class DocumentPosition extends Comparable<DocumentPosition>
{
    protected constructor()
    {
        super();
    }

    /**
     * Create a new {@link MutableDocumentPosition}.
     * @param characterIndex The character index within the document. Defaults to 0.
     * @param lineIndex The line index within the document. Defaults to 0.
     * @param columnIndex The column index within the current line. Defaults to 0.
     */
    public static create(characterIndex?: number, lineIndex?: number, columnIndex?: number): MutableDocumentPosition
    {
        return MutableDocumentPosition.create(characterIndex, lineIndex, columnIndex);
    }

    /**
     * Create a mutable clone of this {@link DocumentPosition}.
     */
    public clone(): MutableDocumentPosition
    {
        return DocumentPosition.clone(this);
    }

    public static clone(documentPosition: DocumentPosition): MutableDocumentPosition
    {
        Pre.condition.assertNotUndefinedAndNotNull(documentPosition, "documentPosition");

        return DocumentPosition.create(
            documentPosition.getCharacterIndex(),
            documentPosition.getLineIndex(),
            documentPosition.getColumnIndex(),
        );
    }

    /**
     * Get the character index within the document.
     */
    public abstract getCharacterIndex(): number;

    /**
     * Get the character number (index + 1) within the document.
     */
    public abstract getCharacterNumber(): number;

    /**
     * Get the line index within the document.
     */
    public abstract getLineIndex(): number;

    /**
     * Get the line number (index + 1) within the document.
     */
    public abstract getLineNumber(): number;

    /**
     * Get this {@link DocumentPosition}'s column index within the document's current
     * line.
     */
    public abstract getColumnIndex(): number;

    /**
     * Get the column number (index + 1) within the current document line.
     */
    public abstract getColumnNumber(): number;

    public plusColumns(columns: number): DocumentPosition
    {
        return DocumentPosition.plusColumns(this, columns);
    }

    public static plusColumns(position: DocumentPosition, columns: number): DocumentPosition
    {
        Pre.condition.assertNotUndefinedAndNotNull(position, "position");
        Pre.condition.assertGreaterThanOrEqualTo(columns, -position.getColumnIndex(), "columns");

        let result: DocumentPosition;
        if (columns === 0)
        {
            result = position;
        }
        else
        {
            result = DocumentPosition.create(position.getCharacterIndex() + columns, position.getLineIndex(), position.getColumnIndex() + columns);
        }

        Post.condition.assertNotUndefinedAndNotNull(result, "result");

        return result;
    }

    public createRange(columns: number): DocumentRange
    {
        return DocumentPosition.createRange(this, columns);
    }

    public static createRange(position: DocumentPosition, columns: number): DocumentRange
    {
        Pre.condition.assertNotUndefinedAndNotNull(position, "position");
        
        return DocumentRange.create(position, columns);
    }
    
    public override compareTo(value: DocumentPosition): Comparison
    {
        return DocumentPosition.compareTo(this, value);
    }

    public static compareTo(left: DocumentPosition, right: DocumentPosition): Comparison
    {
        let result: Comparison | undefined = Comparer.compareSameUndefinedNull(left, right);
        if (result === undefined)
        {
            result = Comparer.compareNumbers(left.getCharacterIndex(), right.getCharacterIndex());
        }
        return result;
    }
}