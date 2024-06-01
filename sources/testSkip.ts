import { Pre } from "./pre";

/**
 * A type that is used to mark that a test group or a test should be skipped.
 */
export class TestSkip
{
    private readonly shouldSkip: boolean;
    private readonly message: string;

    private constructor(shouldSkip: boolean, message: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(message, "message");

        this.shouldSkip = shouldSkip;
        this.message = message;
    }

    /**
     * Create a new {@link TestSkip} with the provided properties.
     * @param shouldSkip Whether the tests associated with the new {@link TestSkip}
     * should be skipped.
     * @param message The message that explains why the tests associated with this {@link TestSkip}
     * should be skipped.
     */
    public static create(shouldSkip?: boolean, message?: string): TestSkip
    {
        if (shouldSkip === undefined || shouldSkip === null)
        {
            shouldSkip = true;
        }

        if (message === undefined || message === null)
        {
            message = "";
        }

        return new TestSkip(shouldSkip, message);
    }

    /**
     * Get whether the tests associated with this {@link TestSkip} should be skipped.
     */
    public getShouldSkip(): boolean
    {
        return this.shouldSkip;
    }

    /**
     * Get the message that explains why the tests associated with this {@link TestSkip}
     * should be skipped.
     */
    public getMessage(): string
    {
        return this.message;
    }
}