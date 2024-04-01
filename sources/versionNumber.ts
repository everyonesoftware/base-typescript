import { Comparable } from "./comparable";
import { Comparison } from "./comparison";
import { Pre } from "./pre";
import { getLength } from "./strings";

export class VersionNumber extends Comparable<VersionNumber>
{
    private major?: number;
    private minor?: number;
    private patch?: number;
    private suffix?: string;

    private constructor()
    {
        super();
    }

    public static create(): VersionNumber
    {
        return new VersionNumber();
    }

    public getMajor(): number | undefined
    {
        return this.major;
    }

    public setMajor(major: number): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(major, "major");
        Pre.condition.assertGreaterThanOrEqualTo(major, 0, "major");
        Pre.condition.assertInteger(major, "major");

        this.major = major;

        return this;
    }

    public getMinor(): number | undefined
    {
        return this.minor;
    }

    public setMinor(minor: number): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(minor, "minor");
        Pre.condition.assertGreaterThanOrEqualTo(minor, 0, "minor");
        Pre.condition.assertInteger(minor, "minor");

        if (this.getMajor() === undefined)
        {
            this.setMajor(0);
        }
        this.minor = minor;

        return this;
    }

    public getPatch(): number | undefined
    {
        return this.patch;
    }

    public setPatch(patch: number): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(patch, "patch");
        Pre.condition.assertGreaterThanOrEqualTo(patch, 0, "patch");
        Pre.condition.assertInteger(patch, "patch");

        if (this.getMinor() === undefined)
        {
            this.setMinor(0);
        }
        this.patch = patch;

        return this;
    }

    public getSuffix(): string | undefined
    {
        return this.suffix;
    }

    public setSuffix(suffix: string): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(suffix, "suffix");
        Pre.condition.assertNotEmpty(suffix, "suffix");

        this.suffix = suffix;

        return this;
    }

    public override compareTo(right: VersionNumber): Comparison
    {
        let result: Comparison = Comparison.GreaterThan;
        if (right !== undefined && right !== null)
        {

        }
        return result;
    }

    public override toString(): string
    {
        let result: string = "";
        if (this.major !== undefined)
        {
            result += this.major;
        }
        if (this.minor !== undefined)
        {
            if (result.length > 0)
            {
                result += ".";
            }
            result += this.minor;
        }
        if (this.patch !== undefined)
        {
            if (result.length > 0)
            {
                result += ".";
            }
            result += this.patch;
        }
        if (getLength(this.suffix) > 0)
        {
            result += this.suffix;
        }

        return result;
    }
}