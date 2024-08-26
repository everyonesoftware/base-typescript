import { DocumentPosition } from "./documentPosition";
import { Pre } from "./pre";
import { isNumber, isUndefinedOrNull } from "./types";

export class DocumentRange
{
    private readonly start: DocumentPosition;
    private readonly end: DocumentPosition;

    protected constructor(start: DocumentPosition, end: DocumentPosition)
    {
        Pre.condition.assertNotUndefinedAndNotNull(start, "start");
        Pre.condition.assertNotUndefinedAndNotNull(end, "end");

        this.start = start;
        this.end = end;
    }

    /**
     * Create a new {@link DocumentRange} from the provided start and end (inclusive).
     * @param start The first position of the {@link DocumentRange}.
     * @param endOrColumns The last (inclusive) position of the {@link DocumentRange} or the number
     * of columns wide that this range should be. If this is undefined, then the start position will
     * be used as the last position.
     */
    public static create(start: DocumentPosition, endOrColumns?: DocumentPosition | number): DocumentRange
    {
        Pre.condition.assertNotUndefinedAndNotNull(start, "start");

        let end: DocumentPosition;
        if (isUndefinedOrNull(endOrColumns))
        {
            end = start;
        }
        else if (isNumber(endOrColumns))
        {
            end = start.plusColumns(endOrColumns);
            if (endOrColumns < 0)
            {
                const temp: DocumentPosition = end;
                end = start;
                start = temp;
            }
        }
        else
        {
            end = endOrColumns;
        }
        return new DocumentRange(start, end);
    }

    /**
     * Get the first position of this {@link DocumentRange}.
     */
    public getStart(): DocumentPosition
    {
        return this.start;
    }

    /**
     * Get the last (inclusive) position of this {@link DocumentRange}.
     */
    public getEnd(): DocumentPosition
    {
        return this.end;
    }

    /**
     * Get whether this {@link DocumentRange} contains the provided value.
     * @param position The {@link DocumentPosition} to check.
     */
    public contains(position: DocumentPosition): boolean
    {
        Pre.condition.assertNotUndefinedAndNotNull(position, "position");

        return this.start.lessThanOrEqualTo(position) &&
            position.lessThanOrEqualTo(this.end);
    }
}