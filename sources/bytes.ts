/**
 * A collection of values and functions for interacting with bytes.
 */
export abstract class Bytes
{
    /**
     * The minimum value that a byte can have.
     */
    public static readonly minimumValue: number = 0;

    /**
     * The maximum value (inclusive) that a byte can have.
     */
    public static readonly maximumValue: number = 255;

    /**
     * Get whether the provided value is within the range of a valid byte (between 0 and
     * 255).
     * @param value The value to check.
     */
    public static isByte(value: number): boolean
    {
        return Bytes.minimumValue <= value && value <= Bytes.maximumValue;
    }
}