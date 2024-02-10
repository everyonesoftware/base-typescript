/**
 * An {@link Error} that is used when a type is found that isn't what was expected.
 */
export class WrongTypeError extends Error
{
    public constructor(message: string)
    {
        super(message);
    }
}