import { Pre } from "./pre";

/**
 * A type that is used to mark that a test group or a test should be skipped.
 */
export class TestSkip
{
    private readonly message: string;

    private constructor(message: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(message, "message");

        this.message = message;
    }

    public static create(message?: string): TestSkip
    {
        if (message === undefined || message === null)
        {
            message = "";
        }
        return new TestSkip(message);
    }

    public getMessage(): string
    {
        return this.message;
    }
}