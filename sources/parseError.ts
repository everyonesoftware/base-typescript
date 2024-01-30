import { join } from "./strings";

/**
 * An {@link Error} that is thrown when a parser fails.
 */
export class ParseError extends Error
{
    public constructor(...message: string[])
    {
        super(join("\n", message));
    }
}