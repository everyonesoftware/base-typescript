/**
 * A collection of parameters that can be passed to an assert error message function.
 */
export interface AssertMessageParameters
{
    expected: string,
    actual: string,
    expression?: string,
    message?: string,
}