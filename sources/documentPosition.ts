import { MutableDocumentPosition } from "./mutableDocumentPosition";
import { Pre } from "./pre";

/**
 * A position within a document.
 */
export abstract class DocumentPosition
{
    protected constructor()
    {
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
}