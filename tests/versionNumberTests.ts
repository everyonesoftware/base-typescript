import { Test, TestRunner } from "@everyonesoftware/test-typescript";
import { Comparison, MissingValueParseError, PreConditionError, VersionNumber } from "../sources";

export function test(runner: TestRunner): void
{
    runner.testFile("versionNumber.ts", () =>
    {
        runner.testType(VersionNumber.name, () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const versionNumber: VersionNumber = VersionNumber.create();
                test.assertUndefined(versionNumber.getMajor());
                test.assertUndefined(versionNumber.getMinor());
                test.assertUndefined(versionNumber.getPatch());
                test.assertUndefined(versionNumber.getSuffix());
            });

            runner.testFunction("parse(string)", () =>
            {
                function parseErrorTest(text: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        test.assertThrows(() => VersionNumber.parse(text).await(), expected);
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
                    runner.test(`with ${runner.toString(text)}`, (test: Test) =>
                    {
                        const versionNumber: VersionNumber = VersionNumber.parse(text).await();
                        test.assertEqual(versionNumber, expected);
                        test.assertTrue(versionNumber.equals(expected));
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

            runner.testFunction("setMajor(number)", () =>
            {
                function setMajorErrorTest(value: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(value)}`, (test: Test) =>
                    {
                        const versionNumber: VersionNumber = VersionNumber.create();
                        test.assertThrows(() => versionNumber.setMajor(value), expected);
                        test.assertUndefined(versionNumber.getMajor());
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
                    runner.test(`with ${runner.andList([versionNumber, major])}`, (test: Test) =>
                    {
                        const setMajorResult: VersionNumber = versionNumber.setMajor(major);

                        test.assertEqual(setMajorResult, versionNumber);
                        test.assertEqual(versionNumber.getMajor(), major);
                        test.assertEqual(versionNumber.getMinor(), expectedMinor);
                        test.assertEqual(versionNumber.getPatch(), expectedPatch);
                        test.assertEqual(versionNumber.getSuffix(), expectedSuffix);
                    });
                }

                setMajorTest(VersionNumber.create(), 0);
                setMajorTest(VersionNumber.create(), 1);
                setMajorTest(VersionNumber.create().setMajor(1), 2);
                setMajorTest(VersionNumber.create().setMinor(3), 4, 3);
            });

            runner.testFunction("setMinor(number)", () =>
            {
                function setMinorErrorTest(minor: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(minor)}`, (test: Test) =>
                    {
                        const versionNumber: VersionNumber = VersionNumber.create();
                        test.assertThrows(() => versionNumber.setMinor(minor), expected);
                        test.assertUndefined(versionNumber.getMajor());
                        test.assertUndefined(versionNumber.getMinor());
                        test.assertUndefined(versionNumber.getPatch());
                        test.assertUndefined(versionNumber.getSuffix());
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
                    runner.test(`with ${runner.andList([versionNumber, minor])}`, (test: Test) =>
                    {
                        const setMinorResult: VersionNumber = versionNumber.setMinor(minor);

                        test.assertSame(setMinorResult, versionNumber);
                        test.assertSame(versionNumber.getMajor(), expectedMajor);
                        test.assertSame(versionNumber.getMinor(), minor);
                        test.assertSame(versionNumber.getPatch(), expectedPatch);
                        test.assertSame(versionNumber.getSuffix(), expectedSuffix);
                    });
                }

                setMinorTest(VersionNumber.create(), 0, 0);
                setMinorTest(VersionNumber.create(), 0, 1);
                setMinorTest(VersionNumber.create().setMajor(1), 1, 2);
                setMinorTest(VersionNumber.create().setMinor(3), 0, 4);
                setMinorTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(3).setSuffix("d"), 1, 99, 3, "d");
            });

            runner.testFunction("setPatch(number)", () =>
            {
                function setPatchErrorTest(patch: number, expected: Error): void
                {
                    runner.test(`with ${runner.toString(patch)}`, (test: Test) =>
                    {
                        const versionNumber: VersionNumber = VersionNumber.create();
                        test.assertThrows(() => versionNumber.setPatch(patch), expected);
                        test.assertUndefined(versionNumber.getMajor());
                        test.assertUndefined(versionNumber.getMinor());
                        test.assertUndefined(versionNumber.getPatch());
                        test.assertUndefined(versionNumber.getSuffix());
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
                    runner.test(`with ${runner.andList([versionNumber, patch])}`, (test: Test) =>
                    {
                        const setPatchResult: VersionNumber = versionNumber.setPatch(patch);

                        test.assertSame(setPatchResult, versionNumber);
                        test.assertSame(versionNumber.getMajor(), expectedMajor);
                        test.assertSame(versionNumber.getMinor(), expectedMinor);
                        test.assertSame(versionNumber.getPatch(), patch);
                        test.assertSame(versionNumber.getSuffix(), expectedSuffix);
                    });
                }

                setPatchTest(VersionNumber.create(), 0, 0, 0);
                setPatchTest(VersionNumber.create(), 0, 0, 1);
                setPatchTest(VersionNumber.create().setMajor(1), 1, 0, 2);
                setPatchTest(VersionNumber.create().setMinor(3), 0, 3, 4);
                setPatchTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(3).setSuffix("d"), 1, 2, 99, "d");
            });

            runner.testFunction("setSuffix(string)", () =>
            {
                function setSuffixErrorTest(suffix: string, expected: Error): void
                {
                    runner.test(`with ${runner.toString(suffix)}`, (test: Test) =>
                    {
                        const versionNumber: VersionNumber = VersionNumber.create();
                        test.assertThrows(() => versionNumber.setSuffix(suffix), expected);
                        test.assertUndefined(versionNumber.getMajor());
                        test.assertUndefined(versionNumber.getMinor());
                        test.assertUndefined(versionNumber.getPatch());
                        test.assertUndefined(versionNumber.getSuffix());
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
                    runner.test(`with ${runner.andList([versionNumber, suffix])}`, (test: Test) =>
                    {
                        const setSuffixResult: VersionNumber = versionNumber.setSuffix(suffix);

                        test.assertSame(setSuffixResult, versionNumber);
                        test.assertSame(versionNumber.getMajor(), expectedMajor);
                        test.assertSame(versionNumber.getMinor(), expectedMinor);
                        test.assertSame(versionNumber.getPatch(), expectedPatch);
                        test.assertSame(versionNumber.getSuffix(), suffix);
                    });
                }

                setSuffixTest(VersionNumber.create(), undefined, undefined, undefined, "a");
                setSuffixTest(VersionNumber.create(), undefined, undefined, undefined, "alpha");
                setSuffixTest(VersionNumber.create().setMajor(1), 1, undefined, undefined, "-prerelease");
                setSuffixTest(VersionNumber.create().setMinor(3), 0, 3, undefined, "-beta");
                setSuffixTest(VersionNumber.create().setMajor(1).setMinor(2).setPatch(3).setSuffix("d"), 1, 2, 3, "-marshmallow");
            });

            runner.testFunction("compareTo(VersionNumber)", () =>
            {
                function compareToTest(left: VersionNumber, right: VersionNumber, expected: Comparison): void
                {
                    runner.test(`with ${runner.andList([left, right])}`, (test: Test) =>
                    {
                        test.assertSame(left.compareTo(right), expected);
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

            runner.testFunction("toString()", () =>
            {
                function toStringTest(versionNumber: VersionNumber, expected: string): void
                {
                    runner.test(`with ${versionNumber.toString()}`, (test: Test) =>
                    {
                        test.assertSame(versionNumber.toString(), expected);
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
}
test(TestRunner.create());