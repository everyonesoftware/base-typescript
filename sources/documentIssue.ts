import { DocumentRange } from "./documentRange";
import { Pre } from "./pre";

/**
 * An issue that occurred during an operation pertaining to a document.
 */
export class DocumentIssue
{
    private readonly range: DocumentRange;
    private readonly message: string;

    private constructor(range: DocumentRange, message: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(range, "range");
        Pre.condition.assertNotEmpty(message, "message");

        this.range = range;
        this.message = message;
    }

    public static create(range: DocumentRange, message: string): DocumentIssue
    {
        return new DocumentIssue(range, message);
    }

    public getRange(): DocumentRange
    {
        return this.range;
    }

    public getMessage(): string
    {
        return this.message;
    }
}