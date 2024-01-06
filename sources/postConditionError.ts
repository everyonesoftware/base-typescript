import { join } from "./strings";

/**
 * An {@link Error} that is thrown when a post-condition fails.
 */
export class PostConditionError extends Error
{
    public constructor(...message: string[])
    {
        super(join("\n", message));
    }
}