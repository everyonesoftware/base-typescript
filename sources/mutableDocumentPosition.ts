import { Comparable } from "./comparable";
import { Comparison } from "./comparison";
import { DocumentPosition } from "./documentPosition";
import { DocumentRange } from "./documentRange";
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

    public plusColumns(columns: number): DocumentPosition
    {
        return DocumentPosition.plusColumns(this, columns);
    }

    public createRange(columns: number): DocumentRange
    {
        return DocumentPosition.createRange(this, columns);
    }

    public compareTo(value: DocumentPosition): Comparison
    {
        return DocumentPosition.compareTo(this, value);
    }

    public lessThan(value: DocumentPosition): boolean
    {
        return Comparable.lessThan(this, value);
    }

    public lessThanOrEqualTo(value: DocumentPosition): boolean
    {
        return Comparable.lessThanOrEqualTo(this, value);
    }

    public equals(value: DocumentPosition): boolean
    {
        return Comparable.equals(this, value);
    }

    public notEquals(value: DocumentPosition): boolean
    {
        return Comparable.notEquals(this, value);
    }

    public greaterThanOrEqualTo(value: DocumentPosition): boolean
    {
        return Comparable.greaterThanOrEqualTo(this, value);
    }

    public greaterThan(value: DocumentPosition): boolean
    {
        return Comparable.greaterThan(this, value);
    }
}