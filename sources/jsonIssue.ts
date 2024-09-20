import { DocumentRange } from "./documentRange";
import { Pre } from "./pre";

/**
 * An issue that can be reported while tokenizing or parsing a JSON document.
 */
export class JsonIssue
{
    private readonly message: string;
    private readonly range: DocumentRange;

    protected constructor(message: string, range: DocumentRange)
    {
        Pre.condition.assertNotEmpty(message, "message");
        Pre.condition.assertNotUndefinedAndNotNull(range, "range");

        this.message = message;
        this.range = range;
    }

    public static create(message: string, range: DocumentRange): JsonIssue
    {
        return new JsonIssue(message, range);
    }

    public getMessage(): string
    {
        return this.message;
    }

    public getRange(): DocumentRange
    {
        return this.range;
    }
}