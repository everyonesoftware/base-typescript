import { join } from "./strings";

/**
 * An {@link Error} that is thrown when a pre-condition fails.
 */
export class PreConditionError extends Error
{
    public constructor(...message: string[])
    {
        super(join("\n", message));
    }
}