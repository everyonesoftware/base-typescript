/**
 * Get whether the provided value is a {@link string}.
 * @param value The value to check.
 */
export function isString(value: unknown): value is string
{
    return typeof value === "string";
}