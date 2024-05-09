import * as assert from "assert";

import { Comparison, MissingValueParseError, PreConditionError, VersionNumber, andList, escapeAndQuote, toString } from "../sources";

suite("versionNumber.ts", () =>
{
    suite("VersionNumber", () =>
    {
        test("create()", () =>
        {
            const versionNumber: VersionNumber = VersionNumber.create();
            assert.strictEqual(versionNumber.getMajor(), undefined);
            assert.strictEqual(versionNumber.getMinor(), undefined);
            assert.strictEqual(versionNumber.getPatch(), undefined);
            assert.strictEqual(versionNumber.getSuffix(), undefined);
        });

        suite("parse(string)", () =>
        {
            function parseErrorTest(text: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    assert.throws(() => VersionNumber.parse(text).await(), expected);
                });
            }

            parseErrorTest(
                undefined!,
                new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            parseErrorTest(
                null!,
                new PreConditionError(
                    "Expression: text",
                    "Expected: not undefined and not null",
                    "Actual: null"));
            parseErrorTest(
                "",
                new MissingValueParseError("version number"),
            );
            parseErrorTest(
                "   ",
                new MissingValueParseError("version number"),
            );

            function parseTest(text: string, expected: VersionNumber): void
            {
                test(`with ${escapeAndQuote(text)}`, () =>
                {
                    const versionNumber: VersionNumber = VersionNumber.parse(text).await();
                    assert.deepStrictEqual(versionNumber, expected);
                    assert.strictEqual(versionNumber.equals(expected), true);
                });
            }

            parseTest(".", VersionNumber.create().setSuffix("."));
            parseTest(".5", VersionNumber.create().setSuffix(".5"));
            parseTest("0", VersionNumber.create().setMajor(0));
            parseTest("0.", VersionNumber.create().setMajor(0).setSuffix("."));
            parseTest("1", VersionNumber.create().setMajor(1));
            parseTest("1.", VersionNumber.create().setMajor(1).setSuffix("."));
            parseTest("12", VersionNumber.create().setMajor(12));
            parseTest("12.", VersionNumber.create().setMajor(12).setSuffix("."));
            parseTest("1.2", VersionNumber.create().setMajor(1).setMinor(2));
            parseTest("1.2.", VersionNumber.create().setMajor(1).setMinor(2).setSuffix("."));
            parseTest("1.2.3", VersionNumber.create().setMajor(1).setMinor(2).setPatch(3));
            parseTest("1.2.3.4", VersionNumber.create().setMajor(1).setMinor(2).setPatch(3).addNumberSegment(4));
            parseTest("1.2.3.4.5", VersionNumber.create().setMajor(1).setMinor(2).setPatch(3).addNumberSegment(4).addNumberSegment(5));
            parseTest("alpha", VersionNumber.create().setSuffix("alpha"));
        });

        suite("setMajor(number)", () =>
        {
            function setMajorErrorTest(value: number, expected: Error): void
            {
                test(`with ${value}`, () =>
                {
                    const versionNumber: VersionNumber = VersionNumber.create();
                    assert.throws(() => versionNumber.setMajor(value), expected);
                    assert.strictEqual(versionNumber.getMajor(), undefined);
                });
            }

            setMajorErrorTest(
                undefined!,
                new PreConditionError(
                    "Expression: major",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            setMajorErrorTest(
                null!,
                new PreConditionError(
                    "Expression: major",
                    "Expected: not undefined and not null",
                    "Actual: null"));
            setMajorErrorTest(
                -1,
                new PreConditionError(
                    "Expression: major",
                    "Expected: greater than or equal to 0",
                    "Actual: -1"));
            setMajorErrorTest(
                0.1,
                new PreConditionError(
                    "Expression: major",
                    "Expected: integer",
                    "Actual: 0.1"));

            function setMajorTest(versionNumber: VersionNumber, major: number, expectedMinor?: number, expectedPatch?: number, expectedSuffix?: string): void
            {
                test(`with ${andList([versionNumber, major].map(toString))}`, () =>
                {
                    const setMajorResult: VersionNumber = versionNumber.setMajor(major);

                    assert.strictEqual(setMajorResult, versionNumber);
                    assert.strictEqual(versionNumber.getMajor(), major);
                    assert.strictEqual(versionNumber.getMinor(), expectedMinor);
                    assert.strictEqual(versionNumber.getPatch(), expectedPatch);
                    assert.strictEqual(versionNumber.getSuffix(), expectedSuffix);
                });
            }

            setMajorTest(VersionNumber.create(), 0);
            setMajorTest(VersionNumber.create(), 1);
            setMajorTest(VersionNumber.create().setMajor(1), 2);
            setMajorTest(VersionNumber.create().setMinor(3), 4, 3);
        });

        suite("setMinor(number)", () =>
        {
            function setMinorErrorTest(minor: number, expected: Error): void
            {
                test(`with ${minor}`, () =>
                {
                    const versionNumber: VersionNumber = VersionNumber.create();
                    assert.throws(() => versionNumber.setMinor(minor), expected);
                    assert.strictEqual(versionNumber.getMajor(), undefined);
                    assert.strictEqual(versionNumber.getMinor(), undefined);
                    assert.strictEqual(versionNumber.getPatch(), undefined);
                    assert.strictEqual(versionNumber.getSuffix(), undefined);
                });
            }

            setMinorErrorTest(
                undefined!,
                new PreConditionError(
                    "Expression: minor",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            setMinorErrorTest(
                null!,
                new PreConditionError(
                    "Expression: minor",
                    "Expected: not undefined and not null",
                    "Actual: null"));
            setMinorErrorTest(
                -1,
                new PreConditionError(
                    "Expression: minor",
                    "Expected: greater than or equal to 0",
                    "Actual: -1"));
            setMinorErrorTest(
                0.1,
                new PreConditionError(
                    "Expression: minor",
                    "Expected: integer",
                    "Actual: 0.1"));

            function setMinorTest(versionNumber: VersionNumber, expectedMajor: number, minor: number, expectedPatch?: number, expectedSuffix?: string): void
            {
                test(`with ${andList([versionNumber, minor].map(toString))}`, () =>
                {
                    const setMinorResult: VersionNumber = versionNumber.setMinor(minor);

                    assert.strictEqual(setMinorResult, versionNumber);
                    assert.strictEqual(versionNumber.getMajor(), expectedMajor);
                    assert.strictEqual(versionNumber.getMinor(), minor);
                    assert.strictEqual(versionNumber.getPatch(), expectedPatch);
                    assert.strictEqual(versionNumber.getSuffix(), expectedSuffix);
                });
            }

            setMinorTest(VersionNumber.create(), 0, 0);
            setMinorTest(VersionNumber.create(), 0, 1);
            setMinorTest(VersionNumber.create().setMajor(1), 1, 2);
            setMinorTest(VersionNumber.create().setMinor(3), 0, 4);
            setMinorTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(3).setSuffix("d"), 1, 99, 3, "d");
        });

        suite("setPatch(number)", () =>
        {
            function setPatchErrorTest(patch: number, expected: Error): void
            {
                test(`with ${patch}`, () =>
                {
                    const versionNumber: VersionNumber = VersionNumber.create();
                    assert.throws(() => versionNumber.setPatch(patch), expected);
                    assert.strictEqual(versionNumber.getMajor(), undefined);
                    assert.strictEqual(versionNumber.getMinor(), undefined);
                    assert.strictEqual(versionNumber.getPatch(), undefined);
                    assert.strictEqual(versionNumber.getSuffix(), undefined);
                });
            }

            setPatchErrorTest(
                undefined!,
                new PreConditionError(
                    "Expression: patch",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            setPatchErrorTest(
                null!,
                new PreConditionError(
                    "Expression: patch",
                    "Expected: not undefined and not null",
                    "Actual: null"));
            setPatchErrorTest(
                -1,
                new PreConditionError(
                    "Expression: patch",
                    "Expected: greater than or equal to 0",
                    "Actual: -1"));
            setPatchErrorTest(
                0.1,
                new PreConditionError(
                    "Expression: patch",
                    "Expected: integer",
                    "Actual: 0.1"));

            function setPatchTest(versionNumber: VersionNumber, expectedMajor: number, expectedMinor: number, patch: number, expectedSuffix?: string): void
            {
                test(`with ${andList([versionNumber, patch].map(toString))}`, () =>
                {
                    const setPatchResult: VersionNumber = versionNumber.setPatch(patch);

                    assert.strictEqual(setPatchResult, versionNumber);
                    assert.strictEqual(versionNumber.getMajor(), expectedMajor);
                    assert.strictEqual(versionNumber.getMinor(), expectedMinor);
                    assert.strictEqual(versionNumber.getPatch(), patch);
                    assert.strictEqual(versionNumber.getSuffix(), expectedSuffix);
                });
            }

            setPatchTest(VersionNumber.create(), 0, 0, 0);
            setPatchTest(VersionNumber.create(), 0, 0, 1);
            setPatchTest(VersionNumber.create().setMajor(1), 1, 0, 2);
            setPatchTest(VersionNumber.create().setMinor(3), 0, 3, 4);
            setPatchTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(3).setSuffix("d"), 1, 2, 99, "d");
        });

        suite("setSuffix(string)", () =>
        {
            function setSuffixErrorTest(suffix: string, expected: Error): void
            {
                test(`with ${escapeAndQuote(suffix)}`, () =>
                {
                    const versionNumber: VersionNumber = VersionNumber.create();
                    assert.throws(() => versionNumber.setSuffix(suffix), expected);
                    assert.strictEqual(versionNumber.getMajor(), undefined);
                    assert.strictEqual(versionNumber.getMinor(), undefined);
                    assert.strictEqual(versionNumber.getPatch(), undefined);
                    assert.strictEqual(versionNumber.getSuffix(), undefined);
                });
            }

            setSuffixErrorTest(
                undefined!,
                new PreConditionError(
                    "Expression: suffix",
                    "Expected: not undefined and not null",
                    "Actual: undefined"));
            setSuffixErrorTest(
                null!,
                new PreConditionError(
                    "Expression: suffix",
                    "Expected: not undefined and not null",
                    "Actual: null"));
            setSuffixErrorTest(
                "",
                new PreConditionError(
                    "Expression: suffix",
                    "Expected: not empty",
                    "Actual: \"\""));

            function setSuffixTest(versionNumber: VersionNumber, expectedMajor: number | undefined, expectedMinor: number | undefined, expectedPatch: number | undefined, suffix: string): void
            {
                test(`with ${andList([versionNumber, escapeAndQuote(suffix)].map(toString))}`, () =>
                {
                    const setSuffixResult: VersionNumber = versionNumber.setSuffix(suffix);

                    assert.strictEqual(setSuffixResult, versionNumber);
                    assert.strictEqual(versionNumber.getMajor(), expectedMajor);
                    assert.strictEqual(versionNumber.getMinor(), expectedMinor);
                    assert.strictEqual(versionNumber.getPatch(), expectedPatch);
                    assert.strictEqual(versionNumber.getSuffix(), suffix);
                });
            }

            setSuffixTest(VersionNumber.create(), undefined, undefined, undefined, "a");
            setSuffixTest(VersionNumber.create(), undefined, undefined, undefined, "alpha");
            setSuffixTest(VersionNumber.create().setMajor(1), 1, undefined, undefined, "-prerelease");
            setSuffixTest(VersionNumber.create().setMinor(3), 0, 3, undefined, "-beta");
            setSuffixTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(3).setSuffix("d"), 1, 2, 3, "-marshmallow");
        });

        suite("compareTo(VersionNumber)", () =>
        {
            function compareToTest(left: VersionNumber, right: VersionNumber, expected: Comparison): void
            {
                test(`with ${andList([left, right].map(toString))}`, () =>
                {
                    assert.strictEqual(left.compareTo(right), expected);
                });
            }

            compareToTest(VersionNumber.create(), undefined!, Comparison.GreaterThan);
            compareToTest(VersionNumber.create(), null!, Comparison.GreaterThan);

            compareToTest(VersionNumber.create(), VersionNumber.create(), Comparison.Equal);
            compareToTest(VersionNumber.create(), VersionNumber.create().setMajor(1), Comparison.LessThan);
            
            compareToTest(VersionNumber.create().setMajor(1), VersionNumber.create().setMajor(2), Comparison.LessThan);
            compareToTest(VersionNumber.create().setMajor(2), VersionNumber.create().setMajor(2), Comparison.Equal);
            compareToTest(VersionNumber.create().setMajor(3), VersionNumber.create().setMajor(2), Comparison.GreaterThan);

            compareToTest(VersionNumber.create().setMajor(1), VersionNumber.create().setMajor(1).setMinor(0), Comparison.Equal);
            compareToTest(VersionNumber.create().setMajor(1).setMinor(0), VersionNumber.create().setMajor(1), Comparison.Equal);
            compareToTest(VersionNumber.create().setMajor(1).setMinor(0), VersionNumber.create().setMajor(1).setMinor(0), Comparison.Equal);
            compareToTest(VersionNumber.create().setMajor(1).setMinor(2), VersionNumber.create().setMajor(1).setMinor(3), Comparison.LessThan);
            compareToTest(VersionNumber.create().setMajor(1).setMinor(3), VersionNumber.create().setMajor(1).setMinor(3), Comparison.Equal);
            compareToTest(VersionNumber.create().setMajor(1).setMinor(4), VersionNumber.create().setMajor(1).setMinor(3), Comparison.GreaterThan);
            compareToTest(VersionNumber.create().setMajor(1).setMinor(2), VersionNumber.create().setMajor(1).setMinor(2).setPatch(0), Comparison.Equal);
            compareToTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(0), VersionNumber.create().setMajor(1).setMinor(2), Comparison.Equal);
            compareToTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(0), VersionNumber.create().setMajor(1).setMinor(2).setPatch(3), Comparison.LessThan);
            compareToTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(3), VersionNumber.create().setMajor(1).setMinor(2).setPatch(3), Comparison.Equal);
            compareToTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(4), VersionNumber.create().setMajor(1).setMinor(2).setPatch(3), Comparison.GreaterThan);
            compareToTest(VersionNumber.create().setMajor(1).setSuffix("a"), VersionNumber.create().setMajor(1), Comparison.GreaterThan);
            compareToTest(VersionNumber.create().setMajor(1), VersionNumber.create().setMajor(1).setSuffix("b"), Comparison.LessThan);
            compareToTest(VersionNumber.create().setMajor(1).setSuffix("a"), VersionNumber.create().setMajor(1).setSuffix("a"), Comparison.Equal);
            compareToTest(VersionNumber.create().setMajor(1).setSuffix("a"), VersionNumber.create().setMajor(1).setSuffix("b"), Comparison.LessThan);



        });

        suite("toString()", () =>
        {
            function toStringTest(versionNumber: VersionNumber, expected: string): void
            {
                test(`with ${versionNumber.toString()}`, () =>
                {
                    assert.strictEqual(versionNumber.toString(), expected);
                });
            }

            toStringTest(VersionNumber.create(), "");
            toStringTest(VersionNumber.create().setMajor(1), "1");
            toStringTest(VersionNumber.create().setMinor(2), "0.2");
            toStringTest(VersionNumber.create().setPatch(3), "0.0.3");
            toStringTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(3), "1.2.3");
            toStringTest(VersionNumber.create().setSuffix("alpha"), "alpha");
            toStringTest(VersionNumber.create().setMajor(1).setMinor(2).setSuffix("-prerelease"), "1.2-prerelease");
        });
    });
});