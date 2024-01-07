import { join } from "./strings";

/**
 * An {@link Error} that is thrown when a value is not found.
 */
export class NotFoundError extends Error
{
    public constructor(...message: string[])
    {
        super(join("\n", message));
    }
}