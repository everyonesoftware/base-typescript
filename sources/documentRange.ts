import { DocumentPosition } from "./documentPosition";
import { Pre } from "./pre";
import { isNumber, isUndefinedOrNull } from "./types";

export class DocumentRange
{
    private readonly start: DocumentPosition;
    private readonly afterEnd: DocumentPosition;

    protected constructor(start: DocumentPosition, afterEnd: DocumentPosition)
    {
        Pre.condition.assertNotUndefinedAndNotNull(start, "start");
        Pre.condition.assertNotUndefinedAndNotNull(afterEnd, "afterEnd");

        this.start = start;
        this.afterEnd = afterEnd;
    }

    /**
     * Create a new {@link DocumentRange} from the provided start and afterEnd (exclusive).
     * @param start The first position of the {@link DocumentRange}.
     * @param afterEndOrColumns The position directly after the end of the {@link DocumentRange} or
     * the number of columns wide that this range should be. If this is undefined, then the start
     * position will be used as the afterEnd position, making this an empty range.
     */
    public static create(start: DocumentPosition, afterEndOrColumns?: DocumentPosition | number): DocumentRange
    {
        Pre.condition.assertNotUndefinedAndNotNull(start, "start");

        let afterEnd: DocumentPosition;
        if (isUndefinedOrNull(afterEndOrColumns) || afterEndOrColumns === 0)
        {
            afterEnd = start;
        }
        else if (isNumber(afterEndOrColumns))
        {
            afterEnd = start.plusColumns(afterEndOrColumns);
        }
        else
        {
            afterEnd = afterEndOrColumns;
        }

        if (afterEnd.lessThan(start))
        {
            const temp: DocumentPosition = afterEnd;
            afterEnd = start;
            start = temp;
        }

        return new DocumentRange(start, afterEnd);
    }

    /**
     * Get the first position of this {@link DocumentRange}.
     */
    public getStart(): DocumentPosition
    {
        return this.start;
    }

    /**
     * Get the position directly (exclusive) after the end of this {@link DocumentRange}.
     */
    public getAfterEnd(): DocumentPosition
    {
        return this.afterEnd;
    }

    /**
     * Get whether this {@link DocumentRange} contains the provided value.
     * @param position The {@link DocumentPosition} to check.
     */
    public contains(position: DocumentPosition): boolean
    {
        Pre.condition.assertNotUndefinedAndNotNull(position, "position");

        return this.start.lessThanOrEqualTo(position) &&
            position.lessThan(this.afterEnd);
    }
}