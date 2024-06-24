import { DocumentPosition } from "./documentPosition";
import { Pre } from "./pre";

/**
 * A {@link DocumentPosition} that can change its properties.
 */
export class MutableDocumentPosition implements DocumentPosition
{
    private characterIndex: number;
    private lineIndex: number;
    private columnIndex: number;

    protected constructor(characterIndex: number, lineIndex: number, columnIndex: number)
    {
        Pre.condition.assertGreaterThanOrEqualTo(characterIndex, 0, "characterIndex");
        Pre.condition.assertGreaterThanOrEqualTo(lineIndex, 0, "lineIndex");
        Pre.condition.assertGreaterThanOrEqualTo(columnIndex, 0, "columnIndex");

        this.characterIndex = characterIndex;
        this.lineIndex = lineIndex;
        this.columnIndex = columnIndex;
    }

    private static getDefaultNumber(value: number | undefined): number
    {
        return value === undefined || value === null ? 0 : value;
    }

    /**
     * Create a new {@link MutableDocumentPosition}.
     * @param characterIndex The character index within the document. Defaults to 0.
     * @param lineIndex The line index within the document. Defaults to 0.
     * @param columnIndex The column index within the current line. Defaults to 0.
     */
    public static create(characterIndex?: number, lineIndex?: number, columnIndex?: number): MutableDocumentPosition
    {
        return new MutableDocumentPosition(
            MutableDocumentPosition.getDefaultNumber(characterIndex),
            MutableDocumentPosition.getDefaultNumber(lineIndex),
            MutableDocumentPosition.getDefaultNumber(columnIndex),
        );
    }

    public clone(): MutableDocumentPosition
    {
        return DocumentPosition.clone(this);
    }

    /**
     * Advance this {@link MutableDocumentPosition} past the provided character.
     * @param character The character that was advanced past.
     */
    public advanceCharacter(character: string): void
    {
        Pre.condition.assertNotEmpty(character, "character");
        Pre.condition.assertEqual(1, character.length, "character.length");

        this.characterIndex++;
        if (character === "\n")
        {
            this.lineIndex++;
            this.columnIndex = 0;
        }
        else
        {
            this.columnIndex++;
        }
    }

    public getCharacterIndex(): number
    {
        return this.characterIndex;
    }

    public getCharacterNumber(): number
    {
        return this.getCharacterIndex() + 1;
    }

    public getLineIndex(): number
    {
        return this.lineIndex;
    }

    public getLineNumber(): number
    {
        return this.getLineIndex() + 1;
    }

    public getColumnIndex(): number
    {
        return this.columnIndex;
    }

    public getColumnNumber(): number
    {
        return this.getColumnIndex() + 1;
    }
}