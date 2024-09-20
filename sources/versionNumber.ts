import { Comparable } from "./comparable";
import { Comparison } from "./comparison";
import { DocumentIterator } from "./documentIterator";
import { DocumentRange } from "./documentRange";
import { NumberComparer } from "./numberComparer";
import { MissingValueParseError, WrongValueParseError } from "./parseError";
import { Pre } from "./pre";
import { Result } from "./result";
import { StringComparer } from "./stringComparer";
import { StringIterator } from "./stringIterator";
import { escapeAndQuote, getLength, isDigit, isWhitespace } from "./strings";

export class VersionNumber extends Comparable<VersionNumber>
{
    private numberSegments: number[];
    private suffix?: string;

    private constructor()
    {
        super();

        this.numberSegments = [];
    }

    public static create(): VersionNumber
    {
        return new VersionNumber();
    }

    public static parse(text: string): Result<VersionNumber>
    {
        Pre.condition.assertNotUndefinedAndNotNull(text, "text");

        return Result.create(() =>
        {
            const result: VersionNumber = VersionNumber.create();

            const characters: DocumentIterator = DocumentIterator.create(StringIterator.create(text)).start();

            while (characters.hasCurrent() && isWhitespace(characters.getCurrent()))
            {
                characters.next();
            }

            if (!characters.hasCurrent())
            {
                throw new MissingValueParseError(
                    DocumentRange.create(characters.getPosition()),
                    "version number",
                );
            }

            let suffix: string = "";
            if (isDigit(characters.getCurrent()))
            {
                result.addNumberSegment(VersionNumber.readUnsignedInteger(characters).await());

                while (characters.hasCurrent() && characters.getCurrent() === ".")
                {
                    characters.next();

                    if (!characters.hasCurrent() || !isDigit(characters.getCurrent()))
                    {
                        suffix = ".";
                        break;
                    }

                    result.addNumberSegment(VersionNumber.readUnsignedInteger(characters).await());
                }
            }

            while (characters.hasCurrent() && !isWhitespace(characters.getCurrent()))
            {
                suffix += characters.takeCurrent();
            }
            if (suffix !== "")
            {
                result.setSuffix(suffix);
            }

            return result;
        });
    }

    private static readUnsignedInteger(characters: DocumentIterator): Result<number>
    {
        Pre.condition.assertNotUndefinedAndNotNull(characters, "characters");

        return Result.create(() =>
        {
            characters.start();

            if (!characters.hasCurrent())
            {
                throw new MissingValueParseError(
                    DocumentRange.create(characters.getPosition()),
                    "unsigned integer.");
            }
            else if (!isDigit(characters.getCurrent()))
            {
                throw new WrongValueParseError(
                    DocumentRange.create(characters.getPosition()),
                    `unsigned integer`,
                    escapeAndQuote(characters.getCurrent()),
                );
            }

            let resultText: string = "";
            do
            {
                resultText += characters.takeCurrent();
            }
            while (characters.hasCurrent() && isDigit(characters.getCurrent()));

            return parseInt(resultText);
        });
    }

    public addNumberSegment(segment: number): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(segment, "segment");

        this.numberSegments.push(segment);

        return this;
    }

    public getMajor(): number | undefined
    {
        return this.numberSegments.length >= 1 ? this.numberSegments[0] : undefined;
    }

    public setMajor(major: number): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(major, "major");
        Pre.condition.assertGreaterThanOrEqualTo(major, 0, "major");
        Pre.condition.assertInteger(major, "major");

        if (this.numberSegments.length === 0)
        {
            this.addNumberSegment(major);
        }
        else
        {
            this.numberSegments[0] = major;
        }

        return this;
    }

    public getMinor(): number | undefined
    {
        return this.numberSegments.length >= 2 ? this.numberSegments[1] : undefined;
    }

    public setMinor(minor: number): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(minor, "minor");
        Pre.condition.assertGreaterThanOrEqualTo(minor, 0, "minor");
        Pre.condition.assertInteger(minor, "minor");

        if (this.numberSegments.length === 0)
        {
            this.addNumberSegment(0);
        }
        if (this.numberSegments.length === 1)
        {
            this.addNumberSegment(minor);
        }
        else
        {
            this.numberSegments[1] = minor;
        }

        return this;
    }

    public getPatch(): number | undefined
    {
        return this.numberSegments.length >= 3 ? this.numberSegments[2] : undefined;
    }

    public setPatch(patch: number): this
    {
        Pre.condition.assertNotUndefinedAndNotNull(patch, "patch");
        Pre.condition.assertGreaterThanOrEqualTo(patch, 0, "patch");
        Pre.condition.assertInteger(patch, "patch");

        while (this.numberSegments.length < 2)
        {
            this.addNumberSegment(0);
        }

        if (this.numberSegments.length === 2)
        {
            this.addNumberSegment(patch);
        }
        else
        {
            this.numberSegments[2] = patch;
        }

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
        let result: Comparison;
        if (right === undefined || right === null)
        {
            result = Comparison.GreaterThan;
        }
        else
        {
            result = Comparison.Equal;
            const leftNumberCount: number = this.numberSegments.length;
            const rightNumberCount: number = right.numberSegments.length;
            const maximumNumberCount: number = leftNumberCount > rightNumberCount ? leftNumberCount : rightNumberCount;
            for (let index: number = 0; index < maximumNumberCount; index++)
            {
                const leftNumber: number = index < leftNumberCount ? this.numberSegments[index] : 0;
                const rightNumber: number = index < rightNumberCount ? right.numberSegments[index] : 0;
                result = NumberComparer.compare(leftNumber, rightNumber);
                if (result !== Comparison.Equal)
                {
                    break;
                }
            }

            if (result === Comparison.Equal)
            {
                const leftSuffix: string = this.suffix || "";
                const rightSuffix: string = right.suffix || "";
                result = StringComparer.compare(leftSuffix, rightSuffix);
            }
        }
        return result;
    }

    public override toString(): string
    {
        let result: string = "";

        for (const numberSegment of this.numberSegments)
        {
            if (result.length > 0)
            {
                result += ".";
            }
            result += numberSegment;
        }

        if (getLength(this.suffix) > 0)
        {
            result += this.suffix;
        }

        return result;
    }
}