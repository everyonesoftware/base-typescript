import { Pre } from "./pre";

/**
 * A collection of functions that are used by different WriteStream types.
 */
export abstract class WriteStream
{
    /**
     * Get the provided startIndex value or the default value if startIndex is undefined.
     * @param startIndex The startIndex value provided to a write method.
     */
    public static getStartIndex(startIndex: number | undefined): number
    {
        Pre.condition.assertTrue(startIndex === undefined || startIndex === null || 0 <= startIndex, "startIndex === undefined || startIndex === null || 0 <= startIndex");

        return startIndex || 0;
    }

    /**
     * Get the provided length value or the default value if length is undefined.
     * @param sourceLength The number of values within the data source.
     * @param startIndex The index that values will start being written from.
     * @param length The length value provided to a write method.
     */
    public static getLength(sourceLength: number, startIndex: number, length: number | undefined): number
    {
        Pre.condition.assertNotUndefinedAndNotNull(sourceLength, "sourceLength");
        Pre.condition.assertGreaterThanOrEqualTo(sourceLength, 0, "sourceLength");
        Pre.condition.assertNotUndefinedAndNotNull(startIndex, "startIndex");
        Pre.condition.assertBetween(0, startIndex, sourceLength, "startIndex");
        Pre.condition.assertTrue(length === undefined || length === null || (0 <= length && length <= sourceLength - startIndex), "length === undefined || length === null || (0 <= length && length <= maximumLength - startIndex)");

        return length === undefined || length === null
            ? sourceLength - startIndex
            : length;
    }
}