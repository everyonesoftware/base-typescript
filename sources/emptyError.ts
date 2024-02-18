/**
 * An {@link Error} that is created when something is empty.
 */
export class EmptyError extends Error
{
    public constructor(message?: string)
    {
        super(message);
    }
}