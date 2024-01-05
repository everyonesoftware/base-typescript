/**
 * Get whether the provided value is a {@link string}.
 * @param value The value to check.
 */
export function isString(value: unknown): value is string
{
    return typeof value === "string";
}

export function isArray(value: unknown): value is any[]
{
    return Array.isArray(value);
}